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
function unique(arr) {
  var newArr = [];
  newArr = arr.filter(function (item) {
    return newArr.findIndex((newArr) => newArr.tag === item.tag) !== -1 ? '' : newArr.push(item);
  });
  return newArr;
}

module.exports.handler = async (event) => {
  const knex = initKnex();
  const upsert = async (params) => {
    const { table, object, createData, constraint } = params;
    const insert = knex(table).insert(createData);
    const update = knex.queryBuilder().update(object);
    return await knex.raw(`? ON CONFLICT ${constraint} DO ? returning *`, [insert, update]);
  };
  var datas = event.Records.map((record) => Buffer.from(record.kinesis.data, 'base64').toString());

  datas = datas.map((data) => {
    data = JSON.parse(data);
    return data.matching_rules;
  });
  datas = [].concat.apply([], datas);
  var uniqueArray = unique(datas);
  uniqueArray = uniqueArray.map((element) => {
    element.count = datas.filter((obj) => obj.tag === element.tag).length;
    return element;
  });

  try {
    var queries = uniqueArray.map((rule) => {
      return upsert({
        table: 'tweets',
        createData: { tweet_keyword: rule.tag, number_mention: rule.count },
        object: {
          tweet_keyword: rule.tag,
          number_mention: knex.raw(`tweets.number_mention + ${rule.count}`),
        },
        constraint: '(tweet_keyword)',
      });
    });
    Promise.all(queries);
    return event;
  } catch (error) {
    return error;
  }
};
