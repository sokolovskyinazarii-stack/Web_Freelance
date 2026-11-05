const deliveryStates = {
  pending: ['Очікує', '#fbbf24'],
  in_transit: ['У дорозі', '#22d3ee'],
  delivered: ['Доставлено', '#4ade80'],
  failed: ['Не доставлено', '#fb7185']
};

export const text = (value) => ({ type: 'text', value });
export const mono = (value) => ({ type: 'mono', value });
export const moneyCell = (value, suffix = '') => ({ type: 'money', value, suffix });
export const dateCell = (value) => ({ type: 'date', value });
export const person = (name, meta, accent = 'violet') => ({ type: 'person', name, meta, accent });
export const badge = (label, tone = '#98a1b1') => ({ type: 'badge', label, tone });
export const tag = (value) => ({ type: 'tag', value });
export const paragraph = (value) => ({ type: 'paragraph', value });
export const avatar = (name, accent = 'violet', size = '') => ({ type: 'avatar', name, accent, size });
export const rating = (value) => ({ type: 'rating', value: Number(value).toFixed(1) });

export function statusBadge(status) {
  return status ? badge(status.name, status.color) : badge('Без статусу');
}

export function deliveryBadge(value) {
  const [label, tone] = deliveryStates[value] || [value, '#98a1b1'];
  return badge(label, tone);
}

export function activeBadge(isActive) {
  return badge(isActive ? 'На лінії' : 'Поза зміною', isActive ? '#4ade80' : '#98a1b1');
}

export function deadlineBadge(value) {
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return badge('Без дедлайну');
  if (days < 0) return badge('Прострочено', '#fb7185');
  if (days <= 7) return badge(`${days} дн.`, '#fbbf24');
  return badge(`${days} дн.`, '#98a1b1');
}
