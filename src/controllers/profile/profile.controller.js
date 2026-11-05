import { prisma } from '../../db/client.js';
import { flashMessage } from '../../lib/flash.js';

export async function profile(req, res) {
  const user = req.user;
  const linkedProfile = user.freelancer || user.customer || user.courier || null;
  let metrics = [];

  if (user.freelancer) {
    const [projects, orders] = await Promise.all([
      prisma.project.count({ where: { freelancerId: user.freelancer.id } }),
      prisma.order.count({ where: { freelancerId: user.freelancer.id } })
    ]);
    metrics = [
      { label: 'Проєкти', value: projects },
      { label: 'Замовлення', value: orders }
    ];
  } else if (user.customer) {
    const [projects, orders] = await Promise.all([
      prisma.project.count({ where: { customerId: user.customer.id } }),
      prisma.order.count({ where: { customerId: user.customer.id } })
    ]);
    metrics = [
      { label: 'Проєкти', value: projects },
      { label: 'Замовлення', value: orders }
    ];
  } else if (user.courier) {
    const [deliveries, completed] = await Promise.all([
      prisma.delivery.count({ where: { courierId: user.courier.id } }),
      prisma.delivery.count({ where: { courierId: user.courier.id, status: 'delivered' } })
    ]);
    metrics = [
      { label: 'Доставки', value: deliveries },
      { label: 'Виконано', value: completed }
    ];
  } else if (user.role.code === 'ADMIN') {
    const [users, active] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } })
    ]);
    metrics = [
      { label: 'Користувачі', value: users },
      { label: 'Активні', value: active }
    ];
  }

  res.render('profile/profile.njk', {
    title: 'Профіль',
    active: 'profile',
    user,
    profile: linkedProfile,
    metrics,
    flash: flashMessage(req.query)
  });
}
