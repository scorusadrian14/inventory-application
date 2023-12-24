const tableNames = require("../../src/constants/tableNames");
/**
 * @param {import('knex')} knex
 */

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime("deleted_at");
}
function createNameTable(knex, table_name) {
  return knex.schema.createTable(table_name, (table) => {
    table.increments().notNullable();
    table.string("name", 254).notNullable().unique();
    addDefaultColumns(table);
  });
}

function references(table, tableName) {
  table
    .integer(`${tableName}_id`)
    .unsigned()
    .references("id")
    .inTable(tableName)
    .onDelete("cascade");
}

function url(table, columnName) {
  table.string(columnName, 2000);
}

function email(table, columnName) {
  return table.string(columnName, 254);
}

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
    //Create state table
    createNameTable(knex, tableNames.state),
    //Create country table
    createNameTable(knex, tableNames.country),
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
    references(table, tableNames.country);
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

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.manufacturer,
      tableNames.address,
      tableNames.user,
      tableNames.item_type,
      tableNames.country,
      tableNames.state,
      tableNames.shape,
      tableNames.location,
    ].map((tableName) => knex.schema.dropTable(tableName))
  );
};
