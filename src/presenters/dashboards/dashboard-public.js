import { prisma } from '../../db/client.js';
import { buildTable } from '../build.js';
import { dateCell, moneyCell, person, text } from '../cells.js';

export async function buildPublicDashboard() {
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true, customer: true, freelancer: true }
  });

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
    recentTable: buildTable(columns, recentProjects, 'projects')
  };
}
