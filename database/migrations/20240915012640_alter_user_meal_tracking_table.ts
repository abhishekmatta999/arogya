import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("user_meal_tracking", function (table) {
        table.string('meal_type');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("user_meal_tracking", function (table) {
        table.dropColumn('meal_type');
    });
}
