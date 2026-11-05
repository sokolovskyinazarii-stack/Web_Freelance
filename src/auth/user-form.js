import { prisma } from '../db/client.js';

export async function getRoleOptions() {
  const roles = await prisma.role.findMany({
    where: { code: { not: 'GUEST' } },
    orderBy: { id: 'asc' }
  });

  return roles.map((role) => ({ value: String(role.id), label: role.name }));
}

export function buildUserFields({ values = {}, user = null, roles = [], isEdit = false }) {
  const fields = [
    {
      name: 'fullName',
      label: 'ПІБ',
      type: 'text',
      required: true,
      value: values.fullName ?? user?.fullName ?? ''
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      value: values.email ?? user?.email ?? ''
    }
  ];

  if (!isEdit) {
    fields.push(
      {
        name: 'phone',
        label: 'Телефон',
        type: 'tel',
        required: true,
        value: values.phone ?? ''
      },
      {
        name: 'city',
        label: 'Місто',
        type: 'text',
        required: true,
        value: values.city ?? ''
      },
      {
        name: 'roleId',
        label: 'Роль',
        type: 'select',
        required: true,
        options: roles,
        value: String(values.roleId ?? '')
      }
    );
  }

  if (!isEdit) {
    fields.push({
      name: 'password',
      label: 'Пароль',
      type: 'password',
      required: true,
      value: ''
    });
  }

  fields.push({
    name: 'isActive',
    label: 'Статус',
    type: 'select',
    required: true,
    options: [
      { value: 'true', label: 'Активний' },
      { value: 'false', label: 'Заблокований' }
    ],
    value: String(values.isActive ?? user?.isActive ?? true)
  });

  return fields;
}
