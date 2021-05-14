import Knex from 'knex';
import * as countryGeo from 'country-reverse-geocoding';
import { Content, Location } from 'therr-js-utilities/constants';
import formatSQLJoinAsJSON from 'therr-js-utilities/format-sql-join-as-json';
import { IConnection } from './connection';
import { storage } from '../api/aws';
import MediaStore, { ICreateMediaParams } from './MediaStore';
import getBucket from '../utilities/getBucket';

const knex: Knex = Knex({ client: 'pg' });

export const MOMENTS_TABLE_NAME = 'main.moments';

const countryReverseGeo = countryGeo.country_reverse_geocoding();
export interface ICreateMomentParams {
    expiresAt?: any;
    fromUserId: number;
    locale: string;
    isPublic?: boolean;
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
}

interface IDeleteMomentsParams {
    fromUserId: string;
    ids: string[];
}

const sanitizeNotificationMsg = (message = '') => message.replace(/\r?\n+|\r+/gm, ' ');

export default class MomentsStore {
    db: IConnection;

    mediaStore: MediaStore;

    constructor(dbConnection, mediaStore) {
        this.db = dbConnection;
        this.mediaStore = mediaStore;
    }

    // Combine with search to avoid getting count out of sync
    countRecords(params, fromUserIds) {
        let proximityMax = Location.MOMENT_PROXIMITY_METERS;
        if ((params.filterBy && params.filterBy === 'distance') && params.query) {
            proximityMax = params.query;
        }
        let queryString = knex
            .count('*')
            .from(MOMENTS_TABLE_NAME)
            // NOTE: Cast to a geography type to search distance within n meters
            .where(knex.raw(`ST_DWithin(geom, ST_MakePoint(${params.longitude}, ${params.latitude})::geography, ${proximityMax})`));

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

    searchMoments(conditions: any = {}, returning, fromUserIds = [], overrides?: any) {
        const offset = conditions.pagination.itemsPerPage * (conditions.pagination.pageNumber - 1);
        const limit = conditions.pagination.itemsPerPage;
        let proximityMax = overrides?.distanceOverride || Location.MOMENT_PROXIMITY_METERS;
        if ((conditions.filterBy && conditions.filterBy === 'distance') && conditions.query) {
            proximityMax = conditions.query;
        }
        let queryString: any = knex
            .select((returning && returning.length) ? returning : '*')
            .from(MOMENTS_TABLE_NAME)
            .orderBy(`${MOMENTS_TABLE_NAME}.updatedAt`)
            // NOTE: Cast to a geography type to search distance within n meters
            .where(knex.raw(`ST_DWithin(geom, ST_MakePoint(${conditions.longitude}, ${conditions.latitude})::geography, ${proximityMax})`)); // eslint-disable-line quotes, max-len

        if ((conditions.filterBy && conditions.filterBy !== 'distance') && conditions.query != undefined) { // eslint-disable-line eqeqeq
            const operator = conditions.filterOperator || '=';
            const query = operator === 'ilike' ? `%${conditions.query}%` : conditions.query;

            if (conditions.filterBy === 'fromUserIds') {
                queryString = queryString.andWhere((builder) => { // eslint-disable-line func-names
                    builder.whereIn('fromUserId', fromUserIds);
                });
            } else {
                queryString = queryString.andWhere(conditions.filterBy, operator, query);
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

    findMoments(momentIds, filters, options: any = {}) {
        // hard limit to prevent overloading client
        const restrictedLimit = (filters.limit) > 1000 ? 1000 : filters.limit;

        const query = knex
            .from(MOMENTS_TABLE_NAME)
            .orderBy(`${MOMENTS_TABLE_NAME}.updatedAt`, 'desc')
            .whereIn('id', momentIds || [])
            .limit(restrictedLimit);

        return this.db.read.query(query.toString()).then(async (response) => {
            if (options.withMedia) {
                let mediaIds: string[] = [];
                const signingPromises: any = [];
                const imageExpireTime = Date.now() + 60 * 60 * 1000; // 60 minutes

                response.rows.forEach((moment) => {
                    if (moment.mediaIds) {
                        mediaIds = [...mediaIds, ...moment.mediaIds.split(',')];
                    }
                });
                // TODO: Try fetching from redis/cache first, before fetching remaining media from DB
                const media = await this.mediaStore.get(mediaIds);

                // TODO: Optimize
                const mappedMoments = response.rows.map((moment) => {
                    const modifiedMoment = moment;

                    modifiedMoment.media = [];
                    if (moment.mediaIds) {
                        const ids = modifiedMoment.mediaIds.split(',');
                        modifiedMoment.media = media.filter((m) => {
                            if (ids.includes(m.id.toString())) {
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
                                        }).then((urls) => ({
                                            [m.id]: urls[0],
                                        }));
                                    signingPromises.push(promise);
                                } else {
                                    console.log('MometsStore.ts: bucket is undefined');
                                }

                                return true;
                            }

                            return false;
                        });
                    }

                    return modifiedMoment;
                });

                return Promise.all(signingPromises).then((signedUrlResponses) => ({
                    moments: mappedMoments,
                    media: signedUrlResponses.reduce((prev: any, curr: any) => ({ ...curr, ...prev }), {}),
                }));
            }

            return {
                moments: response.rows,
                media: {},
            };
        });
    }

    createMoment(params: ICreateMomentParams) {
        const region = countryReverseGeo.get_country(params.latitude, params.longitude);
        const notificationMsg = params.notificationMsg
            ? `${sanitizeNotificationMsg(params.notificationMsg).substring(0, 25)}...`
            : `${sanitizeNotificationMsg(params.message).substring(0, 25)}...`;

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

        return mediaPromise.then((mediaIds: string | undefined) => {
            const sanitizedParams = {
                expiresAt: params.expiresAt,
                fromUserId: params.fromUserId,
                locale: params.locale,
                isPublic: !!params.isPublic,
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
                geom: knex.raw(`ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)`),
            };

            const queryString = knex.insert(sanitizedParams)
                .into(MOMENTS_TABLE_NAME)
                .returning('*')
                .toString();

            return this.db.write.query(queryString).then((response) => response.rows);
        });
    }

    deleteMoments(params: IDeleteMomentsParams) {
        // TODO: RSERV-52 | Consider archiving only, and delete associated reactions from reactions-service
        const queryString = knex.delete()
            .from(MOMENTS_TABLE_NAME)
            .where('fromUserId', params.fromUserId)
            .whereIn('id', params.ids)
            .toString();

        return this.db.write.query(queryString).then((response) => response.rows);
    }
}
