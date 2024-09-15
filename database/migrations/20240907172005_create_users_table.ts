import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", function (table) {
        table.bigIncrements('id');
        table.string('email', 255).notNullable().unique();
        table.string('oauth_provider', 50).nullable();
        table.string('google_id', 255).nullable();
        table.string('name', 255).nullable();
        table.string('password_hash', 64).nullable();
        table.text('profile_picture_url').nullable();
        table.text('access_token').nullable();
        table.text('refresh_token').nullable();
        table.boolean('fit_sync_status').defaultTo(false);
        table.boolean('otp_verified').defaultTo(false);
        table.boolean('profile_saved').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
