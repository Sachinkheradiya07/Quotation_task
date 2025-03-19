import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("database is a connected successfully ...");
  } catch (error) {
    console.error("error in a database connection", error);
  }
}

checkConnection();

export default sequelize;
