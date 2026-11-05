import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';
import { validateRegistration } from '../auth/validation.js';

export function showLogin(req, res) {
  res.render('auth/login.njk', {
    title: 'Вхід',
    active: 'login',
    error: req.query.error ? 'Невірний email або пароль.' : null,
    email: req.query.email || ''
  });
}

export function showRegister(req, res) {
  res.render('auth/register.njk', {
    title: 'Реєстрація',
    active: 'register',
    errors: {},
    values: {}
  });
}

export async function register(req, res, next) {
  const { errors, values, password } = validateRegistration(req.body);

  if (Object.keys(errors).length) {
    return res.status(422).render('auth/register.njk', {
      title: 'Реєстрація',
      active: 'register',
      errors,
      values
    });
  }

  try {
    const [userByEmail, customerByEmail, freelancerByEmail] = await Promise.all([
      prisma.user.findUnique({ where: { email: values.email } }),
      prisma.customer.findUnique({ where: { email: values.email } }),
      prisma.freelancer.findUnique({ where: { email: values.email } })
    ]);

    if (userByEmail || customerByEmail || freelancerByEmail) {
      return res.status(422).render('auth/register.njk', {
        title: 'Реєстрація',
        active: 'register',
        errors: { email: 'Користувач з таким email вже існує.' },
        values
      });
    }

    const role = await prisma.role.findUnique({ where: { code: values.role } });
    if (!role) throw new Error('Роль не знайдено');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: values.email,
          passwordHash,
          fullName: values.fullName,
          phone: values.phone,
          roleId: role.id,
          isActive: true
        }
      });

      if (values.role === 'CLIENT') {
        await tx.customer.create({
          data: {
            companyName: values.fullName,
            contactName: values.fullName,
            email: values.email,
            phone: values.phone,
            city: values.city,
            userId: created.id
          }
        });
      } else {
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
            userId: created.id
          }
        });
      }

      return created;
    });

    return req.login(user, (error) => {
      if (error) return next(error);
      return res.redirect('/profile');
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(req, res, next) {
  req.logout((error) => {
    if (error) return next(error);
    return res.redirect('/');
  });
}

