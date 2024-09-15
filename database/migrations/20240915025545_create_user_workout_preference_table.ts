import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_workout_plan", function (table) {
        table.bigIncrements('id');
        table
            .integer("user_id")
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.string("primary_goal");
        table.string("fitness_level");
        table.integer("days_per_week");
        table.string("duration");
        table.string("workout_preference");
        table.jsonb("workout_plan");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_workout_plan");
}
