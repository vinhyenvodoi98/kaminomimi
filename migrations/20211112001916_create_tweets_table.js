exports.up = function (knex) {
  return knex.schema.createTable('tweets', function (table) {
    table.string('tweet_keyword').primary().notNullable();
    table.string('user_id').references('user_id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tweets');
};
