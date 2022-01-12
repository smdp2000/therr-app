import { RequestHandler } from 'express';
import { AccessLevels, ErrorCodes } from 'therr-js-utilities/constants';
import normalizeEmail from 'normalize-email';
import handleHttpError from '../utilities/handleHttpError';
import Store from '../store';
import { hashPassword } from '../utilities/userHelpers';
import generateCode from '../utilities/generateCode';
import { sendVerificationEmail } from '../api/email';
import generateOneTimePassword from '../utilities/generateOneTimePassword';
import translate from '../utilities/translator';
import { updatePassword } from '../utilities/passwordUtils';
import sendOneTimePasswordEmail from '../api/email/sendOneTimePasswordEmail';
import sendSSONewUserEmail from '../api/email/sendSSONewUserEmail';
import sendNewUserInviteEmail from '../api/email/sendNewUserInviteEmail';
import sendNewUserAdminNotificationEmail from '../api/email/admin/sendNewUserAdminNotificationEmail';

interface IRequiredUserDetails {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    userName?: string;
}

interface IUserByInviteDetails {
    fromName: string;
    fromEmail: string;
    toEmail: string;
}

// TODO: Write unit tests for this function
export const isUserProfileIncomplete = (updateArgs, existingUser?) => {
    if (!existingUser) {
        const requestIsMissingProperties = !updateArgs.phoneNumber
            || !updateArgs.userName
            || !updateArgs.firstName
            || !updateArgs.lastName;

        return requestIsMissingProperties;
    }

    // NOTE: The user update query does not nullify missing properties when the respective property already exists in the DB
    const requestDoesNotCompleteProfile = !(updateArgs.phoneNumber || existingUser.phoneNumber)
        || !(updateArgs.userName || existingUser.userName)
        || !(updateArgs.firstName || existingUser.firstName)
        || !(updateArgs.lastName || existingUser.lastName);

    return requestDoesNotCompleteProfile;
};

