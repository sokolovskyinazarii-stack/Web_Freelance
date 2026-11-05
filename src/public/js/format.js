const moneyFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const symbols = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const deliveryStates = {
  pending: ['Очікує', '#f7b955'],
  in_transit: ['У дорозі', '#3dd6f5'],
  delivered: ['Доставлено', '#3ddc97'],
  failed: ['Не доставлено', '#ff6b8a']
};

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (symbol) => symbols[symbol]);
}

export function money(value) {
  return `$${moneyFormat.format(Number(value) || 0)}`;
}

export function date(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : dateFormat.format(parsed);
}

export function initials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function plural(value, one, few, many) {
  const amount = Math.abs(Number(value)) % 100;
  const last = amount % 10;

  if (amount > 10 && amount < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function avatar(name, accent = 'violet', size = '') {
  return `<span class="avatar avatar-${accent} ${size}">${esc(initials(name))}</span>`;
}

export function rating(value) {
  return `<span class="rating">★ ${Number(value).toFixed(1)}</span>`;
}

export function badge(text, tone = '#8c98b5') {
  return `<span class="badge" style="--tone:${tone}">${esc(text)}</span>`;
}

export function statusBadge(status) {
  return status ? badge(status.name, status.color) : badge('Без статусу');
}

export function deliveryBadge(value) {
  const [label, tone] = deliveryStates[value] || [value, '#8c98b5'];
  return badge(label, tone);
}

export function activeBadge(isActive) {
  return badge(isActive ? 'На лінії' : 'Поза зміною', isActive ? '#3ddc97' : '#8c98b5');
}

export function deadlineBadge(value) {
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return badge('Без дедлайну');
  if (days < 0) return badge('Прострочено', '#ff6b8a');
  if (days <= 7) return badge(`${days} дн.`, '#f7b955');
  return badge(`${days} дн.`, '#8c98b5');
}
