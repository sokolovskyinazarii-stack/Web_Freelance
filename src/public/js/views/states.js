import { esc } from '../format.js';

export function renderSkeleton(view) {
  view.innerHTML = `
    <div class="skeleton-grid">
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton wide"></div>
    </div>`;
}

export function renderError(view, error) {
  view.innerHTML = `
    <section class="panel">
      <div class="empty-state">
        <strong>Не вдалося завантажити дані</strong>
        <p>${esc(error.message)}</p>
        <button class="btn btn-ghost" data-reload>Спробувати ще раз</button>
      </div>
    </section>`;
}

export function renderNotFound(view) {
  view.innerHTML = `
    <section class="panel">
      <div class="empty-state">
        <strong>Сторінку не знайдено</strong>
        <p>Перевірте адресу або поверніться до огляду платформи.</p>
        <a class="btn btn-primary" href="#/">На головну</a>
      </div>
    </section>`;
}
