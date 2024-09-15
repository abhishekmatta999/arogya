import 'dotenv/config';
import { knexSnakeCaseMappers } from 'objection';

module.exports = {
    client: 'pg',
    debug: true,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8',
        ssl: false,
    },
    useNullAsDefault: true,
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'migrations',
        directory: './database/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './database/seeds',
    },
    ...knexSnakeCaseMappers(),
};
