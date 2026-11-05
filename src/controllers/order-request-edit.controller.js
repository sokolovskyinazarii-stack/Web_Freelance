import { prisma } from '../db/client.js';
import { WorkflowError } from '../workflow/error.js';
import { updateClientOrder } from '../workflow/order-request.service.js';
import { renderRequestForm, validateRequest } from '../workflow/order-request-form.js';
import { renderWorkflowError } from '../workflow/view.js';

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

async function loadOrder(req) {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { status: true }
  });
  if (!order) throw new WorkflowError(404, 'Замовлення не знайдено');
  if (!req.user.customer || req.user.customer.id !== order.customerId) {
    throw new WorkflowError(403, 'Це не ваше замовлення');
  }
  if (order.status.code !== 'cancelled') {
    throw new WorkflowError(409, 'Редагувати можна лише відхилене замовлення');
  }
  return order;
}

function valuesFrom(order) {
  return {
    title: order.title || '',
    description: order.description || '',
    categoryId: order.categoryId ? String(order.categoryId) : '',
    amount: String(order.amount),
    currency: order.currency,
    deadline: order.deadline ? order.deadline.toISOString().slice(0, 10) : '',
    deliveryNeeded: order.deliveryNeeded ? 'true' : 'false'
  };
}

function editOptions(order) {
  return {
    title: 'Редагувати замовлення',
    action: `/orders/${order.id}/edit-request`,
    cancelHref: `/orders/${order.id}`,
    submitLabel: 'Надіслати повторно'
  };
}

export async function show(req, res) {
  try {
    const order = await loadOrder(req);
    const categories = await getCategories();
    return renderRequestForm(res, {
      categories,
      values: valuesFrom(order),
      errors: {},
      ...editOptions(order)
    });
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function update(req, res) {
  try {
    const order = await loadOrder(req);
    const categories = await getCategories();
    const { errors, values, data } = validateRequest(req.body, categories);

    if (Object.keys(errors).length) {
      return renderRequestForm(res, {
        categories,
        values,
        errors,
        status: 422,
        ...editOptions(order)
      });
    }

    await updateClientOrder(order.id, req.user.customer.id, data);
    return res.redirect(`/orders/${order.id}?resubmitted=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}
