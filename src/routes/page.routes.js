import { Router } from 'express';
import { dashboardPage } from '../controllers/pages/dashboard.controller.js';
import { completeDelivery, detailPage, listPage } from '../controllers/pages/page.controller.js';
import {
  createRecord,
  deleteRecord,
  editForm,
  newForm,
  updateRecord
} from '../controllers/forms/form.controller.js';
import { entities } from '../presenters/entities/index.js';
import { requireAuth, requireRole } from '../auth/middleware/index.js';
import { ROLES } from '../auth/roles.js';

const pageRouter = Router();
const admin = requireRole(ROLES.ADMIN);

const listAccess = {
  freelancers: [],
  customers: [admin],
  projects: [],
  categories: [],
  orders: [requireAuth],
  statuses: [admin],
  deliveries: [requireAuth],
  couriers: [admin]
};

const detailAccess = {
  freelancers: [],
  customers: [requireAuth],
  projects: [],
  categories: [],
  orders: [requireAuth],
  statuses: [admin],
  deliveries: [requireAuth],
  couriers: [requireAuth]
};

pageRouter.get('/', dashboardPage);
pageRouter.post('/deliveries/:id/complete', requireRole(ROLES.COURIER), completeDelivery);

for (const key of Object.keys(entities)) {
  pageRouter.get(`/${key}/new`, admin, newForm(key));
  pageRouter.get(`/${key}/:id/edit`, admin, editForm(key));
  pageRouter.get(`/${key}`, ...listAccess[key], listPage(key));
  pageRouter.get(`/${key}/:id`, ...detailAccess[key], detailPage(key));
  pageRouter.post(`/${key}`, admin, createRecord(key));
  pageRouter.post(`/${key}/:id/delete`, admin, deleteRecord(key));
  pageRouter.post(`/${key}/:id`, admin, updateRecord(key));
}

export default pageRouter;
