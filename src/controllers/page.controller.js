import { prisma } from '../db/client.js';
import { resources } from '../api/resources.js';
import { entities } from '../presenters/entities/index.js';
import { buildDetail, buildList } from '../presenters/build.js';
import { buildDeliveryWorkflow } from '../presenters/delivery-workflow.js';
import { buildOrderWorkflow } from '../presenters/order-workflow.js';
import { flashMessage } from '../lib/flash.js';
import { getRole } from '../auth/middleware.js';
import {
  canCompleteDelivery,
  canManage as canManageRole,
  canViewList,
  canViewRecord,
  scopeWhere
} from '../auth/policy.js';
import { ROLES } from '../auth/roles.js';

function notFound(res, active) {
  return res.status(404).render('error.njk', {
    title: 'Запис не знайдено',
    message: 'Можливо, запис видалено або вказано неправильний ідентифікатор.',
    active
  });
}

function forbidden(res) {
  return res.status(403).render('error.njk', {
    title: 'Доступ заборонено',
    message: 'У вас немає прав для перегляду цього запису.',
    active: ''
  });
}

export function listPage(key) {
  return async (req, res) => {
    const role = getRole(req);
    const entity = entities[key];
    const resource = resources[key];

    if (!canViewList(role, key)) return forbidden(res);

    const where = scopeWhere(role, key, req.user);
    if (!where) return forbidden(res);

    const query = String(req.query.q || '').trim();
    const rows = await prisma[resource.model].findMany({
      where,
      include: resource.include,
      orderBy: resource.orderBy
    });
    const filtered = query
      ? rows.filter((row) => entity.search(row).toLowerCase().includes(query.toLowerCase()))
      : rows;
    const manage = canManageRole(role);

    res.render('list.njk', {
      title: entity.list.title,
      active: key,
      canManage: manage,
      canCreateOrder: role === ROLES.CLIENT && key === 'orders',
      flash: flashMessage(req.query),
      ...buildList(entity, filtered, query, manage)
    });
  };
}

export function detailPage(key) {
  return async (req, res) => {
    const role = getRole(req);
    const entity = entities[key];
    const resource = resources[key];
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) return notFound(res, key);

    const row = await prisma[resource.model].findUnique({
      where: { id },
      include: resource.include
    });

    if (!row) return notFound(res, key);
    if (!canViewRecord(role, key, row, req.user)) return forbidden(res);

    const manage = canManageRole(role);
    const detail = buildDetail(entity, row);
    const workflow =
      key === 'orders'
        ? buildOrderWorkflow(role, req.user, row)
        : key === 'deliveries'
          ? buildDeliveryWorkflow(role, req.user, row)
          : null;
    const passwordTarget = manage && ['freelancers', 'customers', 'couriers'].includes(key)
      ? {
        resource: key,
        id: row.id,
        name: detail.title
      }
      : null;

    if (!manage) {
      if (
        key === 'freelancers' &&
        !(role === ROLES.FREELANCER && req.user?.freelancer?.id === row.id)
      ) {
        detail.relations = detail.relations.filter((relation) => relation.title !== 'Замовлення');
      }

      if (key === 'projects') {
        detail.relations = detail.relations.filter((relation) => relation.title !== 'Замовлення');
      }
    }

    return res.render('detail.njk', {
      active: key,
      id,
      canManage: manage,
      passwordTarget,
      workflow,
      canCompleteDelivery: key === 'deliveries' && canCompleteDelivery(role, row, req.user),
      flash: flashMessage(req.query),
      ...detail
    });
  };
}

export async function completeDelivery(req, res) {
  const role = getRole(req);
  const id = Number(req.params.id);

  if (role !== ROLES.COURIER) return forbidden(res);

  const delivery = await prisma.delivery.findUnique({ where: { id } });
  if (!delivery) return notFound(res, 'deliveries');
  if (!canCompleteDelivery(role, delivery, req.user)) return forbidden(res);

  await prisma.delivery.update({
    where: { id },
    data: { status: 'delivered', deliveredAt: new Date() }
  });

  return res.redirect(`/deliveries/${id}?completed=1`);
}
