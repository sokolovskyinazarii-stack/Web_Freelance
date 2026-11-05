import { prisma } from '../db/client.js';

const relatedConfig = {
  freelancers: [
    { label: 'Проєкти', count: (id) => prisma.project.count({ where: { freelancerId: id } }) },
    {
      label: 'Замовлення',
      count: (id) =>
        prisma.order.count({
          where: { OR: [{ freelancerId: id }, { project: { freelancerId: id } }] }
        })
    }
  ],
  customers: [
    { label: 'Проєкти', count: (id) => prisma.project.count({ where: { customerId: id } }) },
    {
      label: 'Замовлення',
      count: (id) =>
        prisma.order.count({
          where: { OR: [{ customerId: id }, { project: { customerId: id } }] }
        })
    }
  ],
  categories: [
    { label: 'Проєкти', count: (id) => prisma.project.count({ where: { categoryId: id } }) },
    {
      label: 'Замовлення',
      count: (id) => prisma.order.count({ where: { project: { categoryId: id } } })
    }
  ],
  projects: [
    { label: 'Замовлення', count: (id) => prisma.order.count({ where: { projectId: id } }) }
  ],
  orders: [
    { label: 'Доставки', count: (id) => prisma.delivery.count({ where: { orderId: id } }) }
  ],
  statuses: [
    { label: 'Замовлення', count: (id) => prisma.order.count({ where: { statusId: id } }) }
  ],
  deliveries: [],
  couriers: [
    { label: 'Доставки', count: (id) => prisma.delivery.count({ where: { courierId: id } }) }
  ]
};

export async function getRelatedInfo(key, id) {
  const items = await Promise.all(
    (relatedConfig[key] || []).map(async (item) => ({
      label: item.label,
      count: await item.count(id)
    }))
  );

  return items.filter((item) => item.count > 0);
}

export function relatedTotal(items) {
  return items.reduce((sum, item) => sum + item.count, 0);
}

async function deleteOrders(tx, where) {
  const orders = await tx.order.findMany({ where, select: { id: true } });
  const ids = orders.map((order) => order.id);

  if (!ids.length) return;

  await tx.delivery.deleteMany({ where: { orderId: { in: ids } } });
  await tx.order.deleteMany({ where: { id: { in: ids } } });
}

export async function cascadeDelete(key, id) {
  await prisma.$transaction(async (tx) => {
    if (key === 'freelancers') {
      const projects = await tx.project.findMany({
        where: { freelancerId: id },
        select: { id: true }
      });
      const projectIds = projects.map((project) => project.id);
      const conditions = [{ freelancerId: id }];
      if (projectIds.length) conditions.push({ projectId: { in: projectIds } });

      await deleteOrders(tx, { OR: conditions });
      if (projectIds.length) {
        await tx.project.deleteMany({ where: { id: { in: projectIds } } });
      }
      await tx.freelancer.delete({ where: { id } });
      return;
    }

    if (key === 'customers') {
      const projects = await tx.project.findMany({
        where: { customerId: id },
        select: { id: true }
      });
      const projectIds = projects.map((project) => project.id);
      const conditions = [{ customerId: id }];
      if (projectIds.length) conditions.push({ projectId: { in: projectIds } });

      await deleteOrders(tx, { OR: conditions });
      if (projectIds.length) {
        await tx.project.deleteMany({ where: { id: { in: projectIds } } });
      }
      await tx.customer.delete({ where: { id } });
      return;
    }

    if (key === 'categories') {
      const projects = await tx.project.findMany({
        where: { categoryId: id },
        select: { id: true }
      });
      const projectIds = projects.map((project) => project.id);

      if (projectIds.length) {
        await deleteOrders(tx, { projectId: { in: projectIds } });
        await tx.project.deleteMany({ where: { id: { in: projectIds } } });
      }
      await tx.category.delete({ where: { id } });
      return;
    }

    if (key === 'projects') {
      await deleteOrders(tx, { projectId: id });
      await tx.project.delete({ where: { id } });
      return;
    }

    if (key === 'orders') {
      await tx.delivery.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
      return;
    }

    if (key === 'statuses') {
      await deleteOrders(tx, { statusId: id });
      await tx.status.delete({ where: { id } });
      return;
    }

    if (key === 'deliveries') {
      await tx.delivery.delete({ where: { id } });
      return;
    }

    if (key === 'couriers') {
      await tx.delivery.deleteMany({ where: { courierId: id } });
      await tx.courier.delete({ where: { id } });
    }
  });
}