export const createUserHelper = (userDetails: IRequiredUserDetails, isSSO = false, userByInviteDetails?: IUserByInviteDetails) => {
    // TODO: Supply user agent to determine if web or mobile
    const codeDetails = generateCode({ email: userDetails.email, type: 'email' });
    const verificationCode = { type: codeDetails.type, code: codeDetails.code };
    // Create a different/random permanent password as a placeholder
    const password = (isSSO || !!userByInviteDetails) ? generateOneTimePassword(8) : (userDetails.password || '');
    let user;

    return Store.verificationCodes.createCode(verificationCode)
        .then(() => hashPassword(password))
        .then((hash) => {
            const isMissingUserProps = isUserProfileIncomplete(userDetails);
            const userAccessLevels = [
                AccessLevels.DEFAULT,
            ];
            if (isSSO) {
                if (isMissingUserProps) {
                    userAccessLevels.push(AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES);
                } else {
                    userAccessLevels.push(AccessLevels.EMAIL_VERIFIED);
                }
            }
            return Store.users.createUser({
                accessLevels: JSON.stringify(userAccessLevels),
                email: userDetails.email,
                firstName: userDetails.firstName || undefined,
                lastName: userDetails.lastName || undefined,
                password: hash,
                phoneNumber: userDetails.phoneNumber || undefined,
                userName: userDetails.userName || undefined,
                verificationCodes: JSON.stringify({
                    [codeDetails.type]: {
                        code: codeDetails.code,
                    },
                }),
            });
        })
        // TODO: RSERV-53 - Create userResource with default values (from library constant DefaultUserResources)
        .then((results) => {
            user = results[0];
            delete user.password;

            if (isSSO || !!userByInviteDetails) {
                // TODO: RMOBILE-26: Centralize password requirements
                const msExpiresAt = Date.now() + (1000 * 60 * 60 * 6); // 6 hours
                const otPassword = generateOneTimePassword(8);

                return hashPassword(otPassword)
                    .then((hash) => Store.users.updateUser({
                        oneTimePassword: `${hash}:${msExpiresAt}`,
                    }, {
                        email: userDetails.email,
                    }))
                    // SSO USER AUTO-REGISTRATION ON FIRST LOGIN
                    .then(() => {
                        // Fire and forget
                        sendNewUserAdminNotificationEmail({
                            subject: userByInviteDetails ? '[New User] New User Registration by Invite' : '[New User] New User Registration',
                            toAddresses: [process.env.AWS_FEEDBACK_EMAIL_ADDRESS as any],
                        }, {
                            name: userDetails.firstName && userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : userDetails.email,
                        });

                        if (isSSO) {
                            return sendSSONewUserEmail({
                                subject: '[Account Created] Therr One-Time Password',
                                toAddresses: [userDetails.email],
                            }, {
                                name: userDetails.email,
                                oneTimePassword: otPassword,
                            });
                        }

                        return sendNewUserInviteEmail({
                            subject: `${userByInviteDetails?.fromName} Invited You to Therr app`,
                            toAddresses: [userByInviteDetails?.toEmail || ''],
                        }, {
                            fromName: userByInviteDetails?.fromName || '',
                            fromEmail: userByInviteDetails?.fromEmail || '',
                            toEmail: userByInviteDetails?.toEmail || '',
                            verificationCodeToken: codeDetails.token,
                            oneTimePassword: otPassword,
                        });
                    })
                    .then(() => user);
            }

            // Fire and forget
            sendNewUserAdminNotificationEmail({
                subject: '[New User] New User Registration',
                toAddresses: [process.env.AWS_FEEDBACK_EMAIL_ADDRESS as any],
            }, {
                name: userDetails.firstName && userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : userDetails.email,
            });

            // STANDARD USER REGISTRATION
            return sendVerificationEmail({
                subject: '[Account Verification] Therr User Account',
                toAddresses: [userDetails.email],
            }, {
                name: userDetails.firstName && userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : userDetails.email,
                verificationCodeToken: codeDetails.token,
            }).then(() => user);
        })
        .catch((error) => {
            console.log(error);
            // Delete user to allow re-registration
            if (user && user.id) {
                Store.users.deleteUsers({ id: user.id });
            }
            throw error;
        });
};

// CREATE
const createUser: RequestHandler = (req: any, res: any) => Store.users.findUser(req.body)
    .then((findResults) => {
        if (findResults.length) {
            return handleHttpError({
                res,
                message: 'Username, e-mail, and phone number must be unique. A user already exists.',
                statusCode: 400,
                errorCode: ErrorCodes.USER_EXISTS,
            });
        }

        return createUserHelper(req.body, false).then((user) => res.status(201).send(user));
    })
    .catch((err) => handleHttpError({
        err,
        res,
        message: 'SQL:USER_ROUTES:ERROR',
    }));

// READ
const getUser = (req, res) => Store.users.getUsers({ id: req.params.id })
    .then((results) => {
        const userId = req.headers['x-userid'];

        if (!results.length) {
            return handleHttpError({
                res,
                message: `No user found with id, ${req.params.id}.`,
                statusCode: 404,
            });
        }

        return Store.userConnections.getUserConnections({
            acceptingUserId: req.params.id,
            requestingUserId: userId,
        }, true).then((connections) => {
            const user = results[0];
            delete user.password;
            delete user.oneTimePassword;

            if (connections.length && connections[0].requestStatus === 'complete' && !connections[0].isConnectionBroken) {
                return res.status(200).send(user);
            }

            // Do not return private info if users are not connected
            return res.status(200).send({
                id: user.id,
                userName: user.userName,
                isNotConnected: true,
                isPendingConnection: connections.length ? (connections[0].requestStatus === 'denied' || connections[0].requestStatus === 'pending') : false,
            });
        });
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));

