require('dotenv').config();

// const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_DB } = process.env;

// function initKnex() {
//   return require('knex')({
//     client: 'pg',
//     connection: {
//       database: DATABASE_DB,
//       user: DATABASE_USER,
//       password: DATABASE_PASSWORD,
//       host: DATABASE_HOST,
//       port: DATABASE_PORT,
//     },
//   });
// }

// const main = async (event) => {
module.exports.handler = async (event) => {
  // const knex = initKnex();
  // const tableName = 'tweets';
  // const upsert = async (params) => {
  //   const { table, object, createData, constraint } = params;
  //   const insert = knex(table).insert(createData);
  //   const update = knex.queryBuilder().update(object);
  //   return await knex.raw(`? ON CONFLICT ${constraint} DO ? returning *`, [insert, update]);
  // };

  try {
    // var queries = event.matching_rules.map((rule) => {
    //   return upsert({
    //     table: 'tweets',
    //     createData: { tweet_keyword: 'sss', number_mention: 1 },
    //     object: { tweet_keyword: 'sss', number_mention: knex.raw('tweets.number_mention + 1') },
    //     constraint: '(tweet_keyword)',
    //   });
    // });
    // Promise.all(queries);
    return event;
  } catch (error) {
    return error;
  }
};
