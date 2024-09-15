import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const migration = await knex.schema.createTable("user_meal_tracking", function (table) {
        table.increments('id');
        table
            .integer("user_id")
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.string('meal_name');
        table.string('meal_quantity');
        table.string('meal_unit');
        table.string('calories');
        table.string('protein');
        table.string('fiber');
        table.string('fat');
        table.string('carbs');
        table.timestamp('meal_time');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    return migration;
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_meal_tracking");
}