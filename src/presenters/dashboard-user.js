import { prisma } from '../db/client.js';
import { money } from '../lib/format.js';
import { buildTable } from './build.js';
import { deliveryBadge, moneyCell, mono, person, statusBadge, text } from './cells.js';

function orderColumns() {
  return [
    { label: 'Номер', cell: (row) => mono(row.orderNumber) },
    {
      label: 'Проєкт',
      cell: (row) => person(row.project.title, row.project.category.name, 'blue')
    },
    { label: 'Статус', cell: (row) => statusBadge(row.status) },
    { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
  ];
}

async function clientDashboard(user) {
  const customerId = user.customer.id;
  const [projects, orders, deliveries, spent, recentOrders] = await Promise.all([
    prisma.project.count({ where: { customerId } }),
    prisma.order.count({ where: { customerId } }),
    prisma.delivery.count({ where: { order: { customerId } } }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { customerId, status: { code: { not: 'cancelled' } } }
    }),
    prisma.order.findMany({
      take: 6,
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { project: { include: { category: true } }, status: true }
    })
  ]);

  return {
    stats: [
      { label: 'Проєкти', value: projects, note: 'ваших проєктів' },
      { label: 'Замовлення', value: orders, note: 'усього' },
      { label: 'Доставки', value: deliveries, note: 'за вашими замовленнями' },
      { label: 'Сума', value: money(spent._sum.amount || 0), note: 'без скасованих' }
    ],
    tableTitle: 'Останні замовлення',
    tableHref: '/orders',
    tableData: buildTable(orderColumns(), recentOrders, 'orders')
  };
}

async function freelancerDashboard(user) {
  const freelancerId = user.freelancer.id;
  const [projects, orders, deliveries, earned, recentOrders] = await Promise.all([
    prisma.project.count({ where: { freelancerId } }),
    prisma.order.count({ where: { freelancerId } }),
    prisma.delivery.count({ where: { order: { freelancerId } } }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { freelancerId, status: { code: { not: 'cancelled' } } }
    }),
    prisma.order.findMany({
      take: 6,
      where: { freelancerId },
      orderBy: { createdAt: 'desc' },
      include: { project: { include: { category: true } }, status: true }
    })
  ]);

  return {
    stats: [
      { label: 'Проєкти', value: projects, note: 'ваших проєктів' },
      { label: 'Замовлення', value: orders, note: 'усього' },
      { label: 'Доставки', value: deliveries, note: 'за вашими замовленнями' },
      { label: 'Дохід', value: money(earned._sum.amount || 0), note: 'без скасованих' }
    ],
    tableTitle: 'Останні замовлення',
    tableHref: '/orders',
    tableData: buildTable(orderColumns(), recentOrders, 'orders')
  };
}

async function courierDashboard(user) {
  const courierId = user.courier.id;
  const [deliveries, completed, inTransit, recentDeliveries] = await Promise.all([
    prisma.delivery.count({ where: { courierId } }),
    prisma.delivery.count({ where: { courierId, status: 'delivered' } }),
    prisma.delivery.count({ where: { courierId, status: 'in_transit' } }),
    prisma.delivery.findMany({
      take: 6,
      where: { courierId },
      orderBy: { createdAt: 'desc' },
      include: { order: { include: { project: true } } }
    })
  ]);

  const columns = [
    { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
    {
      label: 'Замовлення',
      cell: (row) => person(row.order.project.title, row.order.orderNumber, 'blue')
    },
    { label: 'Адреса', cell: (row) => text(`${row.city}, ${row.address}`) },
    { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
    { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
  ];

  return {
    stats: [
      { label: 'Доставки', value: deliveries, note: 'усього' },
      { label: 'Виконано', value: completed, note: 'доставлено' },
      { label: 'У дорозі', value: inTransit, note: 'зараз' },
      { label: 'Рейтинг', value: user.courier.rating.toFixed(1), note: 'середня оцінка' }
    ],
    tableTitle: 'Останні доставки',
    tableHref: '/deliveries',
    tableData: buildTable(columns, recentDeliveries, 'deliveries')
  };
}

export async function buildUserDashboard(role, user) {
  if (role === 'CLIENT' && user.customer) return clientDashboard(user);
  if (role === 'FREELANCER' && user.freelancer) return freelancerDashboard(user);
  if (role === 'COURIER' && user.courier) return courierDashboard(user);

  return {
    stats: [],
    tableTitle: 'Дані',
    tableHref: '/',
    tableData: buildTable([], [], '')
  };
}
