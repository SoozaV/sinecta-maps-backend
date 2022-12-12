import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { cleanEnv, str } from "envalid";
 
dotenv.config();

const env = cleanEnv(process.env, {
  DB_USER: str(),
  DB_PASS: str(), 
  DB_DATABASE: str(),
  DB_HOST: str(),
});

const sequelize = new Sequelize(env.DB_DATABASE, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  dialect: "postgres",
  port: 5432,
});
export default sequelize;
