import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const migration = await knex.schema.createTable("user_weight", function (table) {
        table.increments('id');
        table
            .integer("user_id")
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')

        table.float('weight').notNullable();
        table.date('date').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    return migration;
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_weight");
}