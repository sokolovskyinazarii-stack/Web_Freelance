import { prisma } from '../db/client.js';
import { WorkflowError } from './error.js';
import { ORDER_STATUS } from './status.js';

async function statusId(code) {
  const status = await prisma.status.findUnique({ where: { code } });
  if (!status) throw new WorkflowError(500, 'Статус не знайдено');
  return status.id;
}

async function orderWithRelations(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { status: true, applications: true }
  });
  if (!order) throw new WorkflowError(404, 'Замовлення не знайдено');
  return order;
}

export async function cancelFreelancer(orderId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (![ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.REVIEW].includes(order.status.code)) {
    throw new WorkflowError(409, 'Скасувати фрілансера зараз неможливо');
  }

  await prisma.$transaction([
    prisma.application.updateMany({
      where: { orderId, freelancerId: order.freelancerId, status: 'accepted' },
      data: { status: 'rejected' }
    }),
    prisma.order.update({
      where: { id: orderId },
      data: {
        freelancerId: null,
        statusId: await statusId(ORDER_STATUS.OPEN)
      }
    })
  ]);
}

export async function submitWork(orderId, freelancerId) {
  const order = await orderWithRelations(orderId);
  if (order.freelancerId !== freelancerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (order.status.code !== ORDER_STATUS.IN_PROGRESS) {
    throw new WorkflowError(409, 'Завершити можна лише замовлення в роботі');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { statusId: await statusId(ORDER_STATUS.REVIEW) }
  });
}

export async function acceptWork(orderId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (order.status.code !== ORDER_STATUS.REVIEW) {
    throw new WorkflowError(409, 'Прийняти можна лише роботу на перевірці');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { statusId: await statusId(ORDER_STATUS.COMPLETED) }
  });
}

export async function returnWork(orderId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (order.status.code !== ORDER_STATUS.REVIEW) {
    throw new WorkflowError(409, 'Повернути можна лише роботу на перевірці');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { statusId: await statusId(ORDER_STATUS.IN_PROGRESS) }
  });
}

export async function cancelOrder(orderId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (![ORDER_STATUS.MODERATION, ORDER_STATUS.OPEN].includes(order.status.code)) {
    throw new WorkflowError(409, 'Скасувати можна лише замовлення до початку роботи');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { statusId: await statusId(ORDER_STATUS.CANCELLED) }
  });
}
