import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("days").del();

    // Inserts seed entries
    await knex("days").insert([
        { id: 1, name: "Day 1" },
        { id: 2, name: "Day 2" },
        { id: 3, name: "Day 3" },
        { id: 4, name: "Day 4" },
        { id: 5, name: "Day 5" },
        { id: 6, name: "Day 6" },
        { id: 7, name: "Day 7" }

    ]);
};
