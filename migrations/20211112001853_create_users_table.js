exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('user_id').primary().notNullable();
    table.string('weight').notNullable();
    table.timestamp('date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
