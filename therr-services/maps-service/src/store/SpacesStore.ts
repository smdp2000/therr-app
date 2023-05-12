import KnexBuilder, { Knex } from 'knex';
import * as countryGeo from 'country-reverse-geocoding';
import { Location } from 'therr-js-utilities/constants';
import formatSQLJoinAsJSON from 'therr-js-utilities/format-sql-join-as-json';
import { IConnection } from './connection';
import { storage } from '../api/aws';
import MediaStore, { ICreateMediaParams } from './MediaStore';
import getBucket from '../utilities/getBucket';
import findUsers from '../utilities/findUsers';
import { isTextUnsafe } from '../utilities/contentSafety';
import { SPACE_INCENTIVES_TABLE_NAME } from './SpaceIncentivesStore';

const knexBuilder: Knex = KnexBuilder({ client: 'pg' });

export const SPACES_TABLE_NAME = 'main.spaces';

const countryReverseGeo = countryGeo.country_reverse_geocoding();
const maxNotificationMsgLength = 100;
export interface ICreateSpaceParams {
    addressReadable?: string;
    areaType?: string;
    category?: string;
    expiresAt?: any;
    fromUserId: string;
    locale: string;
    isPublic?: boolean;
    isMatureContent?: boolean;
    message: string;
    notificationMsg?: string;
    mediaIds?: string;
    media?: ICreateMediaParams[];
    mentionsIds?: string;
    hashTags?: string;
    maxViews?: number;
    maxProximity?: number;
    latitude: number;
    longitude: number;
    radius?: string;
    polygonCoords?: string;
    featuredIncentiveKey: string;
    featuredIncentiveValue: number;
    featuredIncentiveRewardKey: string;
    featuredIncentiveRewardValue: number;
    featuredIncentiveCurrencyId: string;
}

interface IDeleteSpacesParams {
    fromUserId: string;
    ids: string[];
}

const sanitizeNotificationMsg = (message = '') => message.replace(/\r?\n+|\r+/gm, ' ');

export default class SpacesStore {
    db: IConnection;

    mediaStore: MediaStore;

    constructor(dbConnection, mediaStore) {
        this.db = dbConnection;
        this.mediaStore = mediaStore;
    }

    /**
     * This is used to check for duplicates before creating a new spaces
     */
    get(filters) {
        const notificationMsg = filters.notificationMsg
            ? `${sanitizeNotificationMsg(filters.notificationMsg).substring(0, maxNotificationMsgLength)}`
            : `${sanitizeNotificationMsg(filters.message).substring(0, maxNotificationMsgLength)}`;
        // hard limit to prevent overloading client
        const query = knexBuilder
            .from(SPACES_TABLE_NAME)
            .where({
                fromUserId: filters.fromUserId,
                message: filters.message,
                notificationMsg,
            });

        return this.db.read.query(query.toString()).then((response) => response.rows);
    }

    // eslint-disable-next-line default-param-last
    searchMySpaces(conditions: any = {}, returning, userId: string, overrides?: any, includePublicResults = true) {
        const offset = conditions.pagination.itemsPerPage * (conditions.pagination.pageNumber - 1);
        const limit = conditions.pagination.itemsPerPage;
        let queryString: any = knexBuilder
            .select((returning && returning.length) ? returning : '*')
            .from(SPACES_TABLE_NAME)
            // TODO: Determine a better way to select spaces that are most relevant to the user
            // .orderBy(`${SPACES_TABLE_NAME}.updatedAt`) // Sorting by updatedAt is very expensive/slow
            // NOTE: Cast to a geography type to search distance within n meters
            .where({
                fromUserId: userId,
                isMatureContent: false, // content that has been blocked
            });

        if (conditions.query != undefined && conditions.filterBy) { // eslint-disable-line eqeqeq
            const operator = conditions.filterOperator || '=';
            const query = operator === 'ilike' ? `%${conditions.query}%` : conditions.query;

            queryString = queryString.andWhere(conditions.filterBy, operator, query);
            queryString = queryString.andWhere((builder) => { // eslint-disable-line func-names
                builder.where(conditions.filterBy, operator, query);
                if (includePublicResults) {
                    builder.orWhere({ isPublic: true });
                }
            });
        }

        queryString = queryString
            .limit(limit)
            .offset(offset)
            .toString();

        return this.db.read.query(queryString).then((response) => {
            const configuredResponse = formatSQLJoinAsJSON(response.rows, []);
            return configuredResponse;
        });
    }

