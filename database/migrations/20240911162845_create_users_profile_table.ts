import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const migration = await knex.schema.createTable("user_profile", function (table) {
        table.increments('id');
        table
            .integer("user_id")
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.integer("daily_step_count_target").defaultTo(0);
        table.integer("daily_calories_target").defaultTo(0);
        table.float("weight_target").defaultTo(0);
        table.string("active").nullable();
        table.integer('age');
        table.float('weight');
        table.float('height');
        table.string('gender');
        table.specificType('diseases', 'text[]');
        table.specificType('health_preference', 'text[]');
        table.specificType('diet_preference', 'text[]');
        table.float('bmi');
        table.float('calorie_intake');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    return migration;
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_profile");
}