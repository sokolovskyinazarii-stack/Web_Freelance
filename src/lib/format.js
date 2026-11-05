const moneyFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export function money(value) {
  return `$${moneyFormat.format(Number(value) || 0)}`;
}

export function date(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : dateFormat.format(parsed);
}

export function plural(value, one, few, many) {
  const amount = Math.abs(Number(value)) % 100;
  const last = amount % 10;

  if (amount > 10 && amount < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function initials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
