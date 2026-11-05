import { avatar, badge, date, money, statusBadge } from '../format.js';
import { person } from '../components.js';

export const statuses = {
  key: 'statuses',
  label: 'Статуси',
  singular: 'Статус',
  icon: 'statuses',
  accent: 'rose',
  list: {
    title: 'Статуси',
    searchHint: 'Назва, код або опис',
    search: (row) => [row.name, row.code, row.description].join(' '),
    columns: [
      { label: 'Статус', render: (row) => statusBadge(row) },
      { label: 'Код', render: (row) => `<span class="cell-mono">${row.code}</span>` },
      { label: 'Опис', value: (row) => row.description },
      { label: 'Порядок', align: 'right', value: (row) => row.sortOrder },
      { label: 'Замовлення', align: 'right', value: (row) => row._count.orders }
    ]
  },
  detail: {
    title: (row) => row.name,
    subtitle: (row) => row.description,
    aside: (row) => avatar(row.name, 'rose', 'avatar-xl'),
    badge: (row) => statusBadge(row),
    metrics: [
      { label: 'Замовлення', value: (row) => row._count.orders, hint: () => 'у цьому статусі' },
      { label: 'Порядок', value: (row) => row.sortOrder, hint: () => 'у життєвому циклі' },
      { label: 'Код', value: (row) => row.code, hint: () => 'системний ідентифікатор' },
      { label: 'Колір', render: (row) => badge(row.color, row.color), hint: () => 'акцент інтерфейсу' }
    ],
    fields: [
      { label: 'Опис', wide: true, render: (row) => `<p class="detail-text">${row.description}</p>` }
    ],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
          { label: 'Проєкт', render: (row) => person(row.project.title, row.customer.companyName, 'blue') },
          { label: 'Фрілансер', value: (row) => row.freelancer.fullName },
          { label: 'Сума', align: 'right', value: (row) => money(row.amount) },
          { label: 'Створено', value: (row) => date(row.createdAt) }
        ]
      }
    ]
  }
};
