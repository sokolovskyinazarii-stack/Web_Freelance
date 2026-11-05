import { money } from '../lib/format.js';
import { buildTable } from './build.js';
import { moneyCell, mono, person, statusBadge, text } from './cells.js';
import { orderCategoryName, orderTitle } from './order-helpers.js';

export function buildDashboard(data) {
  const {
    totals,
    revenue,
    activeOrders,
    statusBreakdown,
    recentOrders,
    topFreelancers,
    categories,
    deliveryBreakdown
  } = data;
  const maxCategory = Math.max(...categories.map((category) => category._count.projects), 1);
  const orderColumns = [
    { label: 'Номер', cell: (row) => mono(row.orderNumber) },
    {
      label: 'Замовлення',
      cell: (row) => person(orderTitle(row), orderCategoryName(row), 'blue')
    },
    {
      label: 'Фрілансер',
      cell: (row) =>
        row.freelancer
          ? person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
          : text('—')
    },
    { label: 'Статус', cell: (row) => statusBadge(row.status) },
    { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
  ];

  return {
    stats: [
      { label: 'Сума замовлень', value: money(revenue), note: 'без скасованих' },
      { label: 'Активні замовлення', value: activeOrders, note: 'у роботі та на перевірці' },
      { label: 'Проєкти', value: totals.projects, note: 'усього' },
      { label: 'Доставки', value: totals.deliveries, note: 'у логістиці' }
    ],
    statuses: statusBreakdown.map((status) => ({
      ...status,
      width: Math.max((status.count / Math.max(totals.orders, 1)) * 100, 3)
    })),
    freelancers: topFreelancers,
    recentTable: buildTable(orderColumns, recentOrders, 'orders'),
    categories: categories.map((category) => ({
      ...category,
      width: Math.max((category._count.projects / maxCategory) * 100, 4)
    })),
    deliveryBreakdown,
    totals
  };
}