const getUsers: RequestHandler = (req: any, res: any) => Store.users.getUsers()
    .then((results) => {
        res.status(200).send(results.map((user) => {
            delete user.password; // eslint-disable-line no-param-reassign
            delete user.oneTimePassword; // eslint-disable-line no-param-reassign
            return user;
        }));
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));

const findUsers: RequestHandler = (req: any, res: any) => Store.users.findUsers({ ids: req.body.ids })
    .then((results) => {
        res.status(200).send(results.map((user) => {
            delete user.password; // eslint-disable-line no-param-reassign
            delete user.oneTimePassword; // eslint-disable-line no-param-reassign
            return user;
        }));
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));

// UPDATE
const updateUser = (req, res) => {
    const locale = req.headers['x-localecode'] || 'en-us';
    const userId = req.headers['x-userid'];

    return Store.users.findUser({ id: userId, ...req.body })
        .then((userSearchResults) => {
            const {
                email,
                password,
                oldPassword,
                userName,
            } = req.body;

            if (!userSearchResults.length) {
                return handleHttpError({
                    res,
                    message: `No user found with id, ${userId}.`,
                    statusCode: 404,
                });
            }

            // TODO: If password, validate and update password
            let passwordPromise: Promise<any> = Promise.resolve();

            if (password && oldPassword) {
                passwordPromise = updatePassword({
                    hashedPassword: userSearchResults[0].password,
                    inputPassword: oldPassword,
                    locale,
                    oneTimePassword: userSearchResults[0].oneTimePassword,
                    res,
                    emailArgs: {
                        email,
                        userName,
                    },
                    newPassword: password,
                    userId,
                });
            }

            const updateArgs: any = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                hasAgreedToTerms: req.body.hasAgreedToTerms,
                userName: req.body.userName,
                deviceMobileFirebaseToken: req.body.deviceMobileFirebaseToken,
                shouldHideMatureContent: req.body.shouldHideMatureContent,
            };

            const isMissingUserProps = isUserProfileIncomplete(updateArgs, userSearchResults[0]);

            if (isMissingUserProps && userSearchResults[0].accessLevels?.includes(AccessLevels.EMAIL_VERIFIED)) {
                const userAccessLevels = userSearchResults[0].accessLevels.filter((level) => level !== AccessLevels.EMAIL_VERIFIED);
                userAccessLevels.push(AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES);
                updateArgs.accessLevels = JSON.stringify(userAccessLevels);
            }
            if (!isMissingUserProps && userSearchResults[0].accessLevels?.includes(AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES)) {
                const userAccessLevels = userSearchResults[0].accessLevels.filter((level) => level !== AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES);
                userAccessLevels.push(AccessLevels.EMAIL_VERIFIED);
                updateArgs.accessLevels = JSON.stringify(userAccessLevels);
            }

            passwordPromise
                .then(() => Store.users
                    .updateUser(updateArgs, {
                        id: userId,
                    })
                    .then((results) => {
                        const user = results[0];
                        delete user.password;
                        delete user.oneTimePassword;
                        // TODO: Investigate security issue
                        // Lockdown updateUser
                        return res.status(202).send({ ...user, id: userId }); // Precaution, always return correct request userID to prevent polution
                    }))
                .catch((e) => handleHttpError({
                    res,
                    message: translate(locale, 'User/password combination is incorrect'),
                    statusCode: 400,
                }));
        })
        .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));
};

const blockUser = (req, res) => Store.users.findUser({ id: req.params.id })
    .then((findResults) => {
        const userId = req.headers['x-userid'];

        if (!findResults.length) {
            return handleHttpError({
                res,
                message: 'User not found',
                statusCode: 404,
            });
        }

        return Store.users
            .updateUser({
                // remove duplicates using Set()
                blockedUsers: [...new Set([...(req.body.blockedUsers || []), req.params.id])],
            }, {
                id: userId,
            }).then((response) => res.status(200).send({ blockedUsers: response[0].blockedUsers }));
    }).catch((e) => handleHttpError({
        res,
        message: e.message,
        statusCode: 400,
    }));

