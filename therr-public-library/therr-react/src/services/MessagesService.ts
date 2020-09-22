import axios from 'axios';
import { getSearchQueryString } from 'therr-js-utilities/http';
import { ISearchQuery } from '../types';

class MessagesService {
    search = (query: ISearchQuery) => {
        let queryString = getSearchQueryString(query);

        if (query.shouldCheckReverse) {
            queryString = `${queryString}&shouldCheckReverse=true`;
        }

        return axios({
            method: 'get',
            url: `/messages-service/direct-messages${queryString}`,
        });
    }
}

export default new MessagesService();