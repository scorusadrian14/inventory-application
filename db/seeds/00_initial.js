/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const orderedTableNames = require("../../src/constants/orderedTableNames");
const tableNames = require("../../src/constants/tableNames");
const countries = require("../../src/constants/countries");

exports.seed = async (knex) => {
  await orderedTableNames.reduce(async (promise, table_name) => {
    await promise;
    console.log("clearing", table_name);
    return knex(table_name).del();
  }, Promise.resolve());

  const password = crypto.randomBytes(15).toString("hex");
  const user = {
    email: "adrianscorus14@gmail.com",
    name: "Adrian",
    password: await bcrypt.hash(password, 12),
  };

  const [createdUser] = await knex(tableNames.user).insert(user).returning("*");
  console.log(
    "user created:",
    {
      password,
    },
    createdUser
  );

  await knex(tableNames.country).insert(countries);
  await knex(tableNames.state).insert([{ name: "CO" }]);
};
