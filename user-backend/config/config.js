// File: user-backend/config/config.js

require('dotenv').config();
module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST, // force localhost
        dialect: process.env.DB_DIALECT || 'mysql'

    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST, // force localhost
        dialect: process.env.DB_DIALECT || 'mysql'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_PRODUCTION,
        host: process.env.DB_HOST, // force localhost
        dialect: process.env.DB_DIALECT || 'mysql'
    }
};