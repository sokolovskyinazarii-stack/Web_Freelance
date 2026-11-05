import { prisma } from '../../db/client.js';

export async function emailConflict(email, user = null) {
  const existingUser = await prisma.user.findFirst({
    where: { email, ...(user ? { id: { not: user.id } } : {}) }
  });
  if (existingUser) return true;

  const [freelancer, customer, courier] = await Promise.all([
    prisma.freelancer.findFirst({ where: { email } }),
    prisma.customer.findFirst({ where: { email } }),
    prisma.courier.findFirst({ where: { email } })
  ]);

  if (freelancer && freelancer.id !== user?.freelancer?.id) return true;
  if (customer && customer.id !== user?.customer?.id) return true;
  if (courier && courier.id !== user?.courier?.id) return true;
  return false;
}

export async function createProfile(tx, role, user, values) {
  if (role.code === 'CLIENT') {
    await tx.customer.create({
      data: {
        companyName: values.fullName,
        contactName: values.fullName,
        email: values.email,
        phone: values.phone,
        city: values.city,
        userId: user.id
      }
    });
  }

  if (role.code === 'FREELANCER') {
    await tx.freelancer.create({
      data: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        specialty: 'Не вказано',
        city: values.city,
        hourlyRate: 0,
        rating: 0,
        bio: '',
        userId: user.id
      }
    });
  }

  if (role.code === 'COURIER') {
    await tx.courier.create({
      data: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        vehicle: 'Пішки',
        zone: values.city,
        rating: 0,
        isActive: true,
        userId: user.id
      }
    });
  }
}