    getById(id) {
        const query = knexBuilder
            .select([
                `${SPACES_TABLE_NAME}.id`,
                `${SPACES_TABLE_NAME}.fromUserId`,
            ])
            .from(SPACES_TABLE_NAME)
            .leftJoin(SPACE_INCENTIVES_TABLE_NAME, `${SPACES_TABLE_NAME}.id`, `${SPACE_INCENTIVES_TABLE_NAME}.spaceId`)
            .columns([
                `${SPACE_INCENTIVES_TABLE_NAME}.id as incentives[].id`,
                `${SPACE_INCENTIVES_TABLE_NAME}.incentiveKey as incentives[].incentiveKey`,
                `${SPACE_INCENTIVES_TABLE_NAME}.incentiveValue as incentives[].incentiveValue`,
                `${SPACE_INCENTIVES_TABLE_NAME}.incentiveRewardKey as incentives[].incentiveRewardKey`,
                `${SPACE_INCENTIVES_TABLE_NAME}.incentiveRewardValue as incentives[].incentiveRewardValue`,
                `${SPACE_INCENTIVES_TABLE_NAME}.incentiveCurrencyId as incentives[].incentiveCurrencyId`,
                `${SPACE_INCENTIVES_TABLE_NAME}.isActive as incentives[].isActive`,
                `${SPACE_INCENTIVES_TABLE_NAME}.isFeatured as incentives[].isFeatured`,
                `${SPACE_INCENTIVES_TABLE_NAME}.maxUseCount as incentives[].maxUseCount`,
                `${SPACE_INCENTIVES_TABLE_NAME}.minUserDataProps as incentives[].minUserDataProps`,
                `${SPACE_INCENTIVES_TABLE_NAME}.region as incentives[].region`,
                `${SPACE_INCENTIVES_TABLE_NAME}.requiredUserDataProps as incentives[].requiredUserDataProps`,
                `${SPACE_INCENTIVES_TABLE_NAME}.startsAt as incentives[].startsAt`,
                `${SPACE_INCENTIVES_TABLE_NAME}.endsAt as incentives[].endsAt`,
            ])
            .where({
                [`${SPACES_TABLE_NAME}.id`]: id,
            });

        return this.db.read.query(query.toString())
            .then((response) => formatSQLJoinAsJSON(response.rows, [{ propKey: 'incentives', propId: 'id' }]));
    }

    getByIdSimple(id) {
        const query = knexBuilder
            .select([
                'id',
                'category',
                'fromUserId',
                'isPublic',
                'isMatureContent',
                'latitude',
                'longitude',
                'message',
                'notificationMsg',
                'radius',
                'region',
            ])
            .from(SPACES_TABLE_NAME)
            .where({
                id,
            });

        return this.db.read.query(query.toString())
            .then((response) => response.rows);
    }

    // Combine with search to avoid getting count out of sync
    countRecords(params, fromUserIds) {
        let proximityMax = Location.AREA_PROXIMITY_METERS;
        if ((params.filterBy && params.filterBy === 'distance') && params.query) {
            proximityMax = params.query;
        }
        let queryString = knexBuilder
            .from(SPACES_TABLE_NAME)
            .count('*')
            // NOTE: Cast to a geography type to search distance within n meters
            .where(knexBuilder.raw(`ST_DWithin(geom, ST_MakePoint(${params.longitude}, ${params.latitude})::geography, ${proximityMax})`));

        if ((params.filterBy && params.filterBy !== 'distance')) {
            if (params.filterBy === 'fromUserIds') {
                queryString = queryString.andWhere((builder) => { // eslint-disable-line func-names
                    builder.whereIn('fromUserId', fromUserIds);
                });
            } else if (params.query != undefined) { // eslint-disable-line eqeqeq
                queryString = queryString.andWhere({
                    [params.filterBy]: params.query || '',
                });
            }
        }

        return this.db.read.query(queryString.toString()).then((response) => response.rows);
    }

