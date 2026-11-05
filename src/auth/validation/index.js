const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s()-]{10,20}$/;

export function validateRegistration(body) {
  const errors = {};
  const values = {
    role: body.role || 'CLIENT',
    fullName: String(body.fullName || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    phone: String(body.phone || '').trim(),
    city: String(body.city || '').trim()
  };
  const password = String(body.password || '');
  const passwordConfirm = String(body.passwordConfirm || '');

  if (!['CLIENT', 'FREELANCER'].includes(values.role)) {
    errors.role = 'Оберіть роль замовника або фрілансера.';
  }
  if (values.fullName.length < 5) errors.fullName = 'ПІБ має містити щонайменше 5 символів.';
  if (!emailPattern.test(values.email)) errors.email = 'Введіть коректну email-адресу.';
  if (!phonePattern.test(values.phone)) errors.phone = 'Введіть коректний номер телефону.';
  if (values.city.length < 2) errors.city = 'Вкажіть місто.';
  if (password.length < 8) errors.password = 'Пароль має містити щонайменше 8 символів.';
  if (password !== passwordConfirm) errors.passwordConfirm = 'Паролі не збігаються.';

  return { errors, values, password };
}

export function validateUserForm(body, isEdit) {
  const errors = {};
  const values = {
    fullName: String(body.fullName || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    phone: String(body.phone || '').trim(),
    city: String(body.city || '').trim(),
    roleId: body.roleId ? Number(body.roleId) : null,
    isActive: body.isActive !== 'false'
  };
  const password = String(body.password || '');

  if (values.fullName.length < 5) errors.fullName = 'ПІБ має містити щонайменше 5 символів.';
  if (!emailPattern.test(values.email)) errors.email = 'Введіть коректну email-адресу.';

  if (!isEdit) {
    if (!phonePattern.test(values.phone)) errors.phone = 'Введіть коректний номер телефону.';
    if (values.city.length < 2) errors.city = 'Вкажіть місто.';
    if (!values.roleId) errors.roleId = 'Оберіть роль.';
    if (password.length < 8) errors.password = 'Пароль має містити щонайменше 8 символів.';
  }

  return { errors, values, password };
}

export function validateProfile(body, user) {
  const errors = {};
  const values = { phone: String(body.phone || '').trim() };

  if (!phonePattern.test(values.phone)) errors.phone = 'Введіть коректний номер телефону.';

  if (user.freelancer) {
    const rawRate = String(body.hourlyRate ?? '').trim();

    values.city = String(body.city || '').trim();
    values.specialty = String(body.specialty || '').trim();
    values.hourlyRate = Number(rawRate);
    values.bio = String(body.bio || '').trim();

    if (values.city.length < 2) errors.city = 'Вкажіть місто.';
    if (values.specialty.length < 2) errors.specialty = 'Вкажіть спеціальність.';
    if (!rawRate || !Number.isFinite(values.hourlyRate) || values.hourlyRate < 0) {
      errors.hourlyRate = 'Вкажіть коректну ставку.';
    }
    if (values.bio.length > 400) errors.bio = 'Опис має містити не більше 400 символів.';
  }

  if (user.customer) {
    values.companyName = String(body.companyName || '').trim();
    values.city = String(body.city || '').trim();

    if (values.companyName.length < 2) errors.companyName = 'Вкажіть назву компанії.';
    if (values.city.length < 2) errors.city = 'Вкажіть місто.';
  }

  if (user.courier) {
    values.vehicle = String(body.vehicle || '').trim();
    values.zone = String(body.zone || '').trim();

    if (!values.vehicle) errors.vehicle = 'Оберіть транспорт.';
    if (values.zone.length < 2) errors.zone = 'Вкажіть зону доставки.';
  }

  return { errors, values };
}

export function validatePasswordChange(body) {
  const errors = {};
  const current = String(body.currentPassword || '');
  const password = String(body.password || '');
  const passwordConfirm = String(body.passwordConfirm || '');

  if (!current) errors.currentPassword = 'Введіть поточний пароль.';
  if (password.length < 8) errors.password = 'Пароль має містити щонайменше 8 символів.';
  if (password !== passwordConfirm) errors.passwordConfirm = 'Паролі не збігаються.';
  if (current && current === password) {
    errors.password = 'Новий пароль має відрізнятися від поточного.';
  }

  return { errors, current, password };
}
