import { entities } from './entities/index.js';
import { getCollection, getOverview, getRecord } from './api.js';
import { setActive, setTitle } from './shell.js';
import { renderDashboard } from './views/dashboard.js';
import { renderDetail } from './views/detail.js';
import { renderList } from './views/list.js';
import { renderError, renderNotFound, renderSkeleton } from './views/states.js';

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [resource, id] = raw.split('/');
  return { resource: resource || 'overview', id };
}

export async function route() {
  const { resource, id } = parseHash();
  const view = document.getElementById('view');
  const entity = entities[resource];

  if (resource !== 'overview' && !entity) {
    setActive('');
    setTitle('Сторінку не знайдено');
    renderNotFound(view);
    return;
  }

  setActive(resource);
  renderSkeleton(view);

  try {
    if (resource === 'overview') {
      setTitle('Огляд');
      renderDashboard(view, await getOverview());
      return;
    }

    if (id) {
      setTitle(entity.singular);
      renderDetail(view, entity, await getRecord(resource, id));
      return;
    }

    setTitle(entity.label);
    renderList(view, entity, await getCollection(resource));
  } catch (error) {
    setTitle('Помилка');
    renderError(view, error);
  }
}
