const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

// Update with your config settings.
module.exports = {
    development: {
        client: 'pg',
        connection: {
            database: process.env.REACTIONS_SERVICE_DATABASE,
            host: process.env.DB_HOST_MAIN_WRITE,
            user: process.env.DB_USER_MAIN_WRITE,
            password: process.env.DB_PASSWORD_MAIN_WRITE,
            port: Number(process.env.DB_PORT_MAIN_WRITE),
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
    production: {
        client: 'pg',
        connection: {
            database: process.env.REACTIONS_SERVICE_DATABASE,
            host: process.env.DB_HOST_MAIN_WRITE,
            user: process.env.DB_USER_MAIN_WRITE,
            password: process.env.DB_PASSWORD_MAIN_WRITE,
            port: Number(process.env.DB_PORT_MAIN_WRITE),
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
