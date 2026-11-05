import bcrypt from 'bcryptjs';
import { prisma } from '../../db/client.js';
import { buildProfileFields } from '../../auth/forms/profile-form.js';
import { validatePasswordChange, validateProfile } from '../../auth/validation/index.js';

function renderEdit(req, res, options = {}) {
  const {
    values = {},
    errors = {},
    passwordErrors = {},
    status = 200
  } = options;

  return res.status(status).render('profile/profile-edit.njk', {
    title: 'Редагування профілю',
    active: 'profile',
    user: req.user,
    fields: buildProfileFields(req.user, values),
    errors,
    passwordErrors
  });
}

export function editProfile(req, res) {
  return renderEdit(req, res);
}

export async function updateProfile(req, res) {
  const { errors, values } = validateProfile(req.body, req.user);

  if (Object.keys(errors).length) {
    return renderEdit(req, res, { values, errors, status: 422 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user.id },
        data: { phone: values.phone }
      });

      if (req.user.freelancer) {
        await tx.freelancer.update({
          where: { id: req.user.freelancer.id },
          data: {
            phone: values.phone,
            city: values.city,
            specialty: values.specialty,
            hourlyRate: values.hourlyRate,
            bio: values.bio
          }
        });
      } else if (req.user.customer) {
        await tx.customer.update({
          where: { id: req.user.customer.id },
          data: {
            phone: values.phone,
            companyName: values.companyName,
            city: values.city
          }
        });
      } else if (req.user.courier) {
        await tx.courier.update({
          where: { id: req.user.courier.id },
          data: {
            phone: values.phone,
            vehicle: values.vehicle,
            zone: values.zone
          }
        });
      }
    });

    return res.redirect('/profile?updated=1');
  } catch (error) {
    return renderEdit(req, res, {
      values,
      errors: error.code === 'P2002'
        ? { phone: 'Цей номер телефону вже використовується.' }
        : { _form: 'Не вдалося зберегти зміни. Перевірте введені дані.' },
      status: 422
    });
  }
}

export async function changePassword(req, res) {
  const { errors, current, password } = validatePasswordChange(req.body);

  if (Object.keys(errors).length) {
    return renderEdit(req, res, { passwordErrors: errors, status: 422 });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(current, user.passwordHash);

  if (!valid) {
    return renderEdit(req, res, {
      passwordErrors: { currentPassword: 'Поточний пароль неправильний.' },
      status: 422
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 10) }
  });

  return res.redirect('/profile?password=1');
}
