export const resources = {
  freelancers: {
    model: 'freelancer',
    orderBy: { fullName: 'asc' },
    include: {
      _count: { select: { projects: true, orders: true } },
      projects: { include: { category: true }, orderBy: { deadline: 'asc' } },
      orders: {
        include: { status: true, project: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  },
  customers: {
    model: 'customer',
    orderBy: { companyName: 'asc' },
    include: {
      _count: { select: { projects: true, orders: true } },
      projects: {
        include: { category: true, freelancer: true },
        orderBy: { createdAt: 'desc' }
      },
      orders: {
        include: { status: true, project: true, freelancer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  },
  categories: {
    model: 'category',
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { projects: true } },
      projects: {
        include: { customer: true, freelancer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  },
  projects: {
    model: 'project',
    orderBy: { deadline: 'asc' },
    include: {
      category: true,
      customer: true,
      freelancer: true,
      _count: { select: { orders: true } },
      orders: {
        include: { status: true, delivery: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  },
  orders: {
    model: 'order',
    orderBy: { createdAt: 'desc' },
    include: {
      project: { include: { category: true } },
      category: true,
      customer: true,
      freelancer: true,
      status: true,
      delivery: { include: { courier: true } },
      applications: { include: { freelancer: true }, orderBy: { createdAt: 'asc' } },
      reviews: { include: { author: true }, orderBy: { createdAt: 'desc' } }
    }
  },
  statuses: {
    model: 'status',
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { orders: true } },
      orders: {
        include: { project: true, customer: true, freelancer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  },
  deliveries: {
    model: 'delivery',
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        include: {
          project: true,
          category: true,
          customer: true,
          freelancer: true,
          status: true
        }
      },
      courier: true,
      reviews: { include: { author: true }, orderBy: { createdAt: 'desc' } }
    }
  },
  couriers: {
    model: 'courier',
    orderBy: { fullName: 'asc' },
    include: {
      _count: { select: { deliveries: true } },
      deliveries: {
        include: { order: { include: { project: true, customer: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  }
};
