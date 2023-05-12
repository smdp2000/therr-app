/* eslint-disable class-methods-use-this */
import axios from 'axios';

class VerificationCodesService {
    requestOneTimePassword = (email) => axios({
        method: 'post',
        url: '/users-service/users/forgot-password',
        data: {
            email,
            isDashboardRegistration: true,
        },
    });

    resendVerification = (email) => axios({
        method: 'post',
        url: '/users-service/users/verify/resend',
        data: {
            email,
            type: 'email',
            isDashboardRegistration: true,
        },
    });

    verifyEmail = (token: string) => axios({
        method: 'post',
        url: `/users-service/users/verify/${token}`,
        data: {
            type: 'email',
        },
    });
}

export default new VerificationCodesService();
