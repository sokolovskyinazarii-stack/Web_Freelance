import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './client.js';
import { seed } from './seed.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function pushSchema() {
  try {
    execSync('npx prisma db push --skip-generate', { cwd: root, stdio: 'pipe' });
  } catch (error) {
    const details = error.stderr?.toString().trim() || error.message;
    throw new Error(`Не вдалося створити структуру бази даних: ${details}`);
  }
}

export async function bootstrapDatabase() {
  pushSchema();
  await prisma.$connect();
  const total = await prisma.status.count();

  if (total === 0) {
    await seed();
  }
}
