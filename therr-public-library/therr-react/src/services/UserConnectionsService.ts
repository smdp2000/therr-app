import axios from 'axios';
import { getSearchQueryString } from 'therr-js-utilities/http';
import { ISearchQuery } from '../types';

interface ICreateConnectionBody {
    requestingUserId: number;
    requestingUserEmail?: string;
    requestingUserFirstName?: string;
    requestingUserLastName?: string;
    acceptingUserEmail?: string;
    acceptingUserPhoneNumber?: string;
}

interface IInviteConnectionsBody {
    requestingUserId: number;
    requestingUserEmail?: string;
    requestingUserFirstName?: string;
    requestingUserLastName?: string;
    inviteList: {
        email?: string;
        phoneNumber?: string;
    }[]
}

class UserConnectionsService {
    create = (data: ICreateConnectionBody) => axios({
        method: 'post',
        url: '/users-service/users/connections',
        data,
    })

    invite = (data: IInviteConnectionsBody) => axios({
        method: 'post',
        url: '/users-service/users/connections/multi-invite',
        data,
    })

    update = (otherUserId: number, data: ICreateConnectionBody) => axios({
        method: 'put',
        url: '/users-service/users/connections',
        data: {
            ...data,
            otherUserId,
        },
    })

    search = (query: ISearchQuery) => {
        let queryString = getSearchQueryString(query);
        if (query.shouldCheckReverse) {
            queryString = `${queryString}&shouldCheckReverse=true`;
        }
        return axios({
            method: 'get',
            url: `/users-service/users/connections${queryString}`,
        });
    }
}

export default new UserConnectionsService();
