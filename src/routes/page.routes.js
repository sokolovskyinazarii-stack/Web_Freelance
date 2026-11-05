import { Router } from 'express';
import { dashboardPage } from '../controllers/dashboard.controller.js';
import { detailPage, listPage } from '../controllers/page.controller.js';
import { entities } from '../presenters/entities/index.js';

const pageRouter = Router();

pageRouter.get('/', dashboardPage);

for (const key of Object.keys(entities)) {
  pageRouter.get(`/${key}`, listPage(key));
  pageRouter.get(`/${key}/:id`, detailPage(key));
}

export default pageRouter;
