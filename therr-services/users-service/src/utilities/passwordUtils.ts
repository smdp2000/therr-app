import * as bcrypt from 'bcrypt';
import translate from './translator';
import handleHttpError from './handleHttpError';
import { hashPassword } from './userHelpers';
import Store from '../store';
import { sendPasswordChangeEmail } from '../api/email';

export interface IValidatePasswordArgs {
    hashedPassword?: string;
    locale: string;
    oneTimePassword?: string;
    inputPassword;
    res;
}

export interface IUpdatePasswordArgs extends IValidatePasswordArgs {
    emailArgs: {
        email: string;
        userName: string;
    };
    newPassword: string;
    userId: string;
}

const validatePassword = async ({
    hashedPassword,
    locale,
    oneTimePassword,
    inputPassword,
    res,
}: IValidatePasswordArgs) => {
    let isOtPasswordValid = false;

    // First check oneTimePassword if exists
    // TODO: Possible buggggg
    if (oneTimePassword) {
        const split = oneTimePassword.split(':');
        const expiresAtStr = split[split.length - 1];
        const otHashedPassword = oneTimePassword.substr(0, oneTimePassword.length - expiresAtStr.length - 1);
        const msExpiresAt = Number(expiresAtStr);
        try {
            isOtPasswordValid = await bcrypt.compare(inputPassword, otHashedPassword);
        } catch (e) {
            isOtPasswordValid = false;
        }
        if (isOtPasswordValid && msExpiresAt <= Date.now()) {
            return handleHttpError({
                res,
                message: translate(locale, 'errorMessages.auth.oneTimeExpired'),
                statusCode: 403,
            });
        }
    }

    return Promise.resolve()
        // Only compare user password if one-time password is null or incorrect
        .then(() => isOtPasswordValid || (!!hashedPassword && bcrypt.compare(inputPassword, hashedPassword)));
};

const updatePassword = ({
    locale,
    hashedPassword,
    oneTimePassword,
    inputPassword,
    newPassword,
    res,
    emailArgs,
    userId,
}: IUpdatePasswordArgs) => validatePassword({
    hashedPassword,
    inputPassword,
    locale,
    oneTimePassword,
    res,
})
    .then((isValid) => {
        if (isValid) {
            return hashPassword(newPassword)
                .then((hash) => Store.users
                    .updateUser({
                        password: hash,
                    }, {
                        id: userId,
                    })
                    .then(() => sendPasswordChangeEmail({
                        subject: '[Password Changed] Therr Account Settings',
                        toAddresses: [emailArgs.email],
                    }, {
                        email: emailArgs.email,
                        userName: emailArgs.userName,
                    })));
        }

        return Promise.reject();
    });

export {
    updatePassword,
    validatePassword,
};
