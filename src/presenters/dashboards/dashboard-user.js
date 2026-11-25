import { prisma } from '../../db/client.js';
import { buildTable } from '../build.js';
import { deliveryBadge, moneyCell, mono, person, statusBadge, text } from '../cells.js';
import { orderCategoryName, orderTitle } from '../orders/order-helpers.js';

function orderColumns() {
  return [
    { label: 'Номер', cell: (row) => mono(row.orderNumber) },
    {
      label: 'Замовлення',
      cell: (row) => person(orderTitle(row), orderCategoryName(row), 'blue')
    },
    { label: 'Статус', cell: (row) => statusBadge(row.status) },
    { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
  ];
}

async function clientDashboard(user) {
  const recentOrders = await prisma.order.findMany({
    take: 6,
    where: { customerId: user.customer.id },
    orderBy: { createdAt: 'desc' },
    include: { project: { include: { category: true } }, category: true, status: true }
  });

  return {
    dashboardNote: 'Останні замовлення, які ви створили.',
    tableTitle: 'Останні замовлення',
    tableHref: '/orders',
    tableData: buildTable(orderColumns(), recentOrders, 'orders')
  };
}

async function freelancerDashboard(user) {
  const recentOrders = await prisma.order.findMany({
    take: 6,
    where: { freelancerId: user.freelancer.id },
    orderBy: { createdAt: 'desc' },
    include: { project: { include: { category: true } }, category: true, status: true }
  });

  return {
    dashboardNote: 'Замовлення, де ви є виконавцем.',
    tableTitle: 'Останні замовлення',
    tableHref: '/orders',
    tableData: buildTable(orderColumns(), recentOrders, 'orders')
  };
}

async function courierDashboard(user) {
  const recentDeliveries = await prisma.delivery.findMany({
    take: 6,
    where: { courierId: user.courier.id },
    orderBy: { createdAt: 'desc' },
    include: { order: { include: { project: true } } }
  });

  const columns = [
    { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
    {
      label: 'Замовлення',
      cell: (row) => person(orderTitle(row.order), row.order.orderNumber, 'blue')
    },
    { label: 'Адреса', cell: (row) => text(`${row.city}, ${row.address}`) },
    { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
    { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
  ];

  return {
    dashboardNote: 'Доставки, призначені вам.',
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
    tableTitle: 'Дані',
    tableHref: '/',
    tableData: buildTable([], [], '')
  };
}
