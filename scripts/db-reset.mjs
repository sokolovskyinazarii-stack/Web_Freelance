#!/usr/bin/env node
/**
 * Повне перестворення PostgreSQL-бази FreelanceHub.
 *
 *   npm run db:reset
 *
 * Використовує DATABASE_URL (runtime, pooled) і DATABASE_URL_UNPOOLED
 * (пряме підключення для prisma db push), які задані в .env.
 */
import 'dotenv/config';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '../src/db/client.js';
import { seed } from '../src/db/seed.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  console.log('[db] prisma db push --force-reset');
  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  });

  await seed();

  const counts = await Promise.all([
    prisma.role.count(),
    prisma.user.count(),
    prisma.freelancer.count(),
    prisma.customer.count(),
    prisma.category.count(),
    prisma.project.count(),
    prisma.order.count(),
    prisma.status.count(),
    prisma.courier.count(),
    prisma.delivery.count()
  ]);

  const labels = ['ролі', 'користувачі', 'фрілансери', 'замовники', 'категорії', 'проєкти', 'замовлення', 'статуси', 'кур’єри', 'доставки'];
  console.log('\nГотово:');
  labels.forEach((label, index) => console.log(`  ${label.padEnd(12)} ${counts[index]}`));
} catch (error) {
  console.error('\nПомилка:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
