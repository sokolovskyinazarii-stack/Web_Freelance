import { plural } from '../lib/format.js';

const deliveryStates = {
  offered: ['Очікує кур’єра', '#e6b567'],
  pending: ['Очікує', '#e6b567'],
  in_transit: ['У дорозі', '#86c8dd'],
  delivered: ['Доставлено', '#8fdfb4'],
  failed: ['Не доставлено', '#ff9a86']
};

export const text = (value) => ({ type: 'text', value });
export const mono = (value) => ({ type: 'mono', value });
export const moneyCell = (value, suffix = '') => ({ type: 'money', value, suffix });
export const dateCell = (value) => ({ type: 'date', value });
export const person = (name, meta, accent = 'violet') => ({ type: 'person', name, meta, accent });
export const badge = (label, tone = '#8a9086') => ({ type: 'badge', label, tone });
export const tag = (value) => ({ type: 'tag', value });
export const paragraph = (value) => ({ type: 'paragraph', value });
export const avatar = (name, accent = 'violet', size = '') => ({ type: 'avatar', name, accent, size });
export const rating = (value) => ({ type: 'rating', value: Number(value).toFixed(1) });

export function statusBadge(status) {
  return status ? badge(status.name, status.color) : badge('Без статусу');
}

export function deliveryBadge(value) {
  const [label, tone] = deliveryStates[value] || [value, '#8a9086'];
  return badge(label, tone);
}

export function activeBadge(isActive) {
  return badge(isActive ? 'На лінії' : 'Поза зміною', isActive ? '#8fdfb4' : '#8a9086');
}

export function deadlineBadge(value) {
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return badge('Без дедлайну');

  if (days < 0) {
    const late = Math.abs(days);
    return badge(`Прострочено на ${late} ${plural(late, 'день', 'дні', 'днів')}`, '#ff9a86');
  }

  if (days === 0) return badge('Дедлайн сьогодні', '#e6b567');

  return badge(
    `${days} ${plural(days, 'день', 'дні', 'днів')} до дедлайну`,
    days <= 7 ? '#e6b567' : '#8a9086'
  );
}
