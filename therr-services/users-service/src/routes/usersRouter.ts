import * as express from 'express';
import {
    createUser,
    getMe,
    getUser,
    getUserByPhoneNumber,
    getUserByUserName,
    getUsers,
    findUsers,
    updateUser,
    updatePhoneVerification,
    updateUserCoins,
    blockUser,
    reportUser,
    updateUserPassword,
    deleteUser,
    createOneTimePassword,
    verifyUserAccount,
    resendVerification,
    requestSpace,
} from '../handlers/users';

const router = express.Router();

// CREATE
router.post('/', createUser);

// READ
router.get('/me', getMe);
router.get('/:id', getUser);
router.get('/', getUsers);
router.get('/by-phone/:phoneNumber', getUserByPhoneNumber);
router.get('/by-username/:userName', getUserByUserName);
router.post('/find', findUsers);

// UPDATE
router.put('/change-password', updateUserPassword);
router.put('/:id', updateUser);
router.put('/:id/verify-phone', updatePhoneVerification); // apply phone verified access level
router.put('/:id/block', blockUser);
router.put('/:id/report', reportUser);
router.put('/:id/coins', updateUserCoins);

// DELETE
router.delete('/:id', deleteUser);

// OTHER
router.post('/forgot-password', createOneTimePassword);
router.post('/verify/resend', resendVerification);
router.post('/verify/:token', verifyUserAccount);
router.post('/request-space', requestSpace);

export default router;
