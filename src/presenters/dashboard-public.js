import { prisma } from '../db/client.js';
import { buildTable } from './build.js';
import { dateCell, moneyCell, person, text } from './cells.js';

export async function buildPublicDashboard() {
  const [projects, freelancers, categories, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.freelancer.count(),
    prisma.category.count(),
    prisma.project.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true, customer: true, freelancer: true }
    })
  ]);

  const columns = [
    { label: 'Проєкт', cell: (row) => person(row.title, row.category.name, 'green') },
    { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
    {
      label: 'Фрілансер',
      cell: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet')
    },
    { label: 'Бюджет', cell: (row) => moneyCell(row.budget) },
    { label: 'Дедлайн', cell: (row) => dateCell(row.deadline) }
  ];

  return {
    stats: [
      { label: 'Проєкти', value: projects, note: 'на платформі' },
      { label: 'Фрілансери', value: freelancers, note: 'у каталозі' },
      { label: 'Категорії', value: categories, note: 'напрямів робіт' }
    ],
    recentTable: buildTable(columns, recentProjects, 'projects')
  };
}
