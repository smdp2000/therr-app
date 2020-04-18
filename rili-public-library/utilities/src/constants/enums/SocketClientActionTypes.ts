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

    // MESSAGES
    SEND_MESSAGE = 'CLIENT:SEND_MESSAGE',

    // NOTIFICATIONS
    UPDATE_NOTIFICATION = 'CLIENT:UPDATE_NOTIFICATION',

    // USER CONNECTIONS
    CREATE_USER_CONNECTION = 'CLIENT:CREATE_USER_CONNECTION',
    UPDATE_USER_CONNECTION = 'CLIENT:UPDATE_USER_CONNECTION',
}

export default SocketClientActionTypes;
