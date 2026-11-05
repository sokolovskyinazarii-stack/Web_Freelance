import { WorkflowError } from '../../workflow/error.js';
import {
  acceptWork,
  cancelOrder,
  returnWork,
  submitWork
} from '../../workflow/orders/order-work.service.js';
import { renderWorkflowError } from '../../workflow/view.js';

export async function submit(req, res) {
  try {
    if (!req.user.freelancer) throw new WorkflowError(403, 'Профіль фрілансера не знайдено');
    await submitWork(Number(req.params.id), req.user.freelancer.id);
    return res.redirect(`/orders/${req.params.id}?submitted=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function complete(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await acceptWork(Number(req.params.id), req.user.customer.id);
    return res.redirect(`/orders/${req.params.id}?workAccepted=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function rework(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await returnWork(Number(req.params.id), req.user.customer.id);
    return res.redirect(`/orders/${req.params.id}?rework=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function cancel(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await cancelOrder(Number(req.params.id), req.user.customer.id);
    return res.redirect(`/orders/${req.params.id}?cancelled=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}
