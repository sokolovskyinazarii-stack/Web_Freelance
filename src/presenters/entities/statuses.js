import {
  avatar,
  badge,
  dateCell,
  moneyCell,
  mono,
  person,
  statusBadge,
  text
} from '../cells.js';
import { orderTitle } from '../orders/order-helpers.js';

export const statuses = {
  key: 'statuses',
  label: 'Статуси',
  singular: 'Статус',
  accent: 'rose',
  search: (row) => [row.name, row.code, row.description].join(' '),
  list: {
    title: 'Статуси',
    searchHint: 'Назва, код або опис',
    columns: [
      { label: 'Статус', cell: (row) => statusBadge(row) },
      { label: 'Код', cell: (row) => mono(row.code) },
      { label: 'Опис', cell: (row) => text(row.description) },
      { label: 'Порядок', align: 'right', cell: (row) => text(row.sortOrder) },
      { label: 'Замовлення', align: 'right', cell: (row) => text(row._count.orders) }
    ]
  },
  detail: {
    title: (row) => row.name,
    subtitle: (row) => row.description,
    avatar: (row) => avatar(row.name, 'rose', 'avatar-xl'),
    badge: (row) => statusBadge(row),
    metrics: [
      { label: 'Замовлення', cell: (row) => text(row._count.orders), hint: () => 'у цьому статусі' },
      { label: 'Порядок', cell: (row) => text(row.sortOrder), hint: () => 'у життєвому циклі' },
      { label: 'Код', cell: (row) => text(row.code), hint: () => 'системний ідентифікатор' },
      { label: 'Колір', cell: (row) => badge(row.color, row.color), hint: () => 'акцент інтерфейсу' }
    ],
    fields: [{ label: 'Опис', wide: true, cell: (row) => text(row.description) }],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', cell: (row) => mono(row.orderNumber) },
          { label: 'Замовлення', cell: (row) => person(orderTitle(row), row.customer.companyName, 'blue') },
          { label: 'Фрілансер', cell: (row) => text(row.freelancer?.fullName || '—') },
          { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) },
          { label: 'Створено', cell: (row) => dateCell(row.createdAt) }
        ]
      }
    ]
  }
};
