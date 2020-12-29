import beeline from './beeline'; // eslint-disable-line import/order
import express from 'express';
import * as http from 'http';
import moment from 'moment';
import { Server as SocketIOServer, Socket } from 'socket.io';
import {
    LogLevelMap,
    SocketServerActionTypes,
    SocketClientActionTypes,
    SOCKET_MIDDLEWARE_ACTION,
} from 'therr-js-utilities/constants';
import printLogs from 'therr-js-utilities/print-logs';
import * as socketHandlers from './handlers';
import * as globalConfig from '../../../global-config';
import getSocketRoomsList from './utilities/get-socket-rooms-list';
import redisAdapter from './store/redisAdapter';
import redisSessions from './store/redisSessions';
import { redisPub, redisSub } from './store/redisClient';
import authenticate from './utilities/authenticate';
import notifyConnections from './utilities/notify-connections';
import { UserStatus } from './constants';
import { FORUM_PREFIX } from './handlers/rooms';

export const rsAppName = 'therrChat';

let serverObj: http.Server;

const leaveAndNotifyRooms = (socket: Socket) => {
    const activeRooms = [...socket.rooms]
        .filter((room) => room !== socket.id);

    if (activeRooms.length) {
        redisSessions.getUserBySocketId(socket.id).then((user: any) => {
            activeRooms.forEach((room) => {
                if (user && user.userName) {
                    // TODO: RFRONT-25 - localize dates
                    const now = moment(Date.now()).format('MMMM D/YY, h:mma');
                    socket.broadcast.to(room).emit(SOCKET_MIDDLEWARE_ACTION, {
                        type: SocketServerActionTypes.LEFT_ROOM,
                        data: {
                            roomId: room.replace(FORUM_PREFIX, ''),
                            message: {
                                key: Date.now().toString(),
                                time: now,
                                text: `${user.userName} left the room`,
                            },
                        },
                    });
                }
            });
        }).catch((err: any) => {
            printLogs({
                level: 'verbose',
                messageOrigin: 'REDIS_SESSION_ERROR',
                messages: err,
                tracer: beeline,
                traceArgs: {
                    socketId: socket.id,
                    activeRooms,
                },
            });
        });
    }
};

