import axios from 'axios';
import { getSearchQueryArgs, getSearchQueryString } from 'therr-js-utilities/http';
import { RequestHandler } from 'express';
import { Storage } from '@google-cloud/storage';
import * as globalConfig from '../../../../global-config';
import handleHttpError from '../utilities/handleHttpError';
import Store from '../store';

// CREATE
const createMoment = (req, res) => {
    const locale = req.headers['x-localecode'] || 'en-us';
    const userId = req.headers['x-userid'];

    return Store.moments.createMoment({
        ...req.body,
        locale,
        fromUserId: userId,
    })
        .then(([moments]) => res.status(201).send(moments))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENTS_ROUTES:ERROR' }));
};

// READ
const searchMoments: RequestHandler = async (req: any, res: any) => {
    const userId = req.headers['x-userid'];
    const {
        filterBy,
        query,
        itemsPerPage,
        longitude,
        latitude,
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
            itemsPerPage: 50,
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
    const searchPromise = Store.moments.searchMoments(searchArgs[0], searchArgs[1], fromUserIds, { distanceOverride });
    // const countPromise = Store.moments.countRecords({
    //     filterBy,
    //     query,
    //     longitude,
    //     latitude,
    // }, fromUserIds);
    const countPromise = Promise.resolve();

    // TODO: Get associated reactions for user and return limited details if moment is not yet activated
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
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENTS_ROUTES:ERROR' }));
};

// NOTE: This should remain a non-public endpoint
const findMoments: RequestHandler = async (req: any, res: any) => {
    // const userId = req.headers['x-userid'];

    const {
        limit,
        momentIds,
    } = req.body;

    return Store.moments.findMoments(momentIds, {
        limit: limit || 21,
    })
        .then((moments) => res.status(200).send(moments))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENTS_ROUTES:ERROR' }));
};

const getSignedUrl = (req, res, bucket) => {
    const requestId = req.headers['x-requestid'];
    const userId = req.headers['x-userid'];

    const {
        action,
        filename,
    } = req.query;

    const storage = new Storage({
        credentials: JSON.parse(Buffer.from(process.env.MAPS_SERVICE_GOOGLE_CREDENTIALS_BASE64 || '', 'base64').toString('utf8')),
    });
    const options: any = {
        version: 'v4',
        action,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const filePath = `${userId}/${filename}_${requestId}`;

    return storage
        .bucket(bucket)
        .file(filePath)
        .getSignedUrl(options)
        .then((url) => res.status(201).send({
            url,
            path: `${filePath}`,
        }))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENTS_ROUTES:ERROR' }));
};

// TODO: Use Env variables
const getSignedUrlPrivateBucket = (req, res) => getSignedUrl(req, res, process.env.BUCKET_PRIVATE_USER_DATA);

const getSignedUrlPublicBucket = (req, res) => getSignedUrl(req, res, process.env.BUCKET_PUBLIC_USER_DATA);

// DELETE
const deleteMoments = (req, res) => {
    const userId = req.headers['x-userid'];

    return Store.moments.deleteMoments({
        ...req.body,
        fromUserId: userId,
    })
        .then(([moments]) => res.status(202).send(moments))
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENTS_ROUTES:ERROR' }));
};

export {
    createMoment,
    searchMoments,
    findMoments,
    getSignedUrlPrivateBucket,
    getSignedUrlPublicBucket,
    deleteMoments,
};
