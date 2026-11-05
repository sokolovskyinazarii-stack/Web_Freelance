import { publishOrder, rejectOrder } from '../workflow/order.service.js';
import { renderWorkflowError } from '../workflow/view.js';

export async function publish(req, res) {
  try {
    await publishOrder(Number(req.params.id));
    return res.redirect(`/orders/${req.params.id}?published=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function reject(req, res) {
  try {
    await rejectOrder(Number(req.params.id), req.body.reason);
    return res.redirect(`/orders/${req.params.id}?rejected=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}