const startExpressSocketIOServer = () => {
    const app = express();
    const { SOCKET_PORT } = process.env;

    const server = http.createServer(app);
    serverObj = server.listen(Number(SOCKET_PORT), () => {
        printLogs({
            level: 'info',
            messageOrigin: 'SOCKET_IO_LOGS',
            messages: `Server running on port, ${SOCKET_PORT}, with process id ${process.pid}`,
            tracer: beeline,
            traceArgs: {
                port: SOCKET_PORT,
                processId: process.pid,
            },
        });
    });
    // NOTE: engine.io config options https://github.com/socketio/engine.io#methods-1
    const io = new SocketIOServer(server, {
        path: globalConfig[process.env.NODE_ENV].socket.clientPath,
        // how many ms before sending a new ping packet
        pingInterval: Number(globalConfig[process.env.NODE_ENV || 'development'].socket.pingInterval),
        // how many ms without a pong packet to consider the connection closed
        pingTimeout: Number(globalConfig[process.env.NODE_ENV || 'development'].socket.pingTimeout),
    });

    io.on('connect_error', (error: string) => {
        console.log(error); // eslint-disable-line no-console
    });

    io.adapter(redisAdapter);

    io.on('connection', async (socket: Socket) => {
        printLogs({
            level: 'info',
            messageOrigin: 'SOCKET_IO_LOGS',
            messages: 'NEW CONNECTION...',
            tracer: beeline,
            traceArgs: {
                socketId: socket.id,
            },
        });

        const allRooms = await (io.of('/').adapter as any).allRooms();
        const roomsList = await getSocketRoomsList(io, allRooms);

        printLogs({
            level: 'info',
            messageOrigin: 'SOCKET_IO_LOGS',
            messages: `All Rooms: ${JSON.stringify(roomsList)}`,
            tracer: beeline,
            traceArgs: {
                socketId: socket.id,
            },
        });

        // Send a list of the currently active chat rooms when user connects
        socket.emit(SOCKET_MIDDLEWARE_ACTION, {
            type: SocketServerActionTypes.SEND_ROOMS_LIST,
            data: roomsList,
        });

        // Event sent from socket.io, redux store middleware
        socket.on(SOCKET_MIDDLEWARE_ACTION, async (action: any) => {
            const isAuthenticated = await authenticate(socket);

            switch (action.type) {
                case SocketClientActionTypes.JOIN_ROOM:
                    if (isAuthenticated) {
                        socketHandlers.joinRoom(socket, action.data);
                        // Notify all users
                        socket.broadcast.emit(SOCKET_MIDDLEWARE_ACTION, {
                            type: SocketServerActionTypes.SEND_ROOMS_LIST,
                            data: roomsList,
                        });
                    }

                    break;
                case SocketClientActionTypes.EXIT_ROOM:
                    if (isAuthenticated) {
                        socketHandlers.leaveRoom(socket, action.data);
                        // Notify all users
                        socket.broadcast.emit(SOCKET_MIDDLEWARE_ACTION, {
                            type: SocketServerActionTypes.SEND_ROOMS_LIST,
                            data: roomsList,
                        });
                    }

                    break;
                case SocketClientActionTypes.LOGIN:
                    socketHandlers.login({
                        appName: rsAppName,
                        socket,
                        data: action.data,
                    });
                    break;
                case SocketClientActionTypes.LOGOUT:
                    if (action.data) {
                        socketHandlers.logout({
                            socket,
                            data: action.data,
                        });
                    }
                    break;
                case SocketClientActionTypes.UPDATE_SESSION:
                    if (isAuthenticated) {
                        socketHandlers.updateSession({
                            appName: rsAppName,
                            socket,
                            data: action.data,
                        });
                    }
                    break;
                case SocketClientActionTypes.SEND_DIRECT_MESSAGE:
                    if (isAuthenticated) {
                        socketHandlers.sendDirectMessage(socket, action.data);
                    }
                    break;
                case SocketClientActionTypes.SEND_MESSAGE:
                    if (isAuthenticated) {
                        socketHandlers.sendForumMessage(socket, action.data);
                    }
                    break;
                case SocketClientActionTypes.UPDATE_NOTIFICATION:
                    if (isAuthenticated) {
                        socketHandlers.updateNotification(socket, action.data);
                    }
                    break;
                case SocketClientActionTypes.LOAD_ACTIVE_CONNECTIONS:
                    if (isAuthenticated) {
                        socketHandlers.loadActiveConnections(socket, action.data);
                    }
                    break;
                case SocketClientActionTypes.CREATE_USER_CONNECTION:
                    if (isAuthenticated) {
                        socketHandlers.createConnection(socket, action.data);
                    }
                    break;
                case SocketClientActionTypes.UPDATE_USER_CONNECTION:
                    if (isAuthenticated) {
                        socketHandlers.updateConnection(socket, action.data);
                    }
                    break;
                default:
                    break;
            }
        });

        socket.on('disconnecting', async (reason: string) => {
            // TODO: Use constants to mitigate disconnect reasons
            printLogs({
                level: 'info',
                messageOrigin: 'SOCKET_IO_LOGS',
                messages: `DISCONNECTING... ${reason}`,
                tracer: beeline,
                traceArgs: {
                    socketId: socket.id,
                },
            });
            leaveAndNotifyRooms(socket);

            // TODO: RSERV-34 - Lower expire ttl of associated redis cache (socket, userId)
            // Consider implications for "remember me?" localStorage
            const user = await redisSessions.getUserBySocketId(socket.id);
            if (user) {
                redisSessions.updateStatus(user, UserStatus.AWAY);
                notifyConnections(socket, { ...user, status: UserStatus.AWAY }, SocketServerActionTypes.ACTIVE_CONNECTION_DISCONNECTED);
            }
        });
    });
};

// We must connect manually since lazyConnect is true
const redisConnectPromises = [redisPub.connect(), redisSub.connect()];

Promise.all(redisConnectPromises).then((responses: any[]) => {
    // connection ready
    if ((Number(process.env.LOG_LEVEL) || 2) <= LogLevelMap.verbose) {
        redisPub.monitor().then((monitor) => {
            monitor.on('monitor', (time, args, source, database) => {
                printLogs({
                    time,
                    level: 'verbose',
                    messageOrigin: 'REDIS_PUB_LOG',
                    messages: [`Source: ${source}, Database: ${database}`, ...args],
                    tracer: beeline,
                    traceArgs: {},
                });
            });
        });
    }

    // Wait for both pub and sub redis instances to connect before starting Express/Socket.io server
    startExpressSocketIOServer();
}).catch((e) => {
    console.error(e);
    printLogs({
        level: 'verbose',
        messageOrigin: 'REDIS_LOG',
        messages: [e.message],
        tracer: beeline,
        traceArgs: {},
    });
});

// Hot Module Reloading
type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => serverObj.close());
}
