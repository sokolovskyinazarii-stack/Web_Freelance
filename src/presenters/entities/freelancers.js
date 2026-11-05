import {
  avatar,
  dateCell,
  moneyCell,
  mono,
  paragraph,
  person,
  rating,
  statusBadge,
  text
} from '../cells.js';
import { orderTitle } from '../order-helpers.js';

export const freelancers = {
  key: 'freelancers',
  label: 'Фрілансери',
  singular: 'Фрілансер',
  accent: 'violet',
  search: (row) => [row.fullName, row.specialty, row.city, row.email].join(' '),
  list: {
    title: 'Фрілансери',
    searchHint: 'Ім’я, фах, місто або email',
    columns: [
      { label: 'Фахівець', cell: (row) => person(row.fullName, row.specialty) },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'Ставка', cell: (row) => moneyCell(row.hourlyRate, ' / год') },
      { label: 'Рейтинг', cell: (row) => rating(row.rating) },
      { label: 'Проєкти', align: 'right', cell: (row) => text(row._count.projects) },
      { label: 'Замовлення', align: 'right', cell: (row) => text(row._count.orders) }
    ]
  },
  detail: {
    title: (row) => row.fullName,
    subtitle: (row) => `${row.specialty} · ${row.city}`,
    avatar: (row) => avatar(row.fullName, 'violet', 'avatar-xl'),
    badge: (row) => rating(row.rating),
    metrics: [
      { label: 'Рейтинг', cell: (row) => rating(row.rating), hint: () => 'середня оцінка' },
      { label: 'Ставка', cell: (row) => moneyCell(row.hourlyRate), hint: () => 'за годину' },
      { label: 'Проєкти', cell: (row) => text(row._count.projects), hint: () => 'у роботі та архіві' },
      { label: 'Замовлення', cell: (row) => text(row._count.orders), hint: () => 'залучено виконавцем' }
    ],
    fields: [
      { label: 'Email', cell: (row) => text(row.email) },
      { label: 'Телефон', cell: (row) => text(row.phone) },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'На платформі', cell: (row) => dateCell(row.createdAt) },
      {
        label: 'Про фахівця',
        wide: true,
        cell: (row) => paragraph(row.bio || 'Опис ще не додано.')
      }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', cell: (row) => person(row.title, row.category.name, 'cyan') },
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
          { label: 'Замовлення', cell: (row) => text(orderTitle(row)) },
          { label: 'Статус', cell: (row) => statusBadge(row.status) },
          { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
        ]
      }
    ]
  }
};
