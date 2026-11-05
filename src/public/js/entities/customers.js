import { avatar, badge, date, money } from '../format.js';
import { person } from '../components.js';

export const customers = {
  key: 'customers',
  label: 'Замовники',
  singular: 'Замовник',
  icon: 'customers',
  accent: 'cyan',
  list: {
    title: 'Замовники',
    searchHint: 'Компанія, контакт, місто або email',
    search: (row) => [row.companyName, row.contactName, row.city, row.email].join(' '),
    columns: [
      { label: 'Компанія', render: (row) => person(row.companyName, row.contactName, 'cyan') },
      { label: 'Місто', value: (row) => row.city },
      { label: 'Email', value: (row) => row.email },
      { label: 'Проєкти', align: 'right', value: (row) => row._count.projects },
      { label: 'Замовлення', align: 'right', value: (row) => row._count.orders }
    ]
  },
  detail: {
    title: (row) => row.companyName,
    subtitle: (row) => `${row.contactName} · ${row.city}`,
    aside: (row) => avatar(row.companyName, 'cyan', 'avatar-xl'),
    badge: (row) => badge('Постійний клієнт', '#3dd6f5'),
    metrics: [
      { label: 'Проєкти', value: (row) => row._count.projects, hint: () => 'опубліковано' },
      { label: 'Замовлення', value: (row) => row._count.orders, hint: () => 'усього' },
      {
        label: 'Обіг',
        value: (row) => money(row.orders.reduce((sum, order) => sum + order.amount, 0)),
        hint: () => 'за всіма замовленнями'
      },
      {
        label: 'Активні',
        value: (row) => row.orders.filter((order) => order.status.code !== 'completed' && order.status.code !== 'cancelled').length,
        hint: () => 'зараз у роботі'
      }
    ],
    fields: [
      { label: 'Контактна особа', value: (row) => row.contactName },
      { label: 'Email', value: (row) => row.email },
      { label: 'Телефон', value: (row) => row.phone },
      { label: 'Місто', value: (row) => row.city },
      { label: 'На платформі', value: (row) => date(row.createdAt) }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', render: (row) => person(row.title, row.category.name, 'cyan') },
          { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
          { label: 'Бюджет', value: (row) => money(row.budget) },
          { label: 'Дедлайн', value: (row) => date(row.deadline) }
        ]
      },
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
          { label: 'Проєкт', value: (row) => row.project.title },
          { label: 'Статус', render: (row) => `<span class="badge" style="--tone:${row.status.color}">${row.status.name}</span>` },
          { label: 'Сума', align: 'right', value: (row) => money(row.amount) }
        ]
      }
    ]
  }
};
