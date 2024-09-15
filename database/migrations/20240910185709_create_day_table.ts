import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const migration = await knex.schema.createTable("days", function (table) {
        table.increments('id');
        table.string("name");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    return migration;
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("days");
}