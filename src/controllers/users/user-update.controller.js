import { prisma } from '../../db/client.js';
import { validateUserForm } from '../../auth/validation/index.js';
import { buildUserFields } from '../../auth/forms/user-form.js';
import { emailConflict } from '../../auth/services/user-service.js';
import { renderUserForm, userNotFound } from '../../auth/views/user-view.js';

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true, freelancer: true, customer: true, courier: true }
  });

  if (!user) return userNotFound(res);

  const { errors, values } = validateUserForm(req.body, true);

  if (user.id === req.user.id && !values.isActive) {
    errors._form = 'Не можна заблокувати власний акаунт.';
  }

  if (await emailConflict(values.email, user)) {
    errors.email = 'Користувач з таким email вже існує.';
  }

  if (Object.keys(errors).length) {
    return renderUserForm(res, {
      title: 'Редагувати користувача',
      fields: buildUserFields({ values, user, isEdit: true }),
      errors,
      action: `/users/${id}`,
      submitLabel: 'Зберегти зміни',
      status: 422,
      extraAction: { label: 'Скинути пароль', userId: user.id, userName: user.fullName }
    });
  }

  try {
    const data = {
      email: values.email,
      fullName: values.fullName,
      isActive: values.isActive
    };

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data });

      if (user.freelancer) {
        await tx.freelancer.update({
          where: { id: user.freelancer.id },
          data: {
            fullName: values.fullName,
            email: values.email
          }
        });
      } else if (user.customer) {
        await tx.customer.update({
          where: { id: user.customer.id },
          data: {
            contactName: values.fullName,
            email: values.email
          }
        });
      } else if (user.courier) {
        await tx.courier.update({
          where: { id: user.courier.id },
          data: {
            fullName: values.fullName,
            email: values.email
          }
        });
      }
    });

    return res.redirect('/users');
  } catch (error) {
    return renderUserForm(res, {
      title: 'Редагувати користувача',
      fields: buildUserFields({ values, user, isEdit: true }),
      errors: { _form: 'Не вдалося зберегти зміни. Перевірте введені дані.' },
      action: `/users/${id}`,
      submitLabel: 'Зберегти зміни',
      status: 422,
      extraAction: { label: 'Скинути пароль', userId: user.id, userName: user.fullName }
    });
  }
}
