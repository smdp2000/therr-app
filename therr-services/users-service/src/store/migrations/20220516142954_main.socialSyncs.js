exports.up = (knex) => knex.schema.withSchema('main').createTable('socialSyncs', (table) => {
    table.uuid('id').primary().notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('userId')
        .references('id')
        .inTable('main.users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    table.string('platform');
    table.string('platformUsername');
    table.string('platformUserId');
    table.string('link');
    table.string('displayName');
    table.string('followerCount');
    table.string('customIconFilename');
    table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.unique(['userId', 'link']);
    table.index('userId').index('id');
});

exports.down = (knex) => knex.schema.withSchema('main').dropTable('socialSyncs');
