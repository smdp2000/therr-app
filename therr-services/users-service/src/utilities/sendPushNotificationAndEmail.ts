import axios from 'axios';
import { PushNotifications } from 'therr-js-utilities/constants';
import printLogs from 'therr-js-utilities/print-logs';
import beeline from '../beeline'; // eslint-disable-line import/order
import sendPendingInviteEmail from '../api/email/retention/sendPendingInviteEmail';
import * as globalConfig from '../../../../global-config';
import { IFindUserArgs } from '../store/UsersStore';

interface ISendPushNotification {
    authorization: any;
    fromUserName?: any;
    fromUserId: any;
    locale: any;
    toUserId: any;
    type: any;
    retentionEmailType?: PushNotifications.Types;
}

export default (findUser: (args: IFindUserArgs, returning: any[]) => Promise<{
    deviceMobileFirebaseToken: string;
    email: string;
    isUnclaimed: boolean;
}[]>, {
    authorization,
    fromUserName,
    fromUserId,
    locale,
    toUserId,
    type,
    retentionEmailType,
}: ISendPushNotification): Promise<any> => findUser({ id: toUserId }, ['deviceMobileFirebaseToken', 'email', 'isUnclaimed']).then(([destinationUser]) => {
    if (!destinationUser || destinationUser.isUnclaimed) {
        // Don't send notification/email
        return Promise.resolve({});
    }
    if (retentionEmailType === PushNotifications.Types.newConnectionRequest) {
        if (fromUserName) {
            sendPendingInviteEmail({
                subject: `[New Connection Request] ${fromUserName} sent you a request on Therr App`,
                toAddresses: [destinationUser.email],
            }, {
                fromName: fromUserName,
            });
        } else {
            printLogs({
                level: 'warn',
                messageOrigin: 'API_SERVER',
                messages: ['"fromUserName" is not defined. Skipping email.'],
                tracer: beeline,
                traceArgs: {
                    issue: 'error with sendPendingInviteEmail',
                },
            });
        }
    }

    return axios({
        method: 'post',
        url: `${globalConfig[process.env.NODE_ENV].basePushNotificationsServiceRoute}/notifications/send`,
        headers: {
            authorization,
            'x-localecode': locale,
            'x-userid': fromUserId,
        },
        data: {
            fromUserName,
            toUserDeviceToken: destinationUser.deviceMobileFirebaseToken,
            type,
        },
    });
}).catch((error) => {
    printLogs({
        level: 'error',
        messageOrigin: 'API_SERVER',
        messages: [error?.message],
        tracer: beeline,
        traceArgs: {
            issue: 'error with sendPushNotificationAndEmail',
        },
    });
});
