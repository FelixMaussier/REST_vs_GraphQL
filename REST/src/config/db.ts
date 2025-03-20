import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'felixmaussier',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'product',
    },
    pool: { min: 2, max: 10 }
});

export default db;