import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';
import { generatePassword } from '../auth/password.js';

const resourceMap = {
  freelancers: { model: 'freelancer', role: 'FREELANCER', name: (record) => record.fullName },
  customers: { model: 'customer', role: 'CLIENT', name: (record) => record.contactName },
  couriers: { model: 'courier', role: 'COURIER', name: (record) => record.fullName }
};

async function resolveTarget(resource, id) {
  if (resource === 'users') {
    return {
      user: await prisma.user.findUnique({ where: { id }, include: { role: true } })
    };
  }

  const config = resourceMap[resource];
  if (!config) return null;

  const record = await prisma[config.model].findUnique({ where: { id } });
  if (!record) return null;

  if (record.userId) {
    return {
      user: await prisma.user.findUnique({ where: { id: record.userId }, include: { role: true } }),
      record,
      config
    };
  }

  return {
    user: await prisma.user.findUnique({ where: { email: record.email }, include: { role: true } }),
    record,
    config
  };
}

export async function resetPassword(req, res) {
  const resource = req.params.resource || 'users';
  const target = await resolveTarget(resource, Number(req.params.id));

  if (!target || (!target.user && !target.record)) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  const { user, record, config } = target;

  if (user && config && user.role.code !== config.role) {
    return res.status(409).json({ message: 'Акаунт з таким email має іншу роль' });
  }

  const password = generatePassword(14);
  const passwordHash = await bcrypt.hash(password, 10);
  let savedUser = user;
  let created = false;

  if (savedUser) {
    await prisma.user.update({
      where: { id: savedUser.id },
      data: { passwordHash }
    });
  } else {
    const role = await prisma.role.findUnique({ where: { code: config.role } });
    if (!role) return res.status(500).json({ message: 'Роль не знайдено' });

    savedUser = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: record.email,
          passwordHash,
          fullName: config.name(record),
          phone: record.phone,
          roleId: role.id
        }
      });

      await tx[config.model].update({
        where: { id: record.id },
        data: { userId: newUser.id }
      });

      return newUser;
    });
    created = true;
  }

  if (record && !record.userId && savedUser?.id) {
    await prisma[config.model].update({
      where: { id: record.id },
      data: { userId: savedUser.id }
    });
  }

  res.set('Cache-Control', 'no-store');
  return res.json({
    password,
    fullName: savedUser.fullName,
    email: savedUser.email,
    created
  });
}
