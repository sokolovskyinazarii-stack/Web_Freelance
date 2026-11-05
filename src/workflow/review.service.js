import { prisma } from '../db/client.js';
import { WorkflowError } from './error.js';
import { DELIVERY_STATUS, ORDER_STATUS } from './status.js';

function normalizeRating(rating) {
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new WorkflowError(422, 'Оцінка має бути від 1 до 5');
  }
  return value;
}

async function recalcFreelancer(freelancerId) {
  const reviews = await prisma.review.findMany({
    where: { order: { freelancerId } },
    select: { rating: true }
  });
  const rating = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;

  await prisma.freelancer.update({
    where: { id: freelancerId },
    data: { rating: Math.round(rating * 10) / 10 }
  });
}

async function recalcCourier(courierId) {
  const reviews = await prisma.review.findMany({
    where: { delivery: { courierId } },
    select: { rating: true }
  });
  const rating = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;

  await prisma.courier.update({
    where: { id: courierId },
    data: { rating: Math.round(rating * 10) / 10 }
  });
}

export async function createOrderReview(orderId, user, rating, comment) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { status: true, freelancer: true }
  });
  if (!order) throw new WorkflowError(404, 'Замовлення не знайдено');
  if (!user.customer || user.customer.id !== order.customerId) {
    throw new WorkflowError(403, 'Це не ваше замовлення');
  }
  if (order.status.code !== ORDER_STATUS.COMPLETED) {
    throw new WorkflowError(409, 'Відгук можна залишити після завершення роботи');
  }

  const existing = await prisma.review.findFirst({
    where: { orderId, authorId: user.id }
  });
  if (existing) throw new WorkflowError(409, 'Ви вже залишили відгук');

  await prisma.review.create({
    data: {
      orderId,
      authorId: user.id,
      rating: normalizeRating(rating),
      comment: comment || null
    }
  });

  if (order.freelancerId) await recalcFreelancer(order.freelancerId);
}

export async function createDeliveryReview(deliveryId, user, rating, comment) {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: { order: true }
  });
  if (!delivery) throw new WorkflowError(404, 'Доставку не знайдено');
  if (!user.customer || user.customer.id !== delivery.order.customerId) {
    throw new WorkflowError(403, 'Це не ваша доставка');
  }
  if (delivery.status !== DELIVERY_STATUS.DELIVERED) {
    throw new WorkflowError(409, 'Відгук можна залишити після доставки');
  }

  const existing = await prisma.review.findFirst({
    where: { deliveryId, authorId: user.id }
  });
  if (existing) throw new WorkflowError(409, 'Ви вже залишили відгук');

  await prisma.review.create({
    data: {
      deliveryId,
      authorId: user.id,
      rating: normalizeRating(rating),
      comment: comment || null
    }
  });

  if (delivery.courierId) await recalcCourier(delivery.courierId);
}
