export function flashMessage(query) {
  if (query.created) return { type: 'success', text: 'Запис успішно створено.' };
  if (query.updated) return { type: 'success', text: 'Зміни збережено.' };
  if (query.deleted) return { type: 'success', text: 'Запис видалено.' };
  if (query.error === 'related') {
    return { type: 'error', text: 'Спочатку підтвердьте видалення пов’язаних записів.' };
  }
  if (query.error === 'db') {
    return { type: 'error', text: 'Не вдалося видалити запис. Спробуйте ще раз.' };
  }
  return null;
}
