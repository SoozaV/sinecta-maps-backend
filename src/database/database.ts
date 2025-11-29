import { Sequelize } from "sequelize";
require("dotenv").config();

const DB_DATABASE = process.env.DB_DATABASE as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASS = process.env.DB_PASS as string;
const DB_HOST = process.env.DB_HOST as string;

export const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "postgres",
  port: 5432,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});
