export function renderUserForm(res, {
  title,
  fields,
  errors = {},
  action,
  submitLabel,
  status = 200,
  extraAction = null
}) {
  return res.status(status).render('shared/form.njk', {
    title,
    active: 'users',
    config: { label: 'Користувачі' },
    fields,
    errors,
    action,
    cancelHref: '/users',
    submitLabel,
    extraAction
  });
}

export function userNotFound(res) {
  return res.status(404).render('shared/error.njk', {
    title: 'Користувача не знайдено',
    message: 'Можливо, акаунт видалено або вказано неправильний ідентифікатор.',
    active: 'users'
  });
}
