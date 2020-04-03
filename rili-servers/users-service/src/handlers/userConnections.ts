import { RequestHandler } from 'express';
import { getSearchQueryArgs } from 'rili-public-library/utilities/http.js';
import beeline from '../beeline';
import NotificationsStore, { NotificationTypes, NotificationMessages } from '../store/NotificationsStore';
import handleHttpError from '../utilities/handleHttpError';
import UserConnectionsStore from '../store/UserConnectionsStore';
import UsersStore from '../store/UsersStore';
import translate from '../utilities/translator';

// CREATE
// TODO:RSERV-24: Security, get requestingUserId from user header token
const createUserConnection: RequestHandler = async (req: any, res: any) => {
    const {
        requestingUserId,
        requestingUserFirstName,
        requestingUserLastName,
        acceptingUserId,
        acceptingUserPhoneNumber,
        acceptingUserEmail,
    } = req.body;
    const locale = req.headers['x-localecode'] || 'en-us';
    let acceptingId = acceptingUserId;

    if (!acceptingUserId) {
        try {
            const userResults = await UsersStore.findUser({
                phoneNumber: acceptingUserPhoneNumber,
                email: acceptingUserEmail,
            });

            if (!userResults.length) {
                return handleHttpError({
                    res,
                    message: translate(locale, 'errorMessages.userConnections.noUserFound'),
                    statusCode: 404,
                });
            }
            acceptingId = userResults[0].id;

            if (acceptingId === requestingUserId) {
                return handleHttpError({
                    res,
                    message: translate(locale, 'errorMessages.userConnections.noRequestSelf'),
                    statusCode: 400,
                });
            }
        } catch (err) {
            return handleHttpError({
                err,
                res,
                message: 'SQL:USER_CONNECTIONS_ROUTES:ERROR',
            });
        }
    }

    // TODO: Make this one DB request
    return UserConnectionsStore.getUserConnections({
        requestingUserId,
        acceptingUserId: acceptingId,
    })
        .then((getResults) => {
            if (getResults.length) {
                return handleHttpError({
                    res,
                    message: translate(locale, 'errorMessages.userConnections.alreadyExists'),
                    statusCode: 400,
                });
            }

            return UserConnectionsStore.createUserConnection({
                requestingUserId,
                acceptingUserId: acceptingId,
                requestStatus: 'pending',
            }).then((results) => {
                NotificationsStore.createNotification({
                    userId: acceptingId,
                    type: NotificationTypes.CONNECTION_REQUEST_RECEIVED,
                    associationId: results[0].id,
                    isUnread: true,
                    message: NotificationMessages.CONNECTION_REQUEST_RECEIVED,
                    messageParams: { firstName: requestingUserFirstName, lastName: requestingUserLastName },
                }).catch((err) => {
                    beeline.addContext({
                        errorMessage: err.stack,
                    });
                });

                return results;
            }).then((results) => res.status(201).send({ id: results[0].id }));
        })
        .catch((err) => handleHttpError({
            err,
            res,
            message: 'SQL:USER_CONNECTIONS_ROUTES:ERROR',
        }));
};

// READ
const getUserConnection = (req, res) => UserConnectionsStore.getUserConnections({
    requestingUserId: req.params.requestingUserId,
    acceptingUserId: Number(req.query.acceptingUserId),
})
    .then((results) => {
        if (!results.length) {
            return handleHttpError({
                res,
                message: `No user connection found with id, ${req.params.id}.`,
                statusCode: 404,
            });
        }
        return res.status(200).send(results[0]);
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_CONNECTIONS_ROUTES:ERROR' }));

const searchUserConnections: RequestHandler = (req: any, res: any) => {
    const {
        filterBy,
        query,
        itemsPerPage,
        pageNumber,
    } = req.query;
    const integerColumns = ['requestingUserId', 'acceptingUserId', 'interactionCount'];
    const searchArgs = getSearchQueryArgs(req.query, integerColumns);
    const searchPromise = UserConnectionsStore.searchUserConnections(searchArgs[0], searchArgs[1]);
    const countPromise = UserConnectionsStore.countRecords({
        filterBy,
        query,
    });

    return Promise.all([searchPromise, countPromise]).then(([results, countResult]) => {
        const response = {
            results,
            pagination: {
                totalItems: Number(countResult[0].count),
                itemsPerPage: Number(itemsPerPage),
                pageNumber: Number(pageNumber),
            },
        };

        res.status(200).send(response);
    })
        .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_CONNECTIONS_ROUTES:ERROR' }));
};

// UPDATE
// TODO: Assess security implications to prevent anyone from hacking this endpoint
const updateUserConnection = (req, res) => UserConnectionsStore.getUserConnections({
    requestingUserId: Number(req.params.requestingUserId),
    acceptingUserId: req.body.acceptingUserId,
})
    .then((getResults) => {
        const {
            interactionCount,
            isConnectionBroken,
            requestStatus,
        } = req.body;

        if (!getResults.length) {
            return handleHttpError({
                res,
                message: `No user connection found with requesting user id, ${req.params.requestingUserId}.`,
                statusCode: 404,
            });
        }

        return UserConnectionsStore
            .updateUserConnection({
                requestingUserId: req.params.requestingUserId,
                acceptingUserId: req.body.acceptingUserId,
            }, {
                interactionCount,
                isConnectionBroken,
                requestStatus,
            })
            .then((results) => res.status(202).send(results[0]));
    })
    .catch((err) => handleHttpError({ err, res, message: 'SQL:USER_CONNECTIONS_ROUTES:ERROR' }));

export {
    createUserConnection,
    getUserConnection,
    searchUserConnections,
    updateUserConnection,
};