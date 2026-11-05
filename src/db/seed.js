import { prisma } from './client.js';
import { categories, statuses } from './seed-data/catalog.js';
import { customers, freelancers } from './seed-data/people.js';
import { couriers } from './seed-data/couriers.js';
import { projects } from './seed-data/projects.js';
import { orders } from './seed-data/orders.js';
import { deliveries } from './seed-data/deliveries.js';

export async function seed() {
  await prisma.$transaction([
    prisma.category.createMany({ data: categories }),
    prisma.status.createMany({ data: statuses }),
    prisma.freelancer.createMany({ data: freelancers }),
    prisma.customer.createMany({ data: customers }),
    prisma.courier.createMany({ data: couriers }),
    prisma.project.createMany({ data: projects }),
    prisma.order.createMany({ data: orders }),
    prisma.delivery.createMany({ data: deliveries })
  ]);

  console.log('[db] Демонстраційні дані додано');
}
