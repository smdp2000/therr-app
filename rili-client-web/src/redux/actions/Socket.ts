import { SocketClientActionTypes } from 'rili-public-library/utilities/constants.js';

const Socket = {
    refreshConnection: (data) => (dispatch) => {
        dispatch({
            type: SocketClientActionTypes.UPDATE_SESSION,
            data,
        });
    },
    joinForum: (data) => (dispatch) => {
        dispatch({
            type: SocketClientActionTypes.JOIN_ROOM,
            data,
        });
    },
    leaveForum: (data) => (dispatch) => {
        dispatch({
            type: SocketClientActionTypes.EXIT_ROOM,
            data,
        });
    },
    sendMessage: (data) => (dispatch) => {
        dispatch({
            type: SocketClientActionTypes.SEND_MESSAGE,
            data,
        });
    },
    sendDirectMessage: (data) => (dispatch) => {
        dispatch({
            type: SocketClientActionTypes.SEND_DIRECT_MESSAGE,
            data,
        });
    },
};

export default Socket;
