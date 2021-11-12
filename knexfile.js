require('dotenv').config();

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_DB } = process.env;
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: DATABASE_DB,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    },
    migrations: {
      directory: './migrations',
    },
    useNullAsDefault: true,
  },
};