    // eslint-disable-next-line default-param-last
    searchSpaces(conditions: any = {}, returning, fromUserIds: string[] = [], overrides?: any, includePublicResults = true) {
        const offset = conditions.pagination.itemsPerPage * (conditions.pagination.pageNumber - 1);
        const limit = conditions.pagination.itemsPerPage;
        let proximityMax = overrides?.distanceOverride || Location.AREA_PROXIMITY_METERS;
        if ((conditions.filterBy && conditions.filterBy === 'distance') && conditions.query) {
            proximityMax = conditions.query;
        }
        let queryString: any = knexBuilder
            .select((returning && returning.length) ? returning : '*')
            .from(SPACES_TABLE_NAME)
            // TODO: Determine a better way to select spaces that are most relevant to the user
            // .orderBy(`${SPACES_TABLE_NAME}.updatedAt`) // Sorting by updatedAt is very expensive/slow
            // NOTE: Cast to a geography type to search distance within n meters
            .where(knexBuilder.raw(`ST_DWithin(geom, ST_MakePoint(${conditions.longitude}, ${conditions.latitude})::geography, ${proximityMax})`)) // eslint-disable-line quotes, max-len
            .andWhere({
                isMatureContent: false, // content that has been blocked
            });

        if ((conditions.filterBy && conditions.filterBy !== 'distance') && conditions.query != undefined) { // eslint-disable-line eqeqeq
            const operator = conditions.filterOperator || '=';
            const query = operator === 'ilike' ? `%${conditions.query}%` : conditions.query;

            if (conditions.filterBy === 'fromUserIds') {
                queryString = queryString.andWhere((builder) => { // eslint-disable-line func-names
                    builder.whereIn('fromUserId', fromUserIds);
                    if (includePublicResults) {
                        builder.orWhere({ isPublic: true });
                    }
                });
            } else {
                queryString = queryString.andWhere(conditions.filterBy, operator, query);
                queryString = queryString.andWhere((builder) => { // eslint-disable-line func-names
                    builder.where(conditions.filterBy, operator, query);
                    if (includePublicResults) {
                        builder.orWhere({ isPublic: true });
                    }
                });
            }
        }

        queryString = queryString
            .limit(limit)
            .offset(offset)
            .toString();

        return this.db.read.query(queryString).then((response) => {
            const configuredResponse = formatSQLJoinAsJSON(response.rows, []);
            return configuredResponse;
        });
    }

    findSpaces(spaceIds, filters, options: any = {}) {
        // hard limit to prevent overloading client
        const restrictedLimit = (filters.limit) > 1000 ? 1000 : filters.limit;
        const orderBy = filters.orderBy || `${SPACES_TABLE_NAME}.updatedAt`;
        const order = filters.order || 'DESC';

        let query = knexBuilder
            .from(SPACES_TABLE_NAME)
            .orderBy(orderBy, order)
            .where('createdAt', '<', filters.before || new Date())
            .whereIn('id', spaceIds || [])
            .limit(restrictedLimit);

        if (options?.shouldHideMatureContent) {
            query = query.where({ isMatureContent: false });
        }

        return this.db.read.query(query.toString()).then(async ({ rows: spaces }) => {
            if (options.withMedia || options.withUser) {
                const mediaIds: string[] = [];
                const userIds: string[] = [];
                const signingPromises: any = [];
                const imageExpireTime = Date.now() + 60 * 60 * 1000; // 60 minutes
                const spaceDetailsPromises: Promise<any>[] = [];
                const matchingUsers: any = {};

                spaces.forEach((space) => {
                    if (options.withMedia && space.mediaIds) {
                        mediaIds.push(...space.mediaIds.split(','));
                    }
                    if (options.withUser) {
                        userIds.push(space.fromUserId);
                    }
                });
                // TODO: Try fetching from redis/cache first, before fetching remaining media from DB
                spaceDetailsPromises.push(options.withMedia ? this.mediaStore.get(mediaIds) : Promise.resolve(null));
                spaceDetailsPromises.push(options.withUser ? findUsers({ ids: userIds }) : Promise.resolve(null));

                const [media, users] = await Promise.all(spaceDetailsPromises);

                // TODO: Optimize
                const mappedSpaces = spaces.map((space) => {
                    const modifiedSpace = space;
                    modifiedSpace.media = [];
                    modifiedSpace.user = {};

                    // MEDIA
                    if (options.withMedia && space.mediaIds) {
                        const ids = modifiedSpace.mediaIds.split(',');
                        modifiedSpace.media = media.filter((m) => {
                            if (ids.includes(m.id)) {
                                const bucket = getBucket(m.type);
                                if (bucket) {
                                    // TODO: Consider alternatives to cache these urls (per user) and their expire time
                                    const promise = storage
                                        .bucket(bucket)
                                        .file(m.path)
                                        .getSignedUrl({
                                            version: 'v4',
                                            action: 'read',
                                            expires: imageExpireTime,
                                        })
                                        .then((urls) => ({
                                            [m.id]: urls[0],
                                        }))
                                        .catch((err) => {
                                            console.log(err);
                                            return {};
                                        });
                                    signingPromises.push(promise);
                                } else {
                                    console.log('MomentsStore.ts: bucket is undefined');
                                }

                                return true;
                            }

                            return false;
                        });
                    }

                    // USER
                    if (options.withUser) {
                        const matchingUser = users.find((user) => user.id === modifiedSpace.fromUserId);
                        if (matchingUser) {
                            matchingUsers[matchingUser.id] = matchingUser;
                            modifiedSpace.fromUserName = matchingUser.userName;
                            modifiedSpace.fromUserFirstName = matchingUser.firstName;
                            modifiedSpace.fromUserLastName = matchingUser.lastName;
                            modifiedSpace.fromUserMedia = matchingUser.media;
                        }
                    }

                    return modifiedSpace;
                });

                return Promise.all(signingPromises).then((signedUrlResponses) => ({
                    spaces: mappedSpaces,
                    media: signedUrlResponses.reduce((prev: any, curr: any) => ({ ...curr, ...prev }), {}),
                    users: matchingUsers,
                }));
            }

            return {
                spaces,
                media: {},
                users: {},
            };
        });
    }

    createSpace(params: ICreateSpaceParams) {
        const region = countryReverseGeo.get_country(params.latitude, params.longitude);
        const notificationMsg = params.notificationMsg
            ? `${sanitizeNotificationMsg(params.notificationMsg).substring(0, maxNotificationMsgLength)}`
            : `${sanitizeNotificationMsg(params.message).substring(0, maxNotificationMsgLength)}`;

        // TODO: Support creating multiple
        // eslint-disable-next-line no-param-reassign
        params.media = params.media
            ? params.media.map((media, index): ICreateMediaParams => ({
                ...media,
                fromUserId: params.fromUserId,
                altText: `${notificationMsg} ${index}`,
            }))
            : undefined;

        const mediaPromise: Promise<string | undefined> = params.media
            ? this.mediaStore.create(params.media[0]).then((mediaIds) => mediaIds.toString())
            : Promise.resolve(undefined);

        const isTextMature = isTextUnsafe([notificationMsg, params.message, params.hashTags || '']);

        return mediaPromise.then((mediaIds: string | undefined) => {
            const sanitizedParams = {
                addressReadable: params.addressReadable || '',
                areaType: params.areaType || 'spaces',
                category: params.category || 'uncategorized',
                expiresAt: params.expiresAt,
                fromUserId: params.fromUserId,
                locale: params.locale,
                isPublic: isTextMature ? false : !!params.isPublic, // NOTE: For now make this content private to reduce public, mature content
                isMatureContent: isTextMature || !!params.isMatureContent,
                message: params.message,
                notificationMsg,
                mediaIds: mediaIds || params.mediaIds || '',
                mentionsIds: params.mentionsIds || '',
                hashTags: params.hashTags || '',
                maxViews: params.maxViews || 0,
                maxProximity: params.maxProximity,
                latitude: params.latitude,
                longitude: params.longitude,
                radius: params.radius,
                region: region.code,
                polygonCoords: params.polygonCoords ? JSON.stringify(params.polygonCoords) : JSON.stringify([]),
                featuredIncentiveKey: params.featuredIncentiveKey,
                featuredIncentiveValue: params.featuredIncentiveValue,
                featuredIncentiveRewardKey: params.featuredIncentiveRewardKey,
                featuredIncentiveRewardValue: params.featuredIncentiveRewardValue,
                featuredIncentiveCurrencyId: params.featuredIncentiveCurrencyId,
                // eslint-disable-next-line max-len
                geom: knexBuilder.raw(`ST_SetSRID(ST_Buffer(ST_MakePoint(${params.longitude}, ${params.latitude})::geography, ${params.radius})::geometry, 4326)`),
            };

            const queryString = knexBuilder.insert(sanitizedParams)
                .into(SPACES_TABLE_NAME)
                .returning('*')
                .toString();

            return this.db.write.query(queryString).then((response) => response.rows);
        });
    }

    updateSpace(id: string, params: any = {}) {
        const sanitizedParams = {
            isMatureContent: params.isMatureContent,
            isPublic: params.isMatureContent === true ? true : undefined, // NOTE: For now make this content private to reduce public, mature content
            featuredIncentiveKey: params.featuredIncentiveKey,
            featuredIncentiveValue: params.featuredIncentiveValue,
            featuredIncentiveRewardKey: params.featuredIncentiveRewardKey,
            featuredIncentiveRewardValue: params.featuredIncentiveRewardValue,
            incentiveCurrencyId: params.incentiveCurrencyId,
        };
        const queryString = knexBuilder.update(sanitizedParams)
            .into(SPACES_TABLE_NAME)
            .where({ id })
            .returning(['id'])
            .toString();

        return this.db.write.query(queryString).then((response) => response.rows);
    }

    delete(fromUserId: string) {
        const queryString = knexBuilder.delete()
            .from(SPACES_TABLE_NAME)
            .where('fromUserId', fromUserId)
            .toString();

        return this.db.write.query(queryString).then((response) => response.rows);
    }

    deleteSpaces(params: IDeleteSpacesParams) {
        // TODO: RSERV-52 | Consider archiving only, and delete associated reactions from reactions-service
        const queryString = knexBuilder.delete()
            .from(SPACES_TABLE_NAME)
            .where('fromUserId', params.fromUserId)
            .whereIn('id', params.ids)
            .toString();

        return this.db.write.query(queryString).then((response) => response.rows);
    }
}
