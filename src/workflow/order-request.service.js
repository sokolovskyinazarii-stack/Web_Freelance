import crypto from 'node:crypto';
import { prisma } from '../db/client.js';
import { WorkflowError } from './error.js';
import { ORDER_STATUS } from './status.js';

async function generateOrderNumber() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const number = `ORD-${crypto.randomInt(1000, 9999)}`;
    const existing = await prisma.order.findUnique({ where: { orderNumber: number } });
    if (!existing) return number;
  }
  return `ORD-${Date.now().toString().slice(-6)}`;
}

export async function createClientOrder(customerId, data) {
  const status = await prisma.status.findUnique({ where: { code: ORDER_STATUS.MODERATION } });
  if (!status) throw new WorkflowError(500, 'Статус не знайдено');

  return prisma.order.create({
    data: {
      orderNumber: await generateOrderNumber(),
      title: data.title,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      deadline: data.deadline,
      deliveryNeeded: data.deliveryNeeded,
      categoryId: data.categoryId,
      customerId,
      statusId: status.id
    }
  });
}

export async function updateClientOrder(orderId, customerId, data) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { status: true }
  });
  if (!order) throw new WorkflowError(404, 'Замовлення не знайдено');
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (order.status.code !== ORDER_STATUS.CANCELLED) {
    throw new WorkflowError(409, 'Редагувати можна лише відхилене замовлення');
  }

  const status = await prisma.status.findUnique({ where: { code: ORDER_STATUS.MODERATION } });
  if (!status) throw new WorkflowError(500, 'Статус не знайдено');

  return prisma.order.update({
    where: { id: orderId },
    data: {
      title: data.title,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      deadline: data.deadline,
      deliveryNeeded: data.deliveryNeeded,
      categoryId: data.categoryId,
      statusId: status.id,
      rejectionReason: null
    }
  });
}
