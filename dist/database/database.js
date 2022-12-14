"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv").config();
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
exports.sequelize = new sequelize_1.Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "postgres",
    port: 5432,
});
//# sourceMappingURL=database.js.map