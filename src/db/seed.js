import bcrypt from 'bcryptjs';
import { prisma } from './client.js';
import { roles } from './seed-data/roles.js';
import { demoUsers } from './seed-data/users.js';
import { categories, statuses } from './seed-data/catalog.js';
import { customers, freelancers } from './seed-data/people.js';
import { couriers } from './seed-data/couriers.js';
import { projects } from './seed-data/projects.js';
import { orders } from './seed-data/orders.js';
import { deliveries } from './seed-data/deliveries.js';

export async function seed() {
  const users = demoUsers.map(({ password, ...user }) => ({
    ...user,
    passwordHash: bcrypt.hashSync(password, 10)
  }));

  await prisma.$transaction([
    prisma.role.createMany({ data: roles }),
    prisma.user.createMany({ data: users }),
    prisma.category.createMany({ data: categories }),
    prisma.status.createMany({ data: statuses }),
    prisma.freelancer.createMany({ data: freelancers }),
    prisma.customer.createMany({ data: customers }),
    prisma.courier.createMany({ data: couriers }),
    prisma.project.createMany({ data: projects }),
    prisma.order.createMany({ data: orders }),
    prisma.delivery.createMany({ data: deliveries })
  ]);

  console.log('[db] Демонстраційні дані та акаунти додано');
}
