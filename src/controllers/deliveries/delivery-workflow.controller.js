import { prisma } from '../../db/client.js';
import { WorkflowError } from '../../workflow/error.js';
import {
  acceptDelivery,
  requestDelivery,
  updateDeliveryStatus
} from '../../workflow/deliveries/delivery.service.js';
import { renderWorkflowError } from '../../workflow/view.js';

export async function request(req, res) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { status: true, delivery: true, customer: true }
    });
    if (!order) throw new WorkflowError(404, 'Замовлення не знайдено');
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');

    const address = String(req.body.address || '').trim();
    const city = String(req.body.city || req.user.customer.city).trim();
    const cost = Number(req.body.cost);
    const estimated = new Date(req.body.estimatedAt);

    if (address.length < 5) throw new WorkflowError(422, 'Вкажіть коректну адресу');
    if (city.length < 2) throw new WorkflowError(422, 'Вкажіть місто');
    if (!Number.isFinite(cost) || cost < 0) throw new WorkflowError(422, 'Вкажіть вартість');
    if (Number.isNaN(estimated.getTime())) throw new WorkflowError(422, 'Вкажіть дату');

    const delivery = await requestDelivery(order, req.user.customer, {
      address,
      city,
      cost,
      estimatedAt: estimated
    });

    return res.redirect(`/deliveries/${delivery.id}?deliveryRequested=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function accept(req, res) {
  try {
    if (!req.user.courier) throw new WorkflowError(403, 'Профіль кур’єра не знайдено');
    await acceptDelivery(Number(req.params.id), req.user.courier);
    return res.redirect(`/deliveries/${req.params.id}?deliveryAccepted=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'deliveries');
  }
}

export async function status(req, res) {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: Number(req.params.id) },
      include: { order: true }
    });
    if (!delivery) throw new WorkflowError(404, 'Доставку не знайдено');
    if (!req.user.customer || req.user.customer.id !== delivery.order.customerId) {
      throw new WorkflowError(403, 'Це не ваша доставка');
    }
    if (!delivery.courierId) {
      throw new WorkflowError(409, 'Спочатку кур’єр має прийняти доставку');
    }

    await updateDeliveryStatus(delivery.id, String(req.body.status || ''));
    return res.redirect(`/deliveries/${delivery.id}?deliveryUpdated=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'deliveries');
  }
}
