import axios from 'axios';
import path from 'path';
import { getSearchQueryArgs, getSearchQueryString } from 'therr-js-utilities/http';
import { ErrorCodes } from 'therr-js-utilities/constants';
import { RequestHandler } from 'express';
import { storage } from '../api/aws';
import * as globalConfig from '../../../../global-config';
import getReactions from '../utilities/getReactions';
import handleHttpError from '../utilities/handleHttpError';
import translate from '../utilities/translator';
import Store from '../store';

// CREATE
const createSpace = (req, res) => {
    const authorization = req.headers.authorization;
    const locale = req.headers['x-localecode'] || 'en-us';
    const userId = req.headers['x-userid'];

    return Store.spaces.createSpace({
        ...req.body,
        locale,
        fromUserId: userId,
    })
        .then(([space]) => axios({ // Create companion reaction for user's own space
            method: 'post',
            url: `${globalConfig[process.env.NODE_ENV].baseReactionsServiceRoute}/space-reactions/${space.id}`,
            headers: {
                authorization,
                'x-localecode': locale,
                'x-userid': userId,
            },
            data: {
                userHasActivated: true,
            },
        }).then(({ data: reaction }) => res.status(201).send({
            ...space,
            reaction,
        })))
        .catch((err) => {
            if (err?.constraint === 'no_overlaps') {
                return handleHttpError({
                    res,
                    message: translate(locale, 'spaces.noOverlap'),
                    statusCode: 400,
                    errorCode: ErrorCodes.NO_SPACE_OVERLAP,
                });
            }

            return handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' });
        });
};

// READ
const getSpaceDetails = (req, res) => {
    const userId = req.headers['x-userid'];
    const locale = req.headers['x-localecode'] || 'en-us';

    const { spaceId } = req.params;

    const {
        withMedia,
        withUser,
    } = req.body;

    const shouldFetchMedia = !!withMedia;
    const shouldFetchUser = !!withUser;

    return Store.spaces.findSpaces([spaceId], {
        limit: 1,
    }, {
        withMedia: shouldFetchMedia,
        withUser: shouldFetchUser,
    })
        .then(({ spaces, media, users }) => {
            const space = spaces[0];
            let userHasAccessPromise = () => Promise.resolve(true);
            // Verify that user has activated space and has access to view it
            if (space.fromUserId !== userId) {
                userHasAccessPromise = () => getReactions(spaceId, {
                    'x-userid': userId,
                });
            }

            return userHasAccessPromise().then((isActivated) => {
                if (!isActivated) {
                    return handleHttpError({
                        res,
                        message: translate(locale, 'spaceReactions.spaceNotActivated'),
                        statusCode: 400,
                        errorCode: ErrorCodes.SPACE_ACCESS_RESTRICTED,
                    });
                }

                return res.status(200).send({ space, media, users });
            });
        }).catch((err) => handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' }));
};

const searchSpaces: RequestHandler = async (req: any, res: any) => {
    const userId = req.headers['x-userid'];
    const {
        // filterBy,
        query,
        itemsPerPage,
        // longitude,
        // latitude,
        pageNumber,
    } = req.query;
    const {
        distanceOverride,
    } = req.body;

    const integerColumns = ['maxViews', 'longitude', 'latitude'];
    const searchArgs = getSearchQueryArgs(req.query, integerColumns);
    let fromUserIds;
    if (query === 'me') {
        fromUserIds = [userId];
    } else if (query === 'connections') {
        let queryString = getSearchQueryString({
            filterBy: 'acceptingUserId',
            query: userId,
            itemsPerPage,
            pageNumber: 1,
            orderBy: 'interactionCount',
            order: 'desc',
        });
        queryString = `${queryString}&shouldCheckReverse=true`;
        const connectionsResponse: any = await axios({
            method: 'get',
            url: `${globalConfig[process.env.NODE_ENV].baseUsersServiceRoute}/users/connections${queryString}`,
            headers: {
                authorization: req.headers.authorization,
                'x-localecode': req.headers['x-localecode'] || 'en-us',
                'x-userid': userId,
            },
        });
        fromUserIds = connectionsResponse.data.results
            .map((connection: any) => connection.users.filter((user: any) => user.id != userId)[0].id); // eslint-disable-line eqeqeq
    }
    const searchPromise = Store.spaces.searchSpaces(searchArgs[0], searchArgs[1], fromUserIds, { distanceOverride }, query !== 'me');
    // const countPromise = Store.spaces.countRecords({
    //     filterBy,
    //     query,
    //     longitude,
    //     latitude,
    // }, fromUserIds);
    const countPromise = Promise.resolve();

    // TODO: Get associated reactions for user and return limited details if space is not yet activated
    return Promise.all([searchPromise, countPromise]).then(([results]) => {
        const response = {
            results,
            pagination: {
                // totalItems: Number(countResult[0].count),
                totalItems: Number(100), // arbitraty number because count is slow and not needed
                itemsPerPage: Number(itemsPerPage),
                pageNumber: Number(pageNumber),
            },
        };

        res.status(200).send(response);
    })
        .catch((err) => handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' }));
};

// NOTE: This should remain a non-public endpoint
const findSpaces: RequestHandler = async (req: any, res: any) => {
    // const userId = req.headers['x-userid'];

    const {
        limit,
        order,
        spaceIds,
        withMedia,
        withUser,
    } = req.body;

    return Store.spaces.findSpaces(spaceIds, {
        limit: limit || 21,
        order,
    }, {
        withMedia: !!withMedia,
        withUser: !!withUser,
    })
        .then(({ spaces, media }) => res.status(200).send({ spaces, media }))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' }));
};

const getSignedUrl = (req, res, bucket) => {
    const requestId = req.headers['x-requestid'];
    const userId = req.headers['x-userid'];

    const {
        action,
        filename,
    } = req.query;

    const options: any = {
        version: 'v4',
        action,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // TODO: Improve
    const parsedFileName = path.parse(filename);
    const directory = parsedFileName.dir ? `${parsedFileName.dir}/` : '';

    const filePath = `${userId}/${directory}${parsedFileName.name}_${requestId}${parsedFileName.ext}`;

    return storage
        .bucket(bucket)
        .file(filePath)
        .getSignedUrl(options)
        .then((url) => res.status(201).send({
            url,
            path: `${filePath}`,
        }))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' }));
};

// TODO: Use Env variables
const getSignedUrlPrivateBucket = (req, res) => getSignedUrl(req, res, process.env.BUCKET_PRIVATE_USER_DATA);

const getSignedUrlPublicBucket = (req, res) => getSignedUrl(req, res, process.env.BUCKET_PUBLIC_USER_DATA);

// DELETE
const deleteSpaces = (req, res) => {
    const userId = req.headers['x-userid'];
    // TODO: RSERV-52 | Consider archiving only, and delete/archive associated reactions from reactions-service

    return Store.spaces.deleteSpaces({
        ...req.body,
        fromUserId: userId,
    })
        .then(([spaces]) => res.status(202).send(spaces))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:SPACES_ROUTES:ERROR' }));
};

export {
    createSpace,
    getSpaceDetails,
    searchSpaces,
    findSpaces,
    getSignedUrlPrivateBucket,
    getSignedUrlPublicBucket,
    deleteSpaces,
};