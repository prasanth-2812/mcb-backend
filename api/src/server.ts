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
    app.listen(PORT, () => {
      console.log(`API listening on :${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