const reportUser = (req, res) => Store.users.findUser({ id: req.params.id })
    .then((findResults) => {
        const userId = req.headers['x-userid'];

        if (!findResults.length) {
            return handleHttpError({
                res,
                message: 'User not found',
                statusCode: 404,
            });
        }

        return Store.users
            .updateUser({
                // remove duplicates using Set()
                wasReportedBy: [...new Set([...findResults[0].wasReportedBy, userId])],
            }, {
                id: req.params.id,
            }).then(() => res.status(200).send());
    }).catch((e) => handleHttpError({
        res,
        message: e.message,
        statusCode: 400,
    }));

// UPDATE PASSWORD
const updateUserPassword = (req, res) => Store.users.findUser({ id: req.headers['x-userid'] })
    .then((findResults) => {
        const locale = req.headers['x-localecode'] || 'en-us';
        const userId = req.headers['x-userid'];
        const {
            email,
            newPassword,
            userName,
        } = req.body;

        if (!findResults.length) {
            return handleHttpError({
                res,
                message: 'User not found',
                statusCode: 404,
            });
        }

        return updatePassword({
            hashedPassword: findResults[0].password,
            inputPassword: req.body.oldPassword,
            locale,
            oneTimePassword: findResults[0].oneTimePassword,
            res,
            emailArgs: {
                email,
                userName,
            },
            newPassword,
            userId,
        })
            .then(() => res.status(204).send())
            .catch(() => handleHttpError({
                res,
                message: translate(locale, 'User/password combination is incorrect'),
                statusCode: 400,
            }));
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));

// DELETE
const deleteUser = (req, res) => Store.users.deleteUsers({ id: req.params.id })
    .then((results) => {
        if (!results.length) {
            return handleHttpError({
                res,
                message: `No user found with id, ${req.params.id}.`,
                statusCode: 404,
            });
        }

        return res.status(200).send({
            message: `User with id, ${req.params.id}, was successfully deleted`,
        });
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));

const createOneTimePassword = (req, res) => {
    const { email } = req.body;

    return Store.users.getUsers({ email: normalizeEmail(email) })
        .then((userDetails) => {
            if (!userDetails.length) {
                return handleHttpError({
                    res,
                    message: 'User not found',
                    statusCode: 404,
                });
            }

            const msExpiresAt = Date.now() + (1000 * 60 * 60 * 48); // 48 hours
            const otPassword = generateOneTimePassword(8);

            return hashPassword(otPassword)
                .then((hash) => Store.users.updateUser({
                    oneTimePassword: `${hash}:${msExpiresAt}`,
                }, {
                    email,
                }))
                .then(() => sendOneTimePasswordEmail({
                    subject: '[Forgot Password?] Therr One-Time Password',
                    toAddresses: [email],
                }, {
                    name: email,
                    oneTimePassword: otPassword,
                }))
                .then(() => res.status(200).send({ message: 'One time password created and sent' }))
                .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));
        });
};

