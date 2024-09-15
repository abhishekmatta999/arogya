import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const migration = await knex.schema.createTable("user_diet_plan", function (table) {
        table.increments('id');
        table
            .integer("user_id")
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')

        table.string('meal_type');
        table.string('meal_name');
        table.string('meal_eat_type');
        table.string('meal_quantity');
        table.string('calories');
        table.string('protein');
        table.string('fiber');
        table.string('fat');
        table.string('carbs');
        table.integer('day_id')
            .references('id')
            .inTable('days')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    return migration;
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_diet_plan");
}