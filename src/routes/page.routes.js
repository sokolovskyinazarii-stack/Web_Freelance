import { Router } from 'express';
import { dashboardPage } from '../controllers/dashboard.controller.js';
import { detailPage, listPage } from '../controllers/page.controller.js';
import {
  createRecord,
  deleteRecord,
  editForm,
  newForm,
  updateRecord
} from '../controllers/form.controller.js';
import { entities } from '../presenters/entities/index.js';

const pageRouter = Router();

pageRouter.get('/', dashboardPage);

for (const key of Object.keys(entities)) {
  pageRouter.get(`/${key}`, listPage(key));
  pageRouter.get(`/${key}/new`, newForm(key));
  pageRouter.get(`/${key}/:id/edit`, editForm(key));
  pageRouter.get(`/${key}/:id`, detailPage(key));
  pageRouter.post(`/${key}`, createRecord(key));
  pageRouter.post(`/${key}/:id/delete`, deleteRecord(key));
  pageRouter.post(`/${key}/:id`, updateRecord(key));
}

export default pageRouter;
