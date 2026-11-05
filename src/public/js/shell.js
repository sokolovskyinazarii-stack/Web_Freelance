import { entities } from './entities/index.js';

const items = [
  { key: 'overview', label: 'Огляд' },
  ...Object.values(entities).map((entity) => ({
    key: entity.key,
    label: entity.label
  }))
];

export function renderNav(container) {
  container.innerHTML = items
    .map(
      (item) => `
        <a class="nav-link" href="#/${item.key}" data-nav="${item.key}">
          ${item.label}
        </a>`
    )
    .join('');
}

export function setActive(key) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === key);
  });
}

export function setTitle(title) {
  document.title = `${title} · FreelanceHub`;
}
