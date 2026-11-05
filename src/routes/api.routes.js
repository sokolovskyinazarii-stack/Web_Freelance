import { Router } from 'express';
import { index } from '../api/controllers/index.controller.js';
import { list, read } from '../api/controllers/crud-list.controller.js';
import { create, update } from '../api/controllers/crud-write.controller.js';
import { remove } from '../api/controllers/crud-delete.controller.js';
import { overview } from '../api/controllers/overview.controller.js';
import { related } from '../api/controllers/related.controller.js';

const apiRouter = Router();

apiRouter.get('/', index);
apiRouter.get('/overview', overview);
apiRouter.get('/:resource', list);
apiRouter.post('/:resource', create);
apiRouter.get('/:resource/:id/related', related);
apiRouter.get('/:resource/:id', read);
apiRouter.put('/:resource/:id', update);
apiRouter.patch('/:resource/:id', update);
apiRouter.delete('/:resource/:id', remove);

export default apiRouter;
