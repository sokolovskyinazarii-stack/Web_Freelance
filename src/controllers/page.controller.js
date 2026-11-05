import { prisma } from '../db/client.js';
import { resources } from '../api/resources.js';
import { entities } from '../presenters/entities/index.js';
import { buildDetail, buildList } from '../presenters/build.js';

function notFound(res, active) {
  return res.status(404).render('error.njk', {
    title: 'Запис не знайдено',
    message: 'Можливо, запис видалено або вказано неправильний ідентифікатор.',
    active
  });
}

export function listPage(key) {
  return async (req, res) => {
    const entity = entities[key];
    const resource = resources[key];
    const query = String(req.query.q || '').trim();
    const rows = await prisma[resource.model].findMany({
      include: resource.include,
      orderBy: resource.orderBy
    });
    const filtered = query
      ? rows.filter((row) => entity.search(row).toLowerCase().includes(query.toLowerCase()))
      : rows;

    res.render('list.njk', {
      title: entity.list.title,
      active: key,
      ...buildList(entity, filtered, query)
    });
  };
}

export function detailPage(key) {
  return async (req, res) => {
    const entity = entities[key];
    const resource = resources[key];
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return notFound(res, key);
    }

    const row = await prisma[resource.model].findUnique({
      where: { id },
      include: resource.include
    });

    if (!row) {
      return notFound(res, key);
    }

    return res.render('detail.njk', {
      active: key,
      ...buildDetail(entity, row)
    });
  };
}
