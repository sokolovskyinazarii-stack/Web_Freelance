import { avatar, date, deadlineBadge, money } from '../format.js';
import { person } from '../components.js';

export const projects = {
  key: 'projects',
  label: 'Проєкти',
  singular: 'Проєкт',
  icon: 'projects',
  accent: 'green',
  list: {
    title: 'Проєкти',
    searchHint: 'Назва, категорія, замовник або фрілансер',
    search: (row) =>
      [row.title, row.category.name, row.customer.companyName, row.freelancer.fullName].join(' '),
    columns: [
      { label: 'Проєкт', render: (row) => person(row.title, row.category.name, 'green') },
      { label: 'Замовник', value: (row) => row.customer.companyName },
      { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
      { label: 'Бюджет', value: (row) => money(row.budget) },
      { label: 'Дедлайн', render: (row) => deadlineBadge(row.deadline) },
      { label: 'Замовлення', align: 'right', value: (row) => row._count.orders }
    ]
  },
  detail: {
    title: (row) => row.title,
    subtitle: (row) => `${row.category.name} · ${row.customer.companyName}`,
    aside: (row) => avatar(row.title, 'green', 'avatar-xl'),
    badge: (row) => deadlineBadge(row.deadline),
    metrics: [
      { label: 'Бюджет', value: (row) => money(row.budget), hint: () => 'узгоджений кошторис' },
      { label: 'Замовлення', value: (row) => row._count.orders, hint: () => 'у межах проєкту' },
      { label: 'Дедлайн', value: (row) => date(row.deadline), hint: () => 'кінцева дата' },
      { label: 'Ставка', value: (row) => `${money(row.freelancer.hourlyRate)} / год`, hint: () => 'фрілансера' }
    ],
    fields: [
      { label: 'Категорія', render: (row) => `<span class="tag">${row.category.name}</span>` },
      { label: 'Замовник', render: (row) => person(row.customer.companyName, row.customer.contactName, 'cyan') },
      { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
      { label: 'Створено', value: (row) => date(row.createdAt) },
      { label: 'Опис', wide: true, render: (row) => `<p class="detail-text">${row.description}</p>` }
    ],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
          { label: 'Статус', render: (row) => `<span class="badge" style="--tone:${row.status.color}">${row.status.name}</span>` },
          { label: 'Сума', value: (row) => money(row.amount) },
          { label: 'Доставка', value: (row) => (row.delivery ? row.delivery.trackingNumber : '—') }
        ]
      }
    ]
  }
};
