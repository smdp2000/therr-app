import * as express from 'express';
import * as socketio from 'socket.io';
import * as socketioRedis from 'socket.io-redis';
import * as config from '../config.js';

let app = express();
let server = app.listen(config.socketPort);
let io = socketio(server);

io.adapter(socketioRedis({
    host: config.redisHost, port: config.redisPort
}));

io.on('connection', (socket: any) => {
    socket.on('room.join', (room: any) => {
    console.log(socket.rooms); // tslint:disable-line
    Object.keys(socket.rooms)
        .filter((r) => r !== socket.id)
        .forEach((r) => socket.leave(r));

        setTimeout(() => {
            socket.join(room);
            socket.emit('event', 'Joined room ' + room);
            socket.broadcast.to(room).emit('event', 'Someone joined room ' + room);
        }, 0);
    });

    socket.on('event', (e: any) => {
        socket.broadcast.to(e.room).emit('event', e.name + ' says hello!');
    });

});
