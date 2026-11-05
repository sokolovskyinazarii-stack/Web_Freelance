import { prisma } from '../../db/client.js';
import { buildUserFields, getRoleOptions } from '../../auth/forms/user-form.js';
import { renderUserForm, userNotFound } from '../../auth/views/user-view.js';

export async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    include: { role: true, freelancer: true, customer: true, courier: true },
    orderBy: { createdAt: 'desc' }
  });

  res.render('users/list.njk', {
    title: 'Користувачі',
    active: 'users',
    users
  });
}

export async function newUserForm(req, res) {
  const roles = await getRoleOptions();
  const fields = buildUserFields({ roles, isEdit: false });

  return renderUserForm(res, {
    title: 'Створити користувача',
    fields,
    action: '/users',
    submitLabel: 'Створити'
  });
}

export async function editUserForm(req, res) {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true, freelancer: true, customer: true, courier: true }
  });

  if (!user) return userNotFound(res);

  return renderUserForm(res, {
    title: 'Редагувати користувача',
    fields: buildUserFields({ user, isEdit: true }),
    action: `/users/${id}`,
    submitLabel: 'Зберегти зміни',
    extraAction: { label: 'Скинути пароль', userId: user.id, userName: user.fullName }
  });
}
