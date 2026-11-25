import { prisma } from './client.js';

export async function bootstrapDatabase() {
  await prisma.$connect();
}
