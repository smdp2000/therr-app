const apiPort = 7770;
const hostDev = 'localhost';
const hostStage = 'stage.rili.live';
const hostProd = 'rili.live';

module.exports = {
    development: {
        apiPort,
        baseApiRoute: `http://${hostDev}:${apiPort}/v1`,
        baseSocketUrl: `http://${hostDev}:7743`,
        googleAnalyticsKey: '',
        host: hostDev,
        socket: {
            clientPath: '/socketio',
            pingInterval: 1000 * 10,
            pingTimeout: 1000 * 5,
            userSocketSessionExpire: 1000 * 60 * 60,
        },
    },
    stage: {
        apiPort,
        baseApiRoute: `https://${hostStage}/api/v1`,
        baseSocketUrl: `https://${hostStage}`,
        googleAnalyticsKey: '',
        host: hostStage,
        socket: {
            clientPath: '/ws/socketio',
            pingInterval: 1000 * 10,
            pingTimeout: 1000 * 5,
            userSocketSessionExpire: 1000 * 60 * 60,
        },
    },
    production: {
        apiPort,
        baseApiRoute: `https://${hostProd}/api/v1`,
        baseSocketUrl: `https://${hostProd}`,
        googleAnalyticsKey: '',
        host: hostProd,
        socket: {
            clientPath: '/ws/socketio',
            pingInterval: 1000 * 10,
            pingTimeout: 1000 * 5,
            userSocketSessionExpire: 1000 * 60 * 60,
        },
    },
};
