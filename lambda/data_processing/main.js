require('dotenv').config();

const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_DB } = process.env;

function initKnex() {
  return require('knex')({
    client: 'pg',
    connection: {
      database: DATABASE_DB,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    },
  });
}
module.exports.handler = async (event) => {
  try {
    var knex = initKnex();

    // Insert users table
    await knex('users').insert([{ user_id: '123456', weight: '4' }]);
    return {
      statusCode: 200,
      body: JSON.stringify({
        today: new Date() + "👉️ 'Today is a' eeee",
        event,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        today: new Date() + "👉️ 'Today is a' eeee",
        error,
      }),
    };
  }
};
