import {
  createDeliveryReview,
  createOrderReview
} from '../workflow/review.service.js';
import { renderWorkflowError } from '../workflow/view.js';

export async function order(req, res) {
  try {
    await createOrderReview(
      Number(req.params.id),
      req.user,
      req.body.rating,
      String(req.body.comment || '').trim()
    );
    return res.redirect(`/orders/${req.params.id}?reviewed=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'orders');
  }
}

export async function delivery(req, res) {
  try {
    await createDeliveryReview(
      Number(req.params.id),
      req.user,
      req.body.rating,
      String(req.body.comment || '').trim()
    );
    return res.redirect(`/deliveries/${req.params.id}?reviewed=1`);
  } catch (error) {
    return renderWorkflowError(res, error, 'deliveries');
  }
}
