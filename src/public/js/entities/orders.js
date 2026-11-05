import { avatar, date, deliveryBadge, money, statusBadge } from '../format.js';
import { person } from '../components.js';

export const orders = {
  key: 'orders',
  label: 'Замовлення',
  singular: 'Замовлення',
  icon: 'orders',
  accent: 'blue',
  list: {
    title: 'Замовлення',
    searchHint: 'Номер, проєкт, замовник або статус',
    search: (row) =>
      [row.orderNumber, row.project.title, row.customer.companyName, row.status.name].join(' '),
    columns: [
      { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
      { label: 'Проєкт', render: (row) => person(row.project.title, row.project.category.name, 'blue') },
      { label: 'Замовник', value: (row) => row.customer.companyName },
      { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
      { label: 'Статус', render: (row) => statusBadge(row.status) },
      { label: 'Сума', align: 'right', value: (row) => money(row.amount) }
    ]
  },
  detail: {
    title: (row) => row.orderNumber,
    subtitle: (row) => `${row.project.title} · ${row.project.category.name}`,
    aside: (row) => avatar(row.orderNumber, 'blue', 'avatar-xl'),
    badge: (row) => statusBadge(row.status),
    metrics: [
      { label: 'Сума', value: (row) => money(row.amount), hint: (row) => row.currency },
      { label: 'Бюджет проєкту', value: (row) => money(row.project.budget), hint: () => 'загальний' },
      { label: 'Створено', value: (row) => date(row.createdAt), hint: () => 'дата угоди' },
      {
        label: 'Доставка',
        render: (row) => (row.delivery ? deliveryBadge(row.delivery.status) : '—'),
        hint: (row) => (row.delivery ? row.delivery.trackingNumber : 'не потрібна')
      }
    ],
    fields: [
      { label: 'Проєкт', render: (row) => person(row.project.title, row.project.category.name, 'blue') },
      { label: 'Замовник', render: (row) => person(row.customer.companyName, row.customer.contactName, 'cyan') },
      { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
      { label: 'Статус', render: (row) => statusBadge(row.status) },
      { label: 'Валюта', value: (row) => row.currency },
      { label: 'Оновлено', value: (row) => date(row.updatedAt) }
    ],
    relations: [
      {
        title: 'Доставка',
        resource: 'deliveries',
        empty: 'Для цього замовлення доставку не створено.',
        items: (row) => (row.delivery ? [row.delivery] : []),
        columns: [
          { label: 'Трек-номер', render: (row) => `<span class="cell-mono">${row.trackingNumber}</span>` },
          { label: 'Кур’єр', render: (row) => person(row.courier.fullName, row.courier.vehicle, 'green') },
          { label: 'Статус', render: (row) => deliveryBadge(row.status) },
          { label: 'Вартість', align: 'right', value: (row) => money(row.cost) }
        ]
      }
    ]
  }
};
