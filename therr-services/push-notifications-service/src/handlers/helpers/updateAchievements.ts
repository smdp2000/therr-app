import beeline from '../../beeline'; // eslint-disable-line import/order
import axios from 'axios';
import printLogs from 'therr-js-utilities/print-logs';
import * as globalConfig from '../../../../../global-config';

// TODO: Add single request enpoint to update multiple achievements
const updateAchievements = (headers, momentIdsToActivate, spaceIdsToActivate): Promise<any[]> => {
    const promises: Promise<any>[] = [];

    if (momentIdsToActivate.length) {
        promises.push(axios({
            method: 'post',
            url: `${globalConfig[process.env.NODE_ENV].baseUsersServiceRoute}/users/achievements`,
            headers: {
                authorization: headers.authorization,
                'x-localecode': headers.locale,
                'x-userid': headers.userId,
            },
            data: {
                achievementClass: 'explorer',
                achievementTier: '1_1',
                progressCount: momentIdsToActivate.length,
            },
        }));
    }
    if (spaceIdsToActivate.length) {
        promises.push(axios({
            method: 'post',
            url: `${globalConfig[process.env.NODE_ENV].baseUsersServiceRoute}/users/achievements`,
            headers: {
                authorization: headers.authorization,
                'x-localecode': headers.locale,
                'x-userid': headers.userId,
            },
            data: {
                achievementClass: 'explorer',
                achievementTier: '1_3',
                progressCount: spaceIdsToActivate.length,
            },
        }));
    }

    return Promise.all(promises).catch((err) => {
        printLogs({
            level: 'error',
            messageOrigin: 'API_SERVER',
            messages: ['Error while updating achievements'],
            tracer: beeline,
            traceArgs: {
                errMessage: err?.message,
            },
        });

        return [];
    });
};

export {
    updateAchievements,
};
