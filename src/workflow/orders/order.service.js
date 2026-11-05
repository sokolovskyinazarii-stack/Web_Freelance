import { prisma } from '../../db/client.js';
import { WorkflowError } from '../error.js';
import { ORDER_STATUS } from '../status.js';

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

export async function publishOrder(orderId) {
  const order = await orderWithRelations(orderId);
  if (order.status.code !== ORDER_STATUS.MODERATION) {
    throw new WorkflowError(409, 'Опублікувати можна лише замовлення на модерації');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { statusId: await statusId(ORDER_STATUS.OPEN), rejectionReason: null }
  });
}

export async function rejectOrder(orderId, reason) {
  const text = String(reason || '').trim();
  if (text.length < 5) throw new WorkflowError(422, 'Вкажіть причину відхилення');

  const order = await orderWithRelations(orderId);
  if (order.status.code !== ORDER_STATUS.MODERATION) {
    throw new WorkflowError(409, 'Відхилити можна лише замовлення на модерації');
  }
  return prisma.order.update({
    where: { id: orderId },
    data: {
      statusId: await statusId(ORDER_STATUS.CANCELLED),
      rejectionReason: text
    }
  });
}

export async function applyToOrder(orderId, freelancerId, data) {
  const order = await orderWithRelations(orderId);
  if (order.status.code !== ORDER_STATUS.OPEN) {
    throw new WorkflowError(409, 'Подати заявку можна лише на опубліковане замовлення');
  }

  const existing = await prisma.application.findFirst({
    where: { orderId, freelancerId }
  });

  if (existing) {
    if (existing.status !== 'rejected') {
      throw new WorkflowError(409, 'Ви вже подали заявку на це замовлення');
    }
    return prisma.application.update({
      where: { id: existing.id },
      data: { message: data.message, proposedAmount: data.proposedAmount, status: 'pending' }
    });
  }

  try {
    return await prisma.application.create({
      data: {
        orderId,
        freelancerId,
        message: data.message,
        proposedAmount: data.proposedAmount
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new WorkflowError(409, 'Ви вже подали заявку на це замовлення');
    }
    throw error;
  }
}

export async function acceptApplication(orderId, applicationId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (order.status.code !== ORDER_STATUS.OPEN) {
    throw new WorkflowError(409, 'Обрати фрілансера можна лише для відкритого замовлення');
  }

  const application = order.applications.find(
    (item) => item.id === applicationId && item.status === 'pending'
  );
  if (!application) throw new WorkflowError(404, 'Заявку не знайдено');

  await prisma.$transaction([
    prisma.application.update({
      where: { id: application.id },
      data: { status: 'accepted' }
    }),
    prisma.application.updateMany({
      where: { orderId, id: { not: application.id }, status: 'pending' },
      data: { status: 'rejected' }
    }),
    prisma.order.update({
      where: { id: orderId },
      data: {
        freelancerId: application.freelancerId,
        statusId: await statusId(ORDER_STATUS.IN_PROGRESS)
      }
    })
  ]);
}

export async function rejectApplication(orderId, applicationId, customerId) {
  const order = await orderWithRelations(orderId);
  if (order.customerId !== customerId) throw new WorkflowError(403, 'Це не ваше замовлення');

  const application = order.applications.find(
    (item) => item.id === applicationId && item.status === 'pending'
  );
  if (!application) throw new WorkflowError(404, 'Заявку не знайдено');

  await prisma.application.update({
    where: { id: application.id },
    data: { status: 'rejected' }
  });
}
