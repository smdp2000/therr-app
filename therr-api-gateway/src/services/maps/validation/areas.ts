import {
    body,
    oneOf,
    query,
    param,
} from 'express-validator/check'; // eslint-disable-line import/extensions

export const createAreaValidation = [
    body('areaType').optional(),
    body('category').optional(),
    body('expiresAt').optional(),
    body('fromUserId').isString().exists(),
    body('spaceId').isString().optional(),
    body('isPublic').isBoolean().optional(),
    body('isDraft').isBoolean().optional(),
    body('message').isString().exists(),
    body('notificationMsg').isString().optional(),
    body('mediaIds').isString().optional(),
    body('mentionsIds').isString().optional(),
    body('hashTags').isString().optional(),
    body('maxViews').isNumeric().optional(),
    body('maxProximity').isDecimal().optional(),
    body('latitude').isDecimal().exists(),
    body('longitude').isDecimal().exists(),
    body('media').isArray().optional(), // TODO: Add granularity
    oneOf([
        body('radius').isDecimal().exists(),
        body('polygonCoords').custom((polygonCoords, { req }) => {
            if (!Array.isArray(polygonCoords)) {
                return Promise.reject('polygonCoords must be an array'); // eslint-disable-line prefer-promise-reject-errors
            }
            const invalid = polygonCoords.some((polygonCoord) => {
                if (!Array.isArray(polygonCoord)
                    || polygonCoord.length !== 2
                    || !Number.isNaN(polygonCoord[0])
                    || !Number.isNaN(parseFloat(polygonCoord[0]))
                    || !Number.isNaN(polygonCoord[1])
                    || !Number.isNaN(parseFloat(polygonCoord[1]))) {
                    (req as any).errorMessage = 'polygonCoords must be an array of coordinate arrays (latitude,longitude)';
                    return true;
                }
                return false;
            });

            return invalid ? Promise.reject((req as any).errorMessage) : Promise.resolve();
        }),
    ]),
];

export const updateAreaValidation = [
    ...createAreaValidation,
    param('momentId'),
];

export const searchAreasValidation = [
    query('longitude').exists(),
    query('latitude').exists(),
];

export const searchMyAreasValidation = [
];

export const deleteAreasValidation = [
    body('ids').isArray(),
];
