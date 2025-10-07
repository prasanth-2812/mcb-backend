import { Sequelize } from 'sequelize';

// MySQL database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '2812',
  database: process.env.DB_NAME || 'mcb_job_app',
  dialect: 'mysql' as const,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // MySQL specific options
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timezone: '+00:00'
  }
};

export const sequelize = new Sequelize(dbConfig);
