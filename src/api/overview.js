import { prisma } from '../db/client.js';

export async function getOverviewData() {
  const [
    freelancers,
    customers,
    categories,
    projects,
    orders,
    couriers,
    deliveries,
    statuses,
    revenue,
    activeOrders,
    recentOrders,
    topFreelancers,
    categoryLoad
  ] = await Promise.all([
    prisma.freelancer.count(),
    prisma.customer.count(),
    prisma.category.count(),
    prisma.project.count(),
    prisma.order.count(),
    prisma.courier.count(),
    prisma.delivery.findMany({ select: { status: true } }),
    prisma.status.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { orders: true } } }
    }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: { code: { not: 'cancelled' } } }
    }),
    prisma.order.count({
      where: {
        status: { code: { in: ['open', 'in_progress', 'review', 'delivery'] } }
      }
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { include: { category: true } },
        category: true,
        customer: true,
        freelancer: true,
        status: true
      }
    }),
    prisma.freelancer.findMany({
      take: 4,
      orderBy: [{ rating: 'desc' }, { fullName: 'asc' }],
      include: { _count: { select: { orders: true } } }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { projects: true } } }
    })
  ]);

  const deliveryBreakdown = deliveries.reduce((result, item) => {
    result[item.status] = (result[item.status] || 0) + 1;
    return result;
  }, {});

  return {
    totals: {
      freelancers,
      customers,
      categories,
      projects,
      orders,
      couriers,
      deliveries: deliveries.length
    },
    revenue: revenue._sum.amount || 0,
    activeOrders,
    deliveryBreakdown,
    statusBreakdown: statuses.map((status) => ({
      id: status.id,
      code: status.code,
      name: status.name,
      color: status.color,
      count: status._count.orders
    })),
    recentOrders,
    topFreelancers,
    categories: categoryLoad
  };
}

export async function overview(req, res) {
  res.json(await getOverviewData());
}
