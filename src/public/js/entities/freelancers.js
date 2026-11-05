import { avatar, date, money, rating } from '../format.js';
import { person } from '../components.js';

export const freelancers = {
  key: 'freelancers',
  label: 'Фрілансери',
  singular: 'Фрілансер',
  icon: 'freelancers',
  accent: 'violet',
  list: {
    title: 'Фрілансери',
    searchHint: 'Ім’я, фах, місто або email',
    search: (row) => [row.fullName, row.specialty, row.city, row.email].join(' '),
    columns: [
      { label: 'Фахівець', render: (row) => person(row.fullName, row.specialty) },
      { label: 'Місто', value: (row) => row.city },
      { label: 'Ставка', value: (row) => `${money(row.hourlyRate)} / год` },
      { label: 'Рейтинг', render: (row) => rating(row.rating) },
      { label: 'Проєкти', align: 'right', value: (row) => row._count.projects },
      { label: 'Замовлення', align: 'right', value: (row) => row._count.orders }
    ]
  },
  detail: {
    title: (row) => row.fullName,
    subtitle: (row) => `${row.specialty} · ${row.city}`,
    aside: (row) => avatar(row.fullName, 'violet', 'avatar-xl'),
    badge: (row) => rating(row.rating),
    metrics: [
      { label: 'Рейтинг', render: (row) => rating(row.rating), hint: () => 'середня оцінка' },
      { label: 'Ставка', value: (row) => money(row.hourlyRate), hint: () => 'за годину' },
      { label: 'Проєкти', value: (row) => row._count.projects, hint: () => 'у роботі та архіві' },
      { label: 'Замовлення', value: (row) => row._count.orders, hint: () => 'залучено виконавцем' }
    ],
    fields: [
      { label: 'Email', value: (row) => row.email },
      { label: 'Телефон', value: (row) => row.phone },
      { label: 'Місто', value: (row) => row.city },
      { label: 'На платформі', value: (row) => date(row.createdAt) },
      { label: 'Про фахівця', wide: true, render: (row) => `<p class="detail-text">${row.bio || 'Опис ще не додано.'}</p>` }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', render: (row) => person(row.title, row.category.name, 'cyan') },
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
