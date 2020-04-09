import { SocketServerActionTypes } from 'rili-public-library/utilities/constants.js';
import * as Immutable from 'seamless-immutable';
import { IUserConnectionsState, UserConnectionActionTypes } from 'types/userConnections';

const initialState: IUserConnectionsState = Immutable.from({
    connections: Immutable.from([]),
});

const userConnections = (state: IUserConnectionsState = initialState, action: any) => {
    // If state is initialized by server-side rendering, it may not be a proper immutable object yet
    if (!state.setIn) {
        state = state ? Immutable.from(state) : initialState; // eslint-disable-line no-param-reassign
    }

    let uniqueConnections = [...state.connections]; // eslint-disable-line no-case-declarations

    switch (action.type) {
        case UserConnectionActionTypes.GET_USER_CONNECTIONS:
            // TODO: RSERV-26 - Rethink/optimize/cleanup this
            const newConnections = (action.data || []).filter((connection) => { // eslint-disable-line no-case-declarations
                const existingIndex = uniqueConnections.findIndex((c) => c.id === connection.id);
                if (existingIndex > -1) {
                    uniqueConnections[existingIndex] = connection;
                    return false;
                }

                return true;
            });
            uniqueConnections = uniqueConnections.concat(newConnections);
            return state.setIn(['connections'], uniqueConnections);
        case SocketServerActionTypes.USER_CONNECTION_CREATED:
            return state.setIn(['connections'], [...uniqueConnections, action.data]);
        case SocketServerActionTypes.USER_CONNECTION_UPDATED:
            return state.setIn(['connections'], [...uniqueConnections, action.data]);
        default:
            return state;
    }
};

export default userConnections;
