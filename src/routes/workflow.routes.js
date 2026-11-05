import { Router } from 'express';
import { requireRole } from '../auth/middleware/index.js';
import { ROLES } from '../auth/roles.js';
import { apply, accept, reject, cancelFreelancerHandler } from '../controllers/orders/order-application.controller.js';
import { publish, reject as rejectOrder } from '../controllers/orders/order-moderation.controller.js';
import { show, create } from '../controllers/orders/order-request.controller.js';
import { show as showEdit, update as updateEdit } from '../controllers/orders/order-request-edit.controller.js';
import { submit, complete, rework, cancel } from '../controllers/orders/order-work.controller.js';
import { accept as acceptDelivery, request as requestDelivery, status as deliveryStatus } from '../controllers/deliveries/delivery-workflow.controller.js';
import { order as orderReview, delivery as deliveryReview } from '../controllers/reviews/review.controller.js';

const workflowRouter = Router();
const client = requireRole(ROLES.CLIENT);
const freelancer = requireRole(ROLES.FREELANCER);
const courier = requireRole(ROLES.COURIER);
const admin = requireRole(ROLES.ADMIN);

workflowRouter.get('/orders/request', client, show);
workflowRouter.post('/orders/request', client, create);
workflowRouter.get('/orders/:id/edit-request', client, showEdit);
workflowRouter.post('/orders/:id/edit-request', client, updateEdit);

workflowRouter.post('/orders/:id/publish', admin, publish);
workflowRouter.post('/orders/:id/reject', admin, rejectOrder);

workflowRouter.post('/orders/:id/apply', freelancer, apply);
workflowRouter.post('/orders/:id/applications/:applicationId/accept', client, accept);
workflowRouter.post('/orders/:id/applications/:applicationId/reject', client, reject);
workflowRouter.post('/orders/:id/freelancer/cancel', client, cancelFreelancerHandler);

workflowRouter.post('/orders/:id/submit', freelancer, submit);
workflowRouter.post('/orders/:id/complete', client, complete);
workflowRouter.post('/orders/:id/rework', client, rework);
workflowRouter.post('/orders/:id/cancel', client, cancel);

workflowRouter.post('/orders/:id/delivery', client, requestDelivery);
workflowRouter.post('/deliveries/:id/accept', courier, acceptDelivery);
workflowRouter.post('/deliveries/:id/status', client, deliveryStatus);

workflowRouter.post('/orders/:id/review', client, orderReview);
workflowRouter.post('/deliveries/:id/review', client, deliveryReview);

export default workflowRouter;
