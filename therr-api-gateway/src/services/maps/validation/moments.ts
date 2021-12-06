import {
    body,
    header,
    param,
} from 'express-validator/check'; // eslint-disable-line import/extensions

export const getMomentDetailsValidation = [
    header('authorization').exists(),
    header('x-userid').exists(),
    param('momentId').exists(),
    body('withMedia').isBoolean().optional(),
    body('withUser').isBoolean().optional(),
];
