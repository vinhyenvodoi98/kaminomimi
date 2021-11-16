exports.up = function (knex) {
  return knex.schema.createTable('tweets', function (table) {
    table.string('tweet_keyword').primary().notNullable();
    table.integer('number_mention').defaultTo('0');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tweets');
};
