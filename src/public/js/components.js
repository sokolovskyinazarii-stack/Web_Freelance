import { avatar, esc } from './format.js';

export function person(name, meta, accent = 'violet') {
  return `
    <div class="person">
      ${avatar(name, accent)}
      <span class="person-text">
        <strong>${esc(name)}</strong>
        <small>${esc(meta)}</small>
      </span>
    </div>`;
}

function cell(column, row) {
  const content = column.render ? column.render(row) : esc(column.value(row));
  return `<td class="${column.align === 'right' ? 'align-right' : ''}">${content}</td>`;
}

export function tableMarkup(columns, rows, resource) {
  const head = columns
    .map(
      (column) =>
        `<th class="${column.align === 'right' ? 'align-right' : ''}">${esc(column.label)}</th>`
    )
    .join('');

  if (!rows.length) {
    return `
      <div class="empty-state">
        <strong>Нічого не знайдено</strong>
        <p>Спробуйте змінити пошуковий запит.</p>
      </div>`;
  }

  const body = rows
    .map((row) => {
      const link = resource ? ` tabindex="0" data-href="#/${resource}/${row.id}"` : '';
      return `<tr${link}>${columns.map((column) => cell(column, row)).join('')}</tr>`;
    })
    .join('');

  return `
    <table class="data-table">
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>`;
}

export function metricMarkup(row, metrics) {
  const cards = metrics
    .map(
      (metric) => `
        <article class="metric-card accent-${metric.accent || 'violet'}">
          <span class="metric-label">${esc(metric.label)}</span>
          <strong>${metric.render ? metric.render(row) : esc(metric.value(row))}</strong>
          ${metric.hint ? `<small>${esc(metric.hint(row))}</small>` : ''}
        </article>`
    )
    .join('');

  return `<section class="metric-grid">${cards}</section>`;
}

export function fieldMarkup(row, field) {
  const content = field.render ? field.render(row) : esc(field.value(row));
  return `
    <div class="field${field.wide ? ' field-wide' : ''}">
      <dt>${esc(field.label)}</dt>
      <dd>${content}</dd>
    </div>`;
}

export function relationMarkup(row, relation) {
  const items = relation.items(row) || [];
  const body = items.length
    ? tableMarkup(relation.columns, items, relation.resource)
    : `<div class="empty-state"><strong>Порожньо</strong><p>${esc(relation.empty || 'Пов’язаних записів немає.')}</p></div>`;

  return `
    <section class="panel relation-panel">
      <header class="panel-head">
        <h3>${esc(relation.title)}</h3>
        <span>${items.length}</span>
      </header>
      <div class="table-wrap">${body}</div>
    </section>`;
}
