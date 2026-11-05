import crypto from 'node:crypto';
import { prisma } from '../db/client.js';
import { courierMatches } from '../auth/policy.js';
import { WorkflowError } from './error.js';
import { DELIVERY_STATUS, ORDER_STATUS } from './status.js';

async function generateTrackingNumber() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const number = `TRK-${crypto.randomInt(1000, 9999)}`;
    const existing = await prisma.delivery.findUnique({ where: { trackingNumber: number } });
    if (!existing) return number;
  }
  return `TRK-${Date.now().toString().slice(-6)}`;
}

export async function requestDelivery(order, customer, data) {
  if (order.customerId !== customer.id) throw new WorkflowError(403, 'Це не ваше замовлення');
  if (!order.deliveryNeeded) throw new WorkflowError(409, 'Доставка для цього замовлення не потрібна');
  if (order.delivery) throw new WorkflowError(409, 'Доставка вже створена');
  if (![ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.REVIEW, ORDER_STATUS.COMPLETED].includes(order.status.code)) {
    throw new WorkflowError(409, 'Доставку можна замовити після початку роботи');
  }

  return prisma.delivery.create({
    data: {
      trackingNumber: await generateTrackingNumber(),
      address: data.address,
      city: data.city || customer.city,
      status: DELIVERY_STATUS.OFFERED,
      cost: data.cost,
      estimatedAt: data.estimatedAt,
      orderId: order.id,
      courierId: null
    }
  });
}

export async function acceptDelivery(deliveryId, courier) {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: { order: { include: { customer: true, freelancer: true } } }
  });
  if (!delivery) throw new WorkflowError(404, 'Доставку не знайдено');
  if (delivery.status !== DELIVERY_STATUS.OFFERED || delivery.courierId !== null) {
    throw new WorkflowError(409, 'Доставку вже прийнято');
  }
  if (!courierMatches(courier, delivery)) {
    throw new WorkflowError(403, 'Доставка в іншому місті');
  }

  const updated = await prisma.delivery.updateMany({
    where: {
      id: deliveryId,
      courierId: null,
      status: DELIVERY_STATUS.OFFERED
    },
    data: {
      courierId: courier.id,
      status: DELIVERY_STATUS.PENDING
    }
  });

  if (updated.count === 0) throw new WorkflowError(409, 'Доставку вже прийнято');
}

export async function updateDeliveryStatus(deliveryId, status) {
  const allowed = [
    DELIVERY_STATUS.IN_TRANSIT,
    DELIVERY_STATUS.DELIVERED,
    DELIVERY_STATUS.FAILED
  ];
  if (!allowed.includes(status)) throw new WorkflowError(400, 'Некоректний статус доставки');

  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      status,
      deliveredAt: status === DELIVERY_STATUS.DELIVERED ? new Date() : null
    }
  });
}
