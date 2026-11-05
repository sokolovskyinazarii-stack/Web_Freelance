import { forms } from '../../forms/entities/index.js';
import { resources } from '../resources.js';

export function index(req, res) {
  res.json({
    name: 'FreelanceHub API',
    version: '1.0',
    resources: Object.keys(resources).map((key) => ({
      resource: key,
      label: forms[key].label,
      endpoints: {
        list: `GET /api/${key}`,
        read: `GET /api/${key}/:id`,
        create: `POST /api/${key}`,
        update: `PUT/PATCH /api/${key}/:id`,
        delete: `DELETE /api/${key}/:id`
      }
    }))
  });
}
