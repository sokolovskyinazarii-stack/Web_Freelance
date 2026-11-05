import { prisma } from '../../db/client.js';
import { WorkflowError } from '../../workflow/error.js';
import { createClientOrder } from '../../workflow/orders/order-request.service.js';
import { renderRequestForm, validateRequest } from '../../workflow/orders/order-request-form.js';
import { renderWorkflowError } from '../../workflow/view.js';

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function show(req, res) {
  const categories = await getCategories();
  return renderRequestForm(res, { categories, values: {}, errors: {} });
}

export async function create(req, res) {
  const categories = await getCategories();
  const { errors, values, data } = validateRequest(req.body, categories);

  if (Object.keys(errors).length) {
    return renderRequestForm(res, { categories, values, errors, status: 422 });
  }

  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    const order = await createClientOrder(req.user.customer.id, data);
    return res.redirect(`/orders/${order.id}?created=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}
