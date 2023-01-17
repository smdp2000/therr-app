import beeline from '../../beeline'; // eslint-disable-line import/order
// eslint-disable-next-line import/extensions
import emailValidator from 'therr-js-utilities/email-validator';
import printLogs from 'therr-js-utilities/print-logs'; // eslint-disable-line import/order
import { awsSES } from '../aws';
import Store from '../../store';

export interface ISendEmailConfig {
    charset?: string;
    html: string;
    subject: string;
    toAddresses: string[];
}

const failsafeBlackListRequest = (email) => Store.blacklistedEmails.get({
    email,
}).catch((err) => {
    console.log(err);
    return [];
});

export default (config: ISendEmailConfig) => new Promise((resolve, reject) => {
    const params = {
        Content: {
            Simple: {
                Body: {
                    Html: {
                        Data: config.html,
                        Charset: config.charset || 'UTF-8',
                    },
                },
                Subject: {
                    Data: config.subject,
                    Charset: config.charset || 'UTF-8',
                },
            },
        },
        Destination: {
            // BccAddresses: [
            //     'STRING_VALUE',
            // ],
            // CcAddresses: [
            //     'STRING_VALUE',
            // ],
            ToAddresses: config.toAddresses,
        },
        FromEmailAddress: process.env.AWS_SES_FROM_EMAIL,
    };

    if (!config.toAddresses?.length) {
        resolve({});
        return;
    }

    // TODO: Validate email before sending
    failsafeBlackListRequest(config.toAddresses[0]).then((blacklistedEmails) => {
        // Skip if email is on bounce list or complaint list
        const emailIsBlacklisted = blacklistedEmails?.length;
        if (emailValidator.validate(config.toAddresses[0]) && !emailIsBlacklisted) {
            return awsSES.sendEmail(params, (err, data) => {
                if (err) {
                    printLogs({
                        level: 'error',
                        messageOrigin: 'API_SERVER',
                        messages: ['Error sending email', err?.message],
                        tracer: beeline,
                        traceArgs: {
                            ...data,
                        },
                    });
                    // NOTE: Always resolve, even if there is an error to prevent the API from failing
                    resolve(data);
                    return;
                }
                resolve(data);
            });
        }

        console.warn(`Email is blacklisted or invalid: ${config.toAddresses[0]}`);

        return resolve({});
    });
});
