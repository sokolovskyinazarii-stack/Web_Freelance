import { WorkflowError } from '../workflow/error.js';
import {
  acceptApplication,
  applyToOrder,
  rejectApplication
} from '../workflow/order.service.js';
import { cancelFreelancer } from '../workflow/order-work.service.js';
import { renderWorkflowError } from '../workflow/view.js';

export async function apply(req, res) {
  try {
    if (!req.user.freelancer) throw new WorkflowError(403, 'Профіль фрілансера не знайдено');
    const rawAmount = String(req.body.proposedAmount || '').trim();
    const proposedAmount = rawAmount ? Number(rawAmount) : null;

    if (proposedAmount !== null && (!Number.isFinite(proposedAmount) || proposedAmount < 0)) {
      throw new WorkflowError(422, 'Вкажіть коректну ціну');
    }

    await applyToOrder(Number(req.params.id), req.user.freelancer.id, {
      message: String(req.body.message || '').trim() || null,
      proposedAmount
    });
    return res.redirect(`/orders/${req.params.id}?applied=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function accept(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await acceptApplication(
      Number(req.params.id),
      Number(req.params.applicationId),
      req.user.customer.id
    );
    return res.redirect(`/orders/${req.params.id}?accepted=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function reject(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await rejectApplication(
      Number(req.params.id),
      Number(req.params.applicationId),
      req.user.customer.id
    );
    return res.redirect(`/orders/${req.params.id}?applicationRejected=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function cancelFreelancerHandler(req, res) {
  try {
    if (!req.user.customer) throw new WorkflowError(403, 'Профіль замовника не знайдено');
    await cancelFreelancer(Number(req.params.id), req.user.customer.id);
    return res.redirect(`/orders/${req.params.id}?freelancerCancelled=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}
