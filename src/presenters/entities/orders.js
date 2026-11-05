import {
  avatar,
  dateCell,
  deliveryBadge,
  moneyCell,
  mono,
  person,
  statusBadge,
  text
} from '../cells.js';
import {
  orderBudget,
  orderCategoryName,
  orderDeadline,
  orderTitle
} from '../orders/order-helpers.js';

export const orders = {
  key: 'orders',
  label: 'Замовлення',
  singular: 'Замовлення',
  accent: 'blue',
  search: (row) =>
    [
      row.orderNumber,
      orderTitle(row),
      row.description || '',
      row.customer.companyName,
      orderCategoryName(row),
      row.status.name
    ].join(' '),
  list: {
    title: 'Замовлення',
    searchHint: 'Номер, назва, замовник або статус',
    columns: [
      { label: 'Номер', cell: (row) => mono(row.orderNumber) },
      {
        label: 'Замовлення',
        cell: (row) => person(orderTitle(row), orderCategoryName(row), 'blue')
      },
      { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
      {
        label: 'Фрілансер',
        cell: (row) =>
          row.freelancer
            ? person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
            : text('—')
      },
      { label: 'Статус', cell: (row) => statusBadge(row.status) },
      { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
    ]
  },
  detail: {
    title: (row) => row.orderNumber,
    subtitle: (row) => `${orderTitle(row)} · ${orderCategoryName(row)}`,
    avatar: (row) => avatar(row.orderNumber, 'blue', 'avatar-xl'),
    badge: (row) => statusBadge(row.status),
    metrics: [
      { label: 'Сума', cell: (row) => moneyCell(row.amount), hint: (row) => row.currency },
      {
        label: 'Бюджет',
        cell: (row) => moneyCell(orderBudget(row)),
        hint: () => 'орієнтовний'
      },
      { label: 'Дедлайн', cell: (row) => dateCell(orderDeadline(row)), hint: () => 'бажана дата' },
      {
        label: 'Доставка',
        cell: (row) => (row.delivery ? deliveryBadge(row.delivery.status) : text('—')),
        hint: (row) =>
          row.delivery
            ? row.delivery.trackingNumber
            : row.deliveryNeeded
              ? 'очікує оформлення'
              : 'не потрібна'
      }
    ],
    fields: [
      { label: 'Назва', cell: (row) => text(orderTitle(row)) },
      { label: 'Категорія', cell: (row) => text(orderCategoryName(row)) },
      {
        label: 'Замовник',
        cell: (row) => person(row.customer.companyName, row.customer.contactName, 'cyan')
      },
      {
        label: 'Фрілансер',
        cell: (row) =>
          row.freelancer
            ? person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
            : text('Ще не обрано')
      },
      { label: 'Статус', cell: (row) => statusBadge(row.status) },
      { label: 'Валюта', cell: (row) => text(row.currency) },
      { label: 'Оновлено', cell: (row) => dateCell(row.updatedAt) },
      {
        label: 'Опис',
        wide: true,
        cell: (row) =>
          text(row.description || row.project?.description || 'Опис не додано.')
      }
    ],
    relations: [
      {
        title: 'Доставка',
        resource: 'deliveries',
        empty: 'Для цього замовлення доставку не створено.',
        items: (row) => (row.delivery ? [row.delivery] : []),
        columns: [
          { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
          {
            label: 'Кур’єр',
            cell: (row) =>
              row.courier
                ? person(row.courier.fullName, row.courier.vehicle, 'green')
                : text('Очікує кур’єра')
          },
          { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
          { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
        ]
      }
    ]
  }
};
