/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableNames = require("../../src/constants/tableNames");
const {
  addDefaultColumns,
  createNameTable,
  references,
  url,
  email,
} = require("../../src/lib/tableUtils");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  //Create size table
  await knex.schema.createTable(tableNames.size, (table) => {
    table.increments();
    table.string("name").notNullable();
    table.float("length");
    table.float("height");
    table.float("width");
    table.float("volume");
    references(table, tableNames.shape);
    addDefaultColumns(table);
  });

  // //Create item table
  // await knex.schema.createTable(tableNames.item, (table) => {
  //   table.increments();
  //   references(table, tableNames.user);
  //   table.string("name").notNullable();
  //   table.string("description", 2000);
  //   references(table, tableNames.size);
  //   references(table, tableNames.item_type);
  //   references(table, tableNames.manufacturer);
  //   table.boolean("sparks_joy");
  //   table.string("sku");
  // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.size);
};
