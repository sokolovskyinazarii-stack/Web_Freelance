import crypto from 'node:crypto';
import { prisma } from '../db/client.js';

async function uniqueNumber(model, field, prefix) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const number = `${prefix}-${crypto.randomInt(1000, 9999)}`;
    const existing = await prisma[model].findUnique({ where: { [field]: number } });
    if (!existing) return number;
  }

  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

export function generateOrderNumber() {
  return uniqueNumber('order', 'orderNumber', 'ORD');
}

export function generateTrackingNumber() {
  return uniqueNumber('delivery', 'trackingNumber', 'TRK');
}
