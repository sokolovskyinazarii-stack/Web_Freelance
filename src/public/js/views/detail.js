import { esc } from '../format.js';
import { icon } from '../icon.js';
import { fieldMarkup, metricMarkup, relationMarkup } from '../components.js';

function heroMarkup(entity, row) {
  const { detail } = entity;
  const aside = detail.aside
    ? detail.aside(row)
    : `<span class="detail-icon accent-${entity.accent}">${icon(entity.icon)}</span>`;

  return `
    <section class="detail-hero accent-${entity.accent}">
      <div class="detail-identity">
        ${aside}
        <div>
          <h1>${esc(detail.title(row))}</h1>
          <p>${esc(detail.subtitle(row))}</p>
        </div>
      </div>
      <div class="detail-side">${detail.badge ? detail.badge(row) : ''}</div>
    </section>`;
}

function fieldsMarkup(row, fields) {
  if (!fields?.length) return '';
  const body = fields.map((field) => fieldMarkup(row, field)).join('');

  return `
    <section class="panel detail-panel">
      <header class="panel-head">
        <h3>Дані</h3>
      </header>
      <dl class="field-grid">${body}</dl>
    </section>`;
}

export function renderDetail(view, entity, row) {
  const { detail } = entity;
  const title = detail.title(row);

  view.innerHTML = `
    <nav class="crumbs">
      <a href="#/${entity.key}">${esc(entity.label)}</a>
      <span>/</span>
      <span>${esc(title)}</span>
    </nav>
    ${heroMarkup(entity, row)}
    ${detail.metrics ? metricMarkup(row, detail.metrics) : ''}
    ${fieldsMarkup(row, detail.fields)}
    ${(detail.relations || []).map((relation) => relationMarkup(row, relation)).join('')}`;
}
