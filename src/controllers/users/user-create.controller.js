import bcrypt from 'bcryptjs';
import { prisma } from '../../db/client.js';
import { validateUserForm } from '../../auth/validation/index.js';
import { buildUserFields, getRoleOptions } from '../../auth/forms/user-form.js';
import { createProfile, emailConflict } from '../../auth/services/user-service.js';
import { renderUserForm } from '../../auth/views/user-view.js';

export async function createUser(req, res) {
  const { errors, values, password } = validateUserForm(req.body, false);
  const roles = await getRoleOptions();

  if (Object.keys(errors).length) {
    return renderUserForm(res, {
      title: 'Створити користувача',
      fields: buildUserFields({ values, roles, isEdit: false }),
      errors,
      action: '/users',
      submitLabel: 'Створити',
      status: 422
    });
  }

  try {
    const role = await prisma.role.findUnique({ where: { id: values.roleId } });

    if (!role || role.code === 'GUEST') {
      return renderUserForm(res, {
        title: 'Створити користувача',
        fields: buildUserFields({ values, roles, isEdit: false }),
        errors: { roleId: 'Оберіть коректну роль.' },
        action: '/users',
        submitLabel: 'Створити',
        status: 422
      });
    }

    if (await emailConflict(values.email)) {
      return renderUserForm(res, {
        title: 'Створити користувача',
        fields: buildUserFields({ values, roles, isEdit: false }),
        errors: { email: 'Користувач з таким email вже існує.' },
        action: '/users',
        submitLabel: 'Створити',
        status: 422
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: values.email,
          passwordHash,
          fullName: values.fullName,
          phone: values.phone,
          roleId: role.id,
          isActive: values.isActive
        }
      });
      await createProfile(tx, role, user, values);
    });

    return res.redirect('/users');
  } catch (error) {
    return renderUserForm(res, {
      title: 'Створити користувача',
      fields: buildUserFields({ values, roles, isEdit: false }),
      errors: { _form: 'Не вдалося створити користувача. Перевірте введені дані.' },
      action: '/users',
      submitLabel: 'Створити',
      status: 422
    });
  }
}
