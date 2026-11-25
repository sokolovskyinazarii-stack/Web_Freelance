import { prisma } from './client.js';

// Prisma createMany з явними id не оновлює послідовності PostgreSQL.
// Без цього перший новий запис отримає id=1 і впаде на унікальності.
const TABLES = [
  'Role',
  'User',
  'Freelancer',
  'Customer',
  'Category',
  'Project',
  'Order',
  'Status',
  'Courier',
  'Delivery',
  'Application',
  'Review'
];

export async function resetSequences() {
  for (const table of TABLES) {
    await prisma.$queryRawUnsafe(
      `SELECT setval(
         pg_get_serial_sequence('"${table}"', 'id'),
         COALESCE((SELECT MAX("id") FROM "${table}"), 1),
         true
       )`
    );
  }
}
