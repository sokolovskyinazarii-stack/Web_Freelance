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

export const customers = {
  key: 'customers',
  label: 'Замовники',
  singular: 'Замовник',
  accent: 'cyan',
  search: (row) => [row.companyName, row.contactName, row.city, row.email].join(' '),
  list: {
    title: 'Замовники',
    searchHint: 'Компанія, контакт, місто або email',
    columns: [
      { label: 'Компанія', cell: (row) => person(row.companyName, row.contactName, 'cyan') },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'Email', cell: (row) => text(row.email) },
      { label: 'Проєкти', align: 'right', cell: (row) => text(row._count.projects) },
      { label: 'Замовлення', align: 'right', cell: (row) => text(row._count.orders) }
    ]
  },
  detail: {
    title: (row) => row.companyName,
    subtitle: (row) => `${row.contactName} · ${row.city}`,
    avatar: (row) => avatar(row.companyName, 'cyan', 'avatar-xl'),
    badge: () => badge('Постійний клієнт', '#22d3ee'),
    metrics: [
      { label: 'Проєкти', cell: (row) => text(row._count.projects), hint: () => 'опубліковано' },
      { label: 'Замовлення', cell: (row) => text(row._count.orders), hint: () => 'усього' },
      {
        label: 'Обіг',
        cell: (row) => moneyCell(row.orders.reduce((sum, order) => sum + order.amount, 0)),
        hint: () => 'за всіма замовленнями'
      },
      {
        label: 'Активні',
        cell: (row) =>
          text(
            row.orders.filter(
              (order) => order.status.code !== 'completed' && order.status.code !== 'cancelled'
            ).length
          ),
        hint: () => 'зараз у роботі'
      }
    ],
    fields: [
      { label: 'Контактна особа', cell: (row) => text(row.contactName) },
      { label: 'Email', cell: (row) => text(row.email) },
      { label: 'Телефон', cell: (row) => text(row.phone) },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'На платформі', cell: (row) => dateCell(row.createdAt) }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', cell: (row) => person(row.title, row.category.name, 'cyan') },
          {
            label: 'Фрілансер',
            cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
          },
          { label: 'Бюджет', cell: (row) => moneyCell(row.budget) },
          { label: 'Дедлайн', cell: (row) => dateCell(row.deadline) }
        ]
      },
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', cell: (row) => mono(row.orderNumber) },
          { label: 'Проєкт', cell: (row) => text(row.project.title) },
          { label: 'Статус', cell: (row) => statusBadge(row.status) },
          { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
        ]
      }
    ]
  }
};
