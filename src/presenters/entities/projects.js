import {
  avatar,
  dateCell,
  deadlineBadge,
  moneyCell,
  mono,
  paragraph,
  person,
  statusBadge,
  tag,
  text
} from '../cells.js';

export const projects = {
  key: 'projects',
  label: 'Проєкти',
  singular: 'Проєкт',
  accent: 'green',
  search: (row) =>
    [row.title, row.category.name, row.customer.companyName, row.freelancer.fullName].join(' '),
  list: {
    title: 'Проєкти',
    searchHint: 'Назва, категорія, замовник або фрілансер',
    columns: [
      { label: 'Проєкт', cell: (row) => person(row.title, row.category.name, 'green') },
      { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
      {
        label: 'Фрілансер',
        cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
      },
      { label: 'Бюджет', cell: (row) => moneyCell(row.budget) },
      { label: 'Дедлайн', cell: (row) => deadlineBadge(row.deadline) },
      { label: 'Замовлення', align: 'right', cell: (row) => text(row._count.orders) }
    ]
  },
  detail: {
    title: (row) => row.title,
    subtitle: (row) => `${row.category.name} · ${row.customer.companyName}`,
    avatar: (row) => avatar(row.title, 'green', 'avatar-xl'),
    badge: (row) => deadlineBadge(row.deadline),
    metrics: [
      { label: 'Бюджет', cell: (row) => moneyCell(row.budget), hint: () => 'узгоджений кошторис' },
      { label: 'Замовлення', cell: (row) => text(row._count.orders), hint: () => 'у межах проєкту' },
      { label: 'Дедлайн', cell: (row) => dateCell(row.deadline), hint: () => 'кінцева дата' },
      {
        label: 'Ставка',
        cell: (row) => moneyCell(row.freelancer.hourlyRate, ' / год'),
        hint: () => 'фрілансера'
      }
    ],
    fields: [
      { label: 'Категорія', cell: (row) => tag(row.category.name) },
      {
        label: 'Замовник',
        cell: (row) => person(row.customer.companyName, row.customer.contactName, 'cyan')
      },
      {
        label: 'Фрілансер',
        cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
      },
      { label: 'Створено', cell: (row) => dateCell(row.createdAt) },
      { label: 'Опис', wide: true, cell: (row) => paragraph(row.description) }
    ],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => row.orders,
        columns: [
          { label: 'Номер', cell: (row) => mono(row.orderNumber) },
          { label: 'Статус', cell: (row) => statusBadge(row.status) },
          { label: 'Сума', cell: (row) => moneyCell(row.amount) },
          {
            label: 'Доставка',
            cell: (row) => (row.delivery ? mono(row.delivery.trackingNumber) : text('—'))
          }
        ]
      }
    ]
  }
};
