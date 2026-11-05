import 'dotenv/config';
import app from './app.js';
import { bootstrapDatabase } from './db/bootstrap.js';
import { prisma } from './db/client.js';

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  try {
    await bootstrapDatabase();

    app.listen(PORT, () => {
      console.log('----------------------------------------------------');
      console.log(' FreelanceHub запущено');
      console.log(` Сайт: http://localhost:${PORT}`);
      console.log(` База даних: ${process.env.DATABASE_URL || 'file:./freelance.db'}`);
      console.log('----------------------------------------------------');
    });
  } catch (error) {
    console.error('Помилка запуску:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

start();
