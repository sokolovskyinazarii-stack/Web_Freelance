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

export const orders = {
  key: 'orders',
  label: 'Замовлення',
  singular: 'Замовлення',
  accent: 'blue',
  search: (row) =>
    [row.orderNumber, row.project.title, row.customer.companyName, row.status.name].join(' '),
  list: {
    title: 'Замовлення',
    searchHint: 'Номер, проєкт, замовник або статус',
    columns: [
      { label: 'Номер', cell: (row) => mono(row.orderNumber) },
      { label: 'Проєкт', cell: (row) => person(row.project.title, row.project.category.name, 'blue') },
      { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
      {
        label: 'Фрілансер',
        cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
      },
      { label: 'Статус', cell: (row) => statusBadge(row.status) },
      { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
    ]
  },
  detail: {
    title: (row) => row.orderNumber,
    subtitle: (row) => `${row.project.title} · ${row.project.category.name}`,
    avatar: (row) => avatar(row.orderNumber, 'blue', 'avatar-xl'),
    badge: (row) => statusBadge(row.status),
    metrics: [
      { label: 'Сума', cell: (row) => moneyCell(row.amount), hint: (row) => row.currency },
      {
        label: 'Бюджет проєкту',
        cell: (row) => moneyCell(row.project.budget),
        hint: () => 'загальний'
      },
      { label: 'Створено', cell: (row) => dateCell(row.createdAt), hint: () => 'дата угоди' },
      {
        label: 'Доставка',
        cell: (row) => (row.delivery ? deliveryBadge(row.delivery.status) : text('—')),
        hint: (row) => (row.delivery ? row.delivery.trackingNumber : 'не потрібна')
      }
    ],
    fields: [
      {
        label: 'Проєкт',
        cell: (row) => person(row.project.title, row.project.category.name, 'blue')
      },
      {
        label: 'Замовник',
        cell: (row) => person(row.customer.companyName, row.customer.contactName, 'cyan')
      },
      {
        label: 'Фрілансер',
        cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
      },
      { label: 'Статус', cell: (row) => statusBadge(row.status) },
      { label: 'Валюта', cell: (row) => text(row.currency) },
      { label: 'Оновлено', cell: (row) => dateCell(row.updatedAt) }
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
            cell: (row) => person(row.courier.fullName, row.courier.vehicle, 'green')
          },
          { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
          { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
        ]
      }
    ]
  }
};
