import { WorkflowError } from './error.js';

export function renderWorkflowError(res, error, active = '') {
  const status = error instanceof WorkflowError ? error.status : 500;
  const title =
    status === 403
      ? 'Доступ заборонено'
      : status === 404
        ? 'Запис не знайдено'
        : 'Дія неможлива';

  return res.status(status).render('error.njk', {
    title,
    message: error.message || 'Не вдалося виконати дію.',
    active
  });
}
