import axios from 'axios';
import { distanceTo } from 'geolocation-utils';
import handleHttpError from '../utilities/handleHttpError';
import Store from '../store';
// import translate from '../utilities/translator';
import * as globalConfig from '../../../../global-config';

const searchActiveMoments = async (req: any, res: any) => {
    const authorization = req.headers.authorization;
    const userId = req.headers['x-userid'];
    const locale = req.headers['x-localecode'] || 'en-us';
    const {
        limit,
        offset,
        order,
        blockedUsers,
        shouldHideMatureContent,
        withMedia,
        withUser,
        withBookmark,
        userLatitude,
        userLongitude, // TODO: Fetch coords from user redis store instead?
    } = req.body;

    const conditions: any = {
        userId,
        userHasActivated: true,
    };

    // Hide reported content
    if (shouldHideMatureContent) {
        conditions.userHasReported = false;
    }

    const customs: any = {};
    if (withBookmark) {
        customs.withBookmark = true;
    }

    let reactions;

    return Store.momentReactions.get(conditions, undefined, {
        limit: limit || 50,
        offset,
        order: order || 0,
    }, customs)
        .then((reactionsResponse) => {
            reactions = reactionsResponse;
            const momentIds = reactions?.map((reaction) => reaction.momentId) || [];

            return axios({
                method: 'post',
                url: `${globalConfig[process.env.NODE_ENV].baseMapsServiceRoute}/moments/find`,
                headers: {
                    authorization,
                    'x-localecode': locale,
                    'x-userid': userId,
                },
                data: {
                    momentIds,
                    order,
                    withMedia,
                    withUser,
                },
            });
        })
        .then((response) => {
            let moments = response?.data?.moments;
            moments = moments.map((moment) => {
                const alteredMoment = moment;
                if (userLatitude && userLongitude) {
                    const distance = distanceTo({
                        lon: moment.longitude,
                        lat: moment.latitude,
                    }, {
                        lon: userLongitude,
                        lat: userLatitude,
                    }) / 1069.344; // convert meters to miles
                    alteredMoment.distance = Math.round(distance * 10) / 10;
                }
                return {
                    ...alteredMoment,
                    reaction: reactions.find((reaction) => reaction.momentId === moment.id) || {},
                };
            }).filter((moment) => !blockedUsers.includes(moment.fromUserId));
            return res.status(200).send({
                moments,
                media: response?.data?.media,
                pagination: {
                    itemsPerPage: limit,
                    offset,
                    isLastPage: response?.data?.moments?.length < limit,
                },
            });
        })
        .catch((err) => handleHttpError({ err, res, message: 'SQL:MOMENT_REACTIONS_ROUTES:ERROR' }));
};

const searchBookmarkedMoments = async (req: any, res: any) => {
    req.body.withBookmark = true;

    return searchActiveMoments(req, res);
};

export {
    searchActiveMoments,
    searchBookmarkedMoments,
};
