import Knex from 'knex';

const tableName = 'classes';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.decimal('price').notNullable();

    // relationship with users
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
