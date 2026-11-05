import { esc } from '../format.js';
import { icon } from '../icon.js';
import { tableMarkup } from '../components.js';

export function renderList(view, entity, rows) {
  const { list } = entity;

  view.innerHTML = `
    <section class="page-head">
      <h1>${esc(list.title)}</h1>
      <div class="page-tools">
        <label class="search">
          ${icon('search')}
          <input id="list-search" type="search" placeholder="${esc(list.searchHint)}" autocomplete="off">
        </label>
      </div>
    </section>
    <section class="panel table-panel">
      <div class="table-wrap" id="list-body">
        ${tableMarkup(list.columns, rows, entity.key)}
      </div>
    </section>`;

  const input = view.querySelector('#list-search');
  const body = view.querySelector('#list-body');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const filtered = rows.filter((row) => list.search(row).toLowerCase().includes(query));

    body.innerHTML = tableMarkup(list.columns, filtered, entity.key);
  });
}
