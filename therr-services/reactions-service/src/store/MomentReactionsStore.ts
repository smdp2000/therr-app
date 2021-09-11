import KnexBuilder, { Knex } from 'knex';
import { IConnection } from './connection';

const knexBuilder: Knex = KnexBuilder({ client: 'pg' });

export const MOMENT_REACTIONS_TABLE_NAME = 'main.momentReactions';

export interface ICreateMomentReactionParams {
    momentId: number;
    userId: number;
    userViewCount?: number;
    userHasActivated?: boolean;
    userHasLiked?: boolean;
    userHasSuperLiked?: boolean;
    userHasDisliked?: boolean;
    userHasSuperDisliked?: boolean;
    userLocale?: string;
}

export interface IUpdateMomentReactionConditions {
    momentId?: number;
    userId?: number;
}

export interface IUpdateMomentReactionParams {
    userViewCount?: number;
    userHasActivated?: boolean;
    userHasLiked?: boolean;
    userHasSuperLiked?: boolean;
    userHasDisliked?: boolean;
    userHasSuperDisliked?: boolean;
    userLocale?: string;
}

interface IUpdateWhereInConfig {
    columns: string[];
    whereInArray: any[][];
}

export default class MomentReactionsStore {
    db: IConnection;

    constructor(dbConnection) {
        this.db = dbConnection;
    }

    get(conditions: any, momentIds?, filters = { limit: 100, offset: 0 }, customs: any = {}) {
        const restrictedLimit = (filters.limit) > 1000 ? 1000 : filters.limit;

        let queryString = knexBuilder.select('*')
            .from(MOMENT_REACTIONS_TABLE_NAME)
            .where(conditions)
            .limit(restrictedLimit)
            .offset(filters.offset);

        if (customs.withBookmark) {
            queryString = queryString.whereNotNull('userBookmarkCategory');
        }

        if (momentIds && momentIds.length) {
            queryString = queryString.whereIn('momentId', momentIds);
        }

        return this.db.read.query(queryString.toString()).then((response) => response.rows);
    }

    getByMomentId(conditions: any, limit = 100) {
        // TODO: RSERVE-52 | Remove hard limit and optimize for getting reaction counts
        const restrictedLimit = limit > 1000 ? 1000 : limit;

        const queryString = knexBuilder.select('*')
            .from(MOMENT_REACTIONS_TABLE_NAME)
            .where(conditions)
            .limit(restrictedLimit);

        return this.db.read.query(queryString.toString()).then((response) => response.rows);
    }

    create(params: ICreateMomentReactionParams | ICreateMomentReactionParams[]) {
        const queryString = knexBuilder(MOMENT_REACTIONS_TABLE_NAME)
            .insert(params)
            .returning('*')
            .toString();

        return this.db.write.query(queryString).then((response) => response.rows);
    }

    update(conditions: IUpdateMomentReactionConditions, params: IUpdateMomentReactionParams, whereIn?: IUpdateWhereInConfig) {
        let queryString = knexBuilder.update({
            ...params,
            updatedAt: new Date(),
        })
            .into(MOMENT_REACTIONS_TABLE_NAME)
            .where(conditions)
            .returning('*');

        if (whereIn && whereIn.whereInArray?.length) {
            queryString = queryString.whereIn(whereIn.columns, whereIn.whereInArray);
        }

        return this.db.write.query(queryString.toString()).then((response) => response.rows);
    }
}
