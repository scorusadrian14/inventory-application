const tableNames = require("../../src/constants/tableNames");
const {
  addDefaultColumns,
  createNameTable,
  references,
  url,
  email,
} = require("../../src/lib/tableUtils");
/**
 * @param {import('knex')} knex
 */

exports.up = async (knex) => {
  await Promise.all([
    //Create user table
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      email(table, "email").notNullable().unique();
      table.string("name", 254).notNullable();
      table.string("password").notNullable();
      table.datetime("last_login");
      addDefaultColumns(table);
    }),
    //Create item_type table
    createNameTable(knex, tableNames.item_type),
    //Create country table
    knex.schema.createTable(tableNames.country, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable().unique();
      table.string("code").unique();
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.state, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable().unique();
      table.string("code").unique();
      references(table, tableNames.country);
      addDefaultColumns(table);
    }),
    //Create shape table
    createNameTable(knex, tableNames.shape),
    //Create location table
    knex.schema.createTable(tableNames.location, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable().unique();
      table.string("description", 1000);
      url(table, "image_url");
      addDefaultColumns(table);
    }),
  ]);
  //Create address table
  await knex.schema.createTable(tableNames.address, (table) => {
    table.increments().notNullable();
    table.string("street_address_1", 100).notNullable();
    table.string("street_address_2", 100);
    table.string("city", 100).notNullable();
    table.string("zip_code", 15).notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
    references(table, tableNames.state);
    addDefaultColumns(table);
  });

  //Create manufacturer table
  await knex.schema.createTable(tableNames.manufacturer, (table) => {
    table.increments().notNullable();
    table.string("name").notNullable();
    url(table, "logo_url");
    table.string("type");
    table.string("description", 1000);
    email(table, "email");
    url(table, "website_url");
    references(table, tableNames.address);
    addDefaultColumns(table);
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.manufacturer,
      tableNames.address,
      tableNames.user,
      tableNames.item_type,
      tableNames.state,
      tableNames.country,
      tableNames.shape,
      tableNames.location,
    ].map((tableName) => knex.schema.dropTable(tableName))
  );
};
