export function flashMessage(query) {
  if (query.created) return { type: 'success', text: 'Запис успішно створено.' };
  if (query.updated) return { type: 'success', text: 'Зміни збережено.' };
  if (query.password) return { type: 'success', text: 'Пароль успішно змінено.' };
  if (query.published) return { type: 'success', text: 'Замовлення опубліковано.' };
  if (query.rejected) return { type: 'success', text: 'Замовлення відхилено.' };
  if (query.resubmitted) return { type: 'success', text: 'Замовлення повторно надіслано на модерацію.' };
  if (query.applied) return { type: 'success', text: 'Заявку подано.' };
  if (query.accepted) return { type: 'success', text: 'Фрілансера обрано.' };
  if (query.applicationRejected) return { type: 'success', text: 'Заявку відхилено.' };
  if (query.freelancerCancelled) return { type: 'success', text: 'Фрілансера скасовано.' };
  if (query.submitted) return { type: 'success', text: 'Роботу надіслано на перевірку.' };
  if (query.workAccepted) return { type: 'success', text: 'Роботу прийнято.' };
  if (query.rework) return { type: 'success', text: 'Роботу повернуто на доопрацювання.' };
  if (query.cancelled) return { type: 'success', text: 'Замовлення скасовано.' };
  if (query.deliveryRequested) return { type: 'success', text: 'Доставку створено.' };
  if (query.deliveryAccepted) return { type: 'success', text: 'Доставку прийнято.' };
  if (query.deliveryUpdated) return { type: 'success', text: 'Статус доставки оновлено.' };
  if (query.reviewed) return { type: 'success', text: 'Відгук збережено.' };
  if (query.completed) return { type: 'success', text: 'Доставку позначено виконаною.' };
  if (query.deleted) return { type: 'success', text: 'Запис видалено.' };
  if (query.error === 'related') {
    return { type: 'error', text: 'Спочатку підтвердьте видалення пов’язаних записів.' };
  }
  if (query.error === 'db') {
    return { type: 'error', text: 'Не вдалося видалити запис. Спробуйте ще раз.' };
  }
  return null;
}
