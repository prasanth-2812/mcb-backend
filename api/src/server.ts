import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize } from './models';
import { runSeed } from './utils/seed';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    if (process.env.NODE_ENV !== 'production') {
      await runSeed();
    }
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API listening on 0.0.0.0:${PORT}`);
      console.log(`Local access: http://localhost:${PORT}`);
      console.log(`Network access: http://10.115.43.116:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
