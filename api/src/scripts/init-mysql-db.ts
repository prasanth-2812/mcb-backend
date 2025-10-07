import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const initDatabase = async () => {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '2812',
  });

  try {
    console.log('🔌 Connecting to MySQL server...');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'mcb_job_app';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created/verified successfully`);
    
    console.log('🎉 MySQL database initialization completed successfully!');
    console.log('📝 You can now start the application with: npm run dev:mysql');
    
  } catch (error) {
    console.error('❌ Error initializing MySQL database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Run the initialization
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database initialization failed:', error);
      process.exit(1);
    });
}

export default initDatabase;
