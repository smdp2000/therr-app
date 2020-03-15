import * as socketio from 'socket.io';
import printLogs from 'rili-public-library/utilities/print-logs'; // eslint-disable-line no-implicit-dependencies
import * as moment from 'moment';
import { SocketServerActionTypes, SocketClientActionTypes } from 'rili-public-library/utilities/constants';
import * as Constants from '../../constants';
import { shouldPrintSocketLogs } from '../../server-socket-io';

const sendMessage = (socket: socketio.Socket, data: any) => {
    printLogs({
        shouldPrintLogs: shouldPrintSocketLogs,
        messageOrigin: 'SOCKET_IO_LOGS',
        messages: `${SocketClientActionTypes.SEND_MESSAGE}: ${data.toString()}`,
    });
    const now = moment(Date.now()).format('MMMM D/YY, h:mma');
    socket.emit('action', {
        type: SocketServerActionTypes.SEND_MESSAGE,
        data: {
            roomId: data.roomId,
            message: {
                key: Date.now().toString(),
                time: now,
                text: `You: ${data.message}`,
            },
        },
    });
    socket.broadcast.to(data.roomId).emit(Constants.ACTION, {
        type: SocketServerActionTypes.SEND_MESSAGE,
        data: {
            roomId: data.roomId,
            message: {
                key: Date.now().toString(),
                time: now,
                text: `${data.userName}: ${data.message}`,
            },
        },
    });
    printLogs({
        shouldPrintLogs: shouldPrintSocketLogs,
        messageOrigin: 'SOCKET_IO_LOGS',
        messages: `${data.userName} said: ${data.message}`,
    });
};

export default sendMessage;
