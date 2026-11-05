import { avatar, badge, date, money } from '../format.js';
import { person } from '../components.js';

export const categories = {
  key: 'categories',
  label: 'Категорії',
  singular: 'Категорія',
  icon: 'categories',
  accent: 'amber',
  list: {
    title: 'Категорії',
    searchHint: 'Назва, slug або опис',
    search: (row) => [row.name, row.slug, row.description].join(' '),
    columns: [
      { label: 'Категорія', render: (row) => person(row.name, row.description, 'amber') },
      { label: 'Slug', render: (row) => `<span class="tag">${row.slug}</span>` },
      { label: 'Проєкти', align: 'right', value: (row) => row._count.projects }
    ]
  },
  detail: {
    title: (row) => row.name,
    subtitle: (row) => row.description,
    aside: (row) => avatar(row.name, 'amber', 'avatar-xl'),
    badge: (row) => badge(row.slug, '#f7b955'),
    metrics: [
      { label: 'Проєкти', value: (row) => row._count.projects, hint: () => 'у категорії' },
      {
        label: 'Бюджети',
        value: (row) => money(row.projects.reduce((sum, project) => sum + project.budget, 0)),
        hint: () => 'сумарно'
      },
      {
        label: 'Середній бюджет',
        value: (row) => money(row.projects.length ? row.projects.reduce((sum, project) => sum + project.budget, 0) / row.projects.length : 0),
        hint: () => 'на один проєкт'
      },
      {
        label: 'Виконавці',
        value: (row) => new Set(row.projects.map((project) => project.freelancerId)).size,
        hint: () => 'залучені фрілансери'
      }
    ],
    fields: [
      { label: 'Slug', render: (row) => `<span class="tag">${row.slug}</span>` },
      { label: 'Створено', value: (row) => date(row.createdAt) },
      { label: 'Опис', wide: true, render: (row) => `<p class="detail-text">${row.description}</p>` }
    ],
    relations: [
      {
        title: 'Проєкти',
        resource: 'projects',
        items: (row) => row.projects,
        columns: [
          { label: 'Проєкт', render: (row) => person(row.title, row.customer.companyName, 'green') },
          { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
          { label: 'Бюджет', value: (row) => money(row.budget) },
          { label: 'Дедлайн', value: (row) => date(row.deadline) }
        ]
      }
    ]
  }
};
