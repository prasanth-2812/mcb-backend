import { Sequelize } from 'sequelize';
import path from 'path';

// Use SQLite for testing/development
const dbPath = path.join(process.cwd(), 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});