const verifyUserAccount = (req, res) => {
    const {
        token,
    } = req.params;

    let decodedToken;

    try {
        decodedToken = token && Buffer.from(token, 'base64').toString('ascii');
        decodedToken = JSON.parse(decodedToken);
    } catch (e: any) {
        return handleHttpError({ err: e, res, message: 'SQL:USER_ROUTES:ERROR' });
    }

    return Store.users.getUsers({ email: normalizeEmail(decodedToken.email) })
        .then((userSearchResults) => {
            if (!userSearchResults.length) {
                return handleHttpError({
                    res,
                    message: `No user found with email ${decodedToken.email}.`,
                    statusCode: 404,
                });
            }
            const userVerificationCodes = userSearchResults[0].verificationCodes;
            return Store.verificationCodes.getCode({
                code: decodedToken.code,
                type: req.body.type,
            })
                .then(async (codeResults) => {
                    if (!codeResults.length) {
                        return handleHttpError({
                            res,
                            message: 'No verification code found',
                            statusCode: 404,
                        });
                    }

                    const isExpired = codeResults[0].msExpiresAt <= Date.now();

                    if (isExpired) {
                        return handleHttpError({
                            res,
                            message: 'Token has expired',
                            statusCode: 400,
                        });
                    }

                    const userHasMatchingCode = userVerificationCodes[codeResults[0].type]
                        && userVerificationCodes[codeResults[0].type].code
                        && userVerificationCodes[codeResults[0].type].code === codeResults[0].code;

                    if (userHasMatchingCode) {
                        userVerificationCodes[codeResults[0].type] = {}; // clear out used code

                        const isMissingUserProps = isUserProfileIncomplete(userSearchResults[0]);
                        const userAccessLevels = [
                            ...userSearchResults[0].accessLevels,
                        ];
                        if (isMissingUserProps) {
                            userAccessLevels.push(AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES);
                        } else {
                            userAccessLevels.push(AccessLevels.EMAIL_VERIFIED);
                        }

                        await Store.users.updateUser({
                            accessLevels: JSON.stringify(userAccessLevels),
                            verificationCodes: JSON.stringify(userVerificationCodes),
                        }, {
                            email: decodedToken.email,
                        });

                        // Set expire rather than delete (gives a window for user to see if already verified)
                        await Store.verificationCodes.updateCode({ msExpiresAt: Date.now() }, { id: codeResults[0].id });

                        return res.status(200).send({
                            message: 'Account successfully verified',
                        });
                    }

                    return handleHttpError({
                        res,
                        message: 'Invalid token',
                        statusCode: 400,
                    });
                })
                .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_ROUTES:ERROR' }));
        });
};

const resendVerification: RequestHandler = (req: any, res: any) => {
    // TODO: Supply user agent to determine if web or mobile
    const codeDetails = generateCode({ email: req.body.email, type: req.body.type });
    const verificationCode = { type: codeDetails.type, code: codeDetails.code };
    let userVerificationCodes;

    Store.users.getUsers({
        email: normalizeEmail(req.body.email),
    })
        .then((users) => {
            if (!users.length) {
                return handleHttpError({
                    res,
                    message: 'User not found',
                    statusCode: 404,
                });
            }

            if (users[0].accessLevels.includes(AccessLevels.EMAIL_VERIFIED)) {
                return handleHttpError({
                    res,
                    message: 'Email already verified',
                    statusCode: 400,
                });
            }

            userVerificationCodes = users[0].verificationCodes;
            userVerificationCodes[codeDetails.type] = {
                code: codeDetails.code,
            };

            return Store.verificationCodes.createCode(verificationCode)
                .then(() => Store.users.updateUser({
                    verificationCodes: JSON.stringify(userVerificationCodes),
                }, {
                    email: req.body.email,
                }))
                .then((results) => {
                    const user = results[0];
                    delete user.password;
                    delete user.oneTimePassword;

                    return sendVerificationEmail({
                        subject: '[Account Verification] Therr User Account',
                        toAddresses: [req.body.email],
                    }, {
                        name: users[0].firstName && users[0].lastName ? `${users[0].firstName} ${users[0].lastName}` : users[0].email,
                        verificationCodeToken: codeDetails.token,
                    })
                        .then(() => res.status(200).send({ message: 'New verification E-mail sent' }))
                        .catch((error) => {
                            // Delete user to allow re-registration
                            Store.users.deleteUsers({ id: user.id });
                            throw error;
                        });
                })
                .catch((err) => handleHttpError({
                    err,
                    res,
                    message: 'SQL:USER_ROUTES:ERROR',
                }));
        });
};

export {
    createUser,
    getUser,
    getUsers,
    findUsers,
    updateUser,
    blockUser,
    reportUser,
    updateUserPassword,
    deleteUser,
    createOneTimePassword,
    verifyUserAccount,
    resendVerification,
};
