import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize, testConnection } from './models';
import { runSeed } from './utils/seed';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function start() {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database schema
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized');
    
    // Load seed data in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      await runSeed();
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 API server listening on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: MySQL`);
    });
  } catch (err) {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  }
}

start();
