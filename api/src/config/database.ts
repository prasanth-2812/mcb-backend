import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'mcb';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASSWORD || 'secret';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || 3306);

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
