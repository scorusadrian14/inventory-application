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

  //Create item table
  await knex.schema.createTable(tableNames.item, (table) => {
    table.increments();
    references(table, tableNames.user);
    table.string("name").notNullable();
    table.string("description", 2000);
    references(table, tableNames.size);
    references(table, tableNames.item_type);
    references(table, tableNames.company);
    table.boolean("sparks_joy").defaultTo(true);
    table.string("sku");
    addDefaultColumns(table);
  });

  //create item_info table
  await knex.schema.createTable(tableNames.item_info, (table) => {
    table.increments();
    references(table, tableNames.item);
    references(table, tableNames.user);
    table.datetime("purchase_date").notNullable();
    table.dateTime("expiration_date");
    references(table, tableNames.company, false, "retailer");
    table.float("price").notNullable().defaultTo(0);
    table.float("msrp").notNullable().defaultTo(0);
    table.dateTime("last_used");
    references(table, tableNames.inventory_location);

    addDefaultColumns(table);
  });

  //create item_image table
  await knex.schema.createTable(tableNames.item_image, (table) => {
    table.increments();
    url(table, "image_url");
    references(table, tableNames.item);
    addDefaultColumns(table);
  });

  //Create related_item table
  await knex.schema.createTable(tableNames.related_item, (table) => {
    table.increments();
    references(table, tableNames.item);
    references(table, tableNames.item, false, "related_item");
    addDefaultColumns(table);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.size,
      tableNames.item,
      tableNames.item_info,
      tableNames.item_image,
      tableNames.related_item,
    ]
      .reverse()
      .map((name) => knex.schema.dropTableIfExists(name))
  );
};
