import axios from 'axios';
import uuid from 'react-native-uuid';
import { getSearchQueryString } from 'therr-js-utilities/http';
import { IAreaType } from 'therr-js-utilities/types';
import { ISearchQuery } from '../types';

let googleDynamicSessionToken = uuid.v4(); // This gets stored in the local state of this file/module

export interface ISearchAreasArgs {
    distanceOverride?: number;
}

interface IGetAreaDetailsArgs {
    withMedia?: boolean;
    withUser?: boolean;
}
interface ICreateAreaBody {
    category?: string;
    expiresAt?: any;
    fromUserId: number;
    locale: string;
    isPublic?: boolean;
    message: string;
    notificationMsg?: string;
    mediaIds?: string;
    mentionsIds?: string;
    hashTags?: string;
    maxViews?: number;
    latitude: string;
    longitude: string;
    radius?: string;
    polygonCoords?: string;
}

interface IDeleteAreasBody {
    ids: string[];
}

export interface IPlacesAutoCompleteArgs {
    longitude: string;
    latitude: string;
    radius?: number | string;
    apiKey: string;
    input: string;
    sessiontoken?: string;
}

export interface IPlaceDetailsArgs {
    apiKey: string;
    placeId: string;
    sessiontoken?: string;
}

export interface ISignedUrlArgs {
    action: string;
    filename: string;
    areaType?: IAreaType;
}

class MapsService {
    createArea = (areaType: IAreaType, data: ICreateAreaBody) => axios({
        method: 'post',
        url: `/maps-service/${areaType}`,
        data,
    })

    updateArea = (areaType: IAreaType, id: string, data: ICreateAreaBody) => axios({
        method: 'put',
        url: `/maps-service/${areaType}/${id}`,
        data,
    })

    getAreaDetails = (areaType: IAreaType, id: number, args: IGetAreaDetailsArgs) => axios({
        method: 'post',
        url: `/maps-service/${areaType}/${id}/details`,
        data: args,
    })

    searchAreas = (areaType: IAreaType, query: ISearchQuery, data: ISearchAreasArgs = {}) => {
        const queryString = getSearchQueryString(query);

        return axios({
            method: 'post',
            url: `/maps-service/${areaType}/search${queryString}`,
            data,
        });
    }

    searchMyAreas = (areaType: IAreaType, query: ISearchQuery, data: ISearchAreasArgs = {}) => {
        const queryString = getSearchQueryString(query);

        return axios({
            method: 'post',
            url: `/maps-service/${areaType}/search/me${queryString}`,
            data,
        });
    }

    deleteAreas = (areaType: IAreaType, data: IDeleteAreasBody) => axios({
        method: 'delete',
        url: `/maps-service/${areaType}`,
        data,
    })

    // Moments
    createMoment = (data: ICreateAreaBody) => this.createArea('moments', data)

    createIntegratedMoment = (platform: string, accessToken: string, mediaId: string) => axios({
        method: 'post',
        url: '/maps-service/moments/integrated',
        data: {
            accessToken,
            mediaId,
            platform,
        },
    })

    updateMoment = (id: string, data: ICreateAreaBody) => this.updateArea('moments', id, data)

    getMomentDetails = (id: number, args: IGetAreaDetailsArgs) => this.getAreaDetails('moments', id, args)

    getIntegratedMoments = (userId: string) => axios({
        method: 'get',
        url: `/maps-service/moments/integrated/${userId}`,
    });

    searchMoments = (query: ISearchQuery, data: ISearchAreasArgs = {}) => this.searchAreas('moments', query, data)

    searchMyMoments = (query: ISearchQuery, data: ISearchAreasArgs = {}) => this.searchMyAreas('moments', query, data)

    deleteMoments = (data: IDeleteAreasBody) => this.deleteAreas('moments', data)

    // Spaces
    createSpace = (data: ICreateAreaBody) => this.createArea('spaces', data)

    getSpaceDetails = (id: number, args: IGetAreaDetailsArgs) => this.getAreaDetails('spaces', id, args)

    searchSpaces = (query: ISearchQuery, data: ISearchAreasArgs = {}) => this.searchAreas('spaces', query, data)

    deleteSpaces = (data: IDeleteAreasBody) => this.deleteAreas('spaces', data)

    // Media
    getSignedUrlPublicBucket = (args: ISignedUrlArgs) => {
        const areaType: IAreaType = args.areaType || 'moments';
        const queryString = `?action=${args.action}&filename=${args.filename}`;

        return axios({
            method: 'get',
            url: `/maps-service/${areaType}/signed-url/public${queryString}`,
        });
    }

    getSignedUrlPrivateBucket = (args: ISignedUrlArgs) => {
        const areaType: IAreaType = args.areaType || 'moments';
        const queryString = `?action=${args.action}&filename=${args.filename}`;

        return axios({
            method: 'get',
            url: `/maps-service/${areaType}/signed-url/private${queryString}`,
        });
    }

    // Google Maps
    // TODO: Use sessiontoken to prevent being over-billed
    getPlacesSearchAutoComplete = ({
        longitude,
        latitude,
        radius,
        apiKey,
        input,
        sessiontoken,
    }: IPlacesAutoCompleteArgs) => {
        let url = '/maps-service/place/autocomplete/json?';

        url = `${url}input=${input}&location=${latitude},${longitude}`;

        if (radius) {
            url = `${url}&radius=${radius}`;
        }

        url = `${url}&sessiontoken=${sessiontoken || googleDynamicSessionToken}`;

        return axios({
            method: 'get',
            url,
            headers: {},
        });
    }

    getPlaceDetails = ({
        apiKey,
        placeId,
        sessiontoken,
    }: IPlaceDetailsArgs) => {
        let url = '/maps-service/place/details/json?fields=geometry&';

        url = `${url}place_id=${placeId}&sessiontoken=${sessiontoken || googleDynamicSessionToken}`;

        return axios({
            method: 'get',
            url,
            headers: {},
        }).finally(() => {
            googleDynamicSessionToken = uuid.v4(); // This must be updated after each call to get place details
        });
    }

    getPlaceNearbySearch = ({
        apiKey,
        placeId,
        sessiontoken,
    }: IPlaceDetailsArgs) => {
        let url = '/maps-service/place/nearbysearch/json?fields=geometry&';

        url = `${url}place_id=${placeId}&sessiontoken=${sessiontoken || googleDynamicSessionToken}`;

        return axios({
            method: 'get',
            url,
            headers: {},
        }).finally(() => {
            googleDynamicSessionToken = uuid.v4(); // This must be updated after each call to get place details
        });
    }
}

export default new MapsService();
