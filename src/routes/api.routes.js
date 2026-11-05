import { Router } from 'express';
import { list, read } from '../api/controller.js';
import { overview } from '../api/overview.js';

const apiRouter = Router();

apiRouter.get('/overview', overview);
apiRouter.get('/:resource', list);
apiRouter.get('/:resource/:id', read);

export default apiRouter;
