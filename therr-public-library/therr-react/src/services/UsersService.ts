/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { getSearchQueryString } from 'therr-js-utilities/http';
import {
    IAccess,
    AccessCheckType,
    ISearchQuery,
    IUserState,
} from '../types';

interface ILoginCredentials {
    userName: string;
    password: string;
}

interface ILogoutCredentials {
    userName: string;
}

interface IRegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userName: string;
    password: string;
}

interface IUpdateUser {
    firstName: string;
    lastName: string;
    isBusinessAccount: boolean;
    phoneNumber: string;
    userName: string;
    password?: string;
    newPassword?: string;
    shouldHideMatureContent?: boolean;
}

interface IChangePasswordArgs {
    oldPassword: string;
    newPassword: string;
    email: string;
    userName: string;
}

interface ICreateThoughtBody {
    parentId?: string;
    category?: string;
    expiresAt?: any;
    fromUserId: number;
    locale: string;
    isPublic?: boolean;
    isRepost?: boolean;
    message: string;
    mediaIds?: string;
    mentionsIds?: string;
    hashTags?: string;
    maxViews?: number;
}

interface IGetThoughtDetailsArgs {
    withUser?: boolean;
    withReplies?: boolean;
}

interface IDeleteThoughtsBody {
    ids: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISearchThoughtsArgs {}

export interface ISocialSyncs {
    syncs: {
        twitter?: {
            username: string;
        };
        youtube?: {
            username: string;
        };
    };
}

class UsersService {
    authenticate = (data: ILoginCredentials) => axios({
        method: 'post',
        url: '/users-service/auth',
        data,
    });

    block = (userId: string, alreadyBockedUsers: number[]) => axios({
        method: 'put',
        url: `/users-service/users/${userId}/block`,
        data: {
            blockedUsers: alreadyBockedUsers,
        },
    });

    changePassword = (data: IChangePasswordArgs) => axios({
        method: 'put',
        url: '/users-service/users/change-password',
        data,
    });

    create = (data: IRegisterCredentials) => axios({
        method: 'post',
        url: '/users-service/users',
        data,
    });

    delete = (userId: string, data: IRegisterCredentials) => axios({
        method: 'delete',
        url: `/users-service/users/${userId}`,
        data,
    });

    get = (id: string) => axios({
        method: 'get',
        url: `/users-service/users/${id}`,
    });

    getMe = () => axios({
        method: 'get',
        url: '/users-service/users/me',
    });

    report = (userId: string) => axios({
        method: 'put',
        url: `/users-service/users/${userId}/report`,
        data: {},
    });

    update = (userId: string, data: IUpdateUser) => axios({
        method: 'put',
        url: `/users-service/users/${userId}`,
        data,
    });

    isAuthorized = (access: IAccess, user: IUserState) => {
        const userAccessLevels = user?.details?.accessLevels;
        if (access.isPublic || userAccessLevels) {
            if (!userAccessLevels) {
                return true;
            }
            if (access.type === AccessCheckType.NONE) {
                // User does not have any of the access levels from the check
                return !access.levels.some((lvl) => user.details.accessLevels.includes(lvl));
            }
            if (access.type === AccessCheckType.ANY) {
                // User has at least one of the access levels from the check
                return access.levels.some((lvl) => user.details.accessLevels.includes(lvl));
            }
            if (access.type === AccessCheckType.ALL) {
                // User has all of the access levels from the check
                return !access.levels.some((lvl) => !user.details.accessLevels.includes(lvl));
            }
        }

        return false;
    };

    logout = (data: ILogoutCredentials) => axios({
        method: 'post',
        url: '/users-service/auth/logout',
        data,
    });

    sendFeedback = (feedback: string) => axios({
        method: 'post',
        url: '/users-service/subscribers/send-feedback',
        data: {
            feedback,
        },
    });

    // Social Sync
    createUpdateSocialSyncs = (socialSyncs: ISocialSyncs) => axios({
        method: 'post',
        url: '/users-service/social-sync',
        data: socialSyncs,
    });

    getSocialSyncs = (userId: string) => axios({
        method: 'get',
        url: `/users-service/social-sync/${userId}`,
    });

    // Achievements
    claimMyAchievement = (id: string) => axios({
        method: 'post',
        url: `/users-service/users/achievements/${id}/claim`,
    });

    getMyAchievements = () => axios({
        method: 'get',
        url: '/users-service/users/achievements',
    });

    requestRewardsExchange = (amount: number, provider: string) => axios({
        method: 'post',
        url: '/users-service/rewards',
        data: {
            amount,
            provider,
        },
    });

    getExchangeRate = (amount: number) => axios({
        method: 'get',
        url: '/users-service/rewards/exchange-rate',
    });

    // Thoughts
    createThought = (data: ICreateThoughtBody) => axios({
        method: 'post',
        url: '/users-service/thoughts',
        data,
    });

    getThoughtDetails = (id: number, args: IGetThoughtDetailsArgs) => axios({
        method: 'post',
        url: `/users-service/thoughts/${id}/details`,
        data: args,
    });

    searchThoughts = (query: ISearchQuery, data: ISearchThoughtsArgs = {}) => {
        const queryString = getSearchQueryString(query);

        return axios({
            method: 'post',
            url: `/users-service/thoughts/search${queryString}`,
            data,
        });
    };

    deleteThoughts = (data: IDeleteThoughtsBody) => axios({
        method: 'delete',
        url: '/users-service/thoughts',
        data,
    });
}

export default new UsersService();
