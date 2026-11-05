import {
  avatar,
  badge,
  dateCell,
  moneyCell,
  paragraph,
  person,
  tag,
  text
} from '../cells.js';

export const categories = {
  key: 'categories',
  label: 'Категорії',
  singular: 'Категорія',
  accent: 'amber',
  search: (row) => [row.name, row.slug, row.description].join(' '),
  list: {
    title: 'Категорії',
    searchHint: 'Назва, slug або опис',
    columns: [
      { label: 'Категорія', cell: (row) => person(row.name, row.description, 'amber') },
      { label: 'Slug', cell: (row) => tag(row.slug) },
      { label: 'Проєкти', align: 'right', cell: (row) => text(row._count.projects) }
    ]
  },
  detail: {
    title: (row) => row.name,
    subtitle: (row) => row.description,
    avatar: (row) => avatar(row.name, 'amber', 'avatar-xl'),
    badge: (row) => badge(row.slug, '#fbbf24'),
    metrics: [
      { label: 'Проєкти', cell: (row) => text(row._count.projects), hint: () => 'у категорії' },
      {
        label: 'Бюджети',
        cell: (row) => moneyCell(row.projects.reduce((sum, project) => sum + project.budget, 0)),
        hint: () => 'сумарно'
      },
      {
        label: 'Середній бюджет',
        cell: (row) =>
          moneyCell(
            row.projects.length
              ? row.projects.reduce((sum, project) => sum + project.budget, 0) /
                  row.projects.length
              : 0
          ),
        hint: () => 'на один проєкт'
      },
      {
        label: 'Виконавці',
        cell: (row) => text(new Set(row.projects.map((project) => project.freelancerId)).size),
        hint: () => 'залучені фрілансери'
      }
    ],
    fields: [
      { label: 'Slug', cell: (row) => tag(row.slug) },
      { label: 'Створено', cell: (row) => dateCell(row.createdAt) },
      { label: 'Опис', wide: true, cell: (row) => paragraph(row.description) }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', cell: (row) => person(row.title, row.customer.companyName, 'green') },
          {
            label: 'Фрілансер',
            cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
          },
          { label: 'Бюджет', cell: (row) => moneyCell(row.budget) },
          { label: 'Дедлайн', cell: (row) => dateCell(row.deadline) }
        ]
      }
    ]
  }
};
