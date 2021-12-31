enum SocketClientActionTypes {
    // AUTHENTICATION
    LOGIN = 'CLIENT:LOGIN',
    LOGOUT = 'CLIENT:LOGOUT',
    REGISTER = 'CLIENT:REGISTER',

    // Sessions
    UPDATE_SESSION = 'CLIENT:UPDATE_SESSION', // socket reconnect

    // ROOMS
    EXIT_ROOM = 'CLIENT:EXIT_ROOM',
    JOIN_ROOM = 'CLIENT:JOIN_ROOM',

    // MAPS

    // MESSAGES
    SEND_DIRECT_MESSAGE = 'CLIENT:SEND_DIRECT_MESSAGE',
    SEND_MESSAGE = 'CLIENT:SEND_MESSAGE',

    // NOTIFICATIONS
    UPDATE_NOTIFICATION = 'CLIENT:UPDATE_NOTIFICATION',

    // REACTIONS
    CREATE_OR_UPDATE_REACTION = 'CLIENT:CREATE_OR_UPDATE_REACTION',

    // USER CONNECTIONS
    LOAD_ACTIVE_CONNECTIONS = 'CLIENT:LOAD_ACTIVE_CONNECTIONS',
    CREATE_USER_CONNECTION = 'CLIENT:CREATE_USER_CONNECTION',
    UPDATE_USER_CONNECTION = 'CLIENT:UPDATE_USER_CONNECTION',

    // USER
    UPDATE_USER = 'CLIENT:UPDATE_USER',
}

export default SocketClientActionTypes;
