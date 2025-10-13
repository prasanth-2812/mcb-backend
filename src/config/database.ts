import { Sequelize } from 'sequelize';

// MySQL Configuration - Production Ready
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// MySQL Configuration for all environments
const mysqlConfig = {
  dialect: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'mcb',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  logging: isDevelopment ? console.log : false,
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    // SSL configuration for production
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: isProduction ? 10 : 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true,
    underscored: false
  }
};

// Initialize Sequelize with MySQL only
export const sequelize = new Sequelize(mysqlConfig);

// Database connection test
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Database connected successfully`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'mcb'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}`);
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error);
    throw error;
  }
};
