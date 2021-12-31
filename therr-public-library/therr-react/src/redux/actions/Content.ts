import { SocketClientActionTypes } from 'therr-js-utilities/constants';
import { ContentActionTypes } from '../../types/redux/content';
import ReactionsService, { ISearchActiveAreasParams, ICreateOrUpdateAreaReactionBody } from '../../services/ReactionsService';

interface IActiveMomentsFilters {
    order: 'ASC' | 'DESC';
}

const Content = {
    // Moments
    insertActiveMoments: (newActiveMoments: any) => (dispatch: any) => {
        dispatch({
            type: ContentActionTypes.INSERT_ACTIVE_MOMENTS,
            data: newActiveMoments,
        });
    },
    searchActiveMoments: (options: ISearchActiveAreasParams, limit = 21) => (dispatch: any) => ReactionsService
        .searchActiveMoments(options, limit)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.SEARCH_ACTIVE_MOMENTS,
                data: response?.data,
            });
        }),
    setActiveMomentsFilters: (filters: IActiveMomentsFilters) => (dispatch: any) => dispatch({
        type: ContentActionTypes.SET_ACTIVE_AREAS_FILTERS,
        data: filters,
    }),
    updateActiveMoments: (options: ISearchActiveAreasParams, limit = 21) => (dispatch: any) => ReactionsService
        .searchActiveMoments(options, limit)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.UPDATE_ACTIVE_MOMENTS,
                data: response?.data,
            });
        }),
    createOrUpdateMomentReaction: (
        momentId: number,
        params: ICreateOrUpdateAreaReactionBody,
        momentUserId: string,
        reactorUserName: string,
    ) => (dispatch: any) => ReactionsService
        .createOrUpdateMomentReaction(momentId, params)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.UPDATE_ACTIVE_MOMENT_REACTION,
                data: response?.data,
            });
            dispatch({
                type: SocketClientActionTypes.CREATE_OR_UPDATE_REACTION,
                data: {
                    areaUserId: momentUserId,
                    momentReaction: response?.data,
                    reactorUserName,
                },
            });
            if (params?.userHasReported) {
                dispatch({
                    type: ContentActionTypes.REMOVE_ACTIVE_MOMENTS,
                    data: {
                        momentId,
                    },
                });
            }
        }),
    searchBookmarkedMoments: (options: ISearchActiveAreasParams) => (dispatch: any) => ReactionsService
        .searchBookmarkedMoments(options, 100)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.SEARCH_BOOKMARKED_MOMENTS,
                data: response?.data,
            });
        }),

    // Spaces
    insertActiveSpaces: (newActiveSpaces: any) => (dispatch: any) => {
        dispatch({
            type: ContentActionTypes.INSERT_ACTIVE_SPACES,
            data: newActiveSpaces,
        });
    },
    searchActiveSpaces: (options: ISearchActiveAreasParams, limit = 21) => (dispatch: any) => ReactionsService
        .searchActiveSpaces(options, limit)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.SEARCH_ACTIVE_SPACES,
                data: response?.data,
            });
        }),
    updateActiveSpaces: (options: ISearchActiveAreasParams, limit = 21) => (dispatch: any) => ReactionsService
        .searchActiveSpaces(options, limit)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.UPDATE_ACTIVE_SPACES,
                data: response?.data,
            });
        }),
    createOrUpdateSpaceReaction: (
        spaceId: number,
        params: ICreateOrUpdateAreaReactionBody,
        spaceUserId: string,
        reactorUserName: string,
    ) => (dispatch: any) => ReactionsService
        .createOrUpdateSpaceReaction(spaceId, params)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.UPDATE_ACTIVE_SPACE_REACTION,
                data: response?.data,
            });
            dispatch({
                type: SocketClientActionTypes.CREATE_OR_UPDATE_REACTION,
                data: {
                    areaUserId: spaceUserId,
                    reactorUserName,
                    spaceReaction: response?.data,
                },
            });
            if (params?.userHasReported) {
                dispatch({
                    type: ContentActionTypes.REMOVE_ACTIVE_SPACES,
                    data: {
                        spaceId,
                    },
                });
            }
        }),
    searchBookmarkedSpaces: (options: ISearchActiveAreasParams) => (dispatch: any) => ReactionsService
        .searchBookmarkedSpaces(options, 100)
        .then((response: any) => {
            dispatch({
                type: ContentActionTypes.SEARCH_BOOKMARKED_SPACES,
                data: response?.data,
            });
        }),
};

export default Content;
