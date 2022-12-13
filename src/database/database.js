"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const envalid_1 = require("envalid");
dotenv_1.default.config();
const env = (0, envalid_1.cleanEnv)(process.env, {
    DB_USER: (0, envalid_1.str)(),
    DB_PASS: (0, envalid_1.str)(),
    DB_DATABASE: (0, envalid_1.str)(),
    DB_HOST: (0, envalid_1.str)(),
});
const sequelize = new sequelize_1.Sequelize(env.DB_DATABASE, env.DB_USER, env.DB_PASS, {
    host: env.DB_HOST,
    dialect: "postgres",
    port: 5432,
});
exports.default = sequelize;
