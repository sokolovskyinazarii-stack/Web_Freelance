import { renderNav } from './shell.js';
import { route } from './router.js';

const toggle = document.getElementById('menu-toggle');

renderNav(document.getElementById('nav'));

function closeMenu() {
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');
}

window.addEventListener('hashchange', () => {
  closeMenu();
  route();
});

document.addEventListener('click', (event) => {
  const row = event.target.closest('[data-href]');
  if (row) {
    window.location.hash = row.dataset.href;
    return;
  }

  if (event.target.closest('[data-reload]')) {
    route();
    return;
  }

  if (event.target.closest('#menu-toggle')) {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    return;
  }

  if (!event.target.closest('.site-header')) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const row = event.target.closest('tr[data-href]');
  if (row) window.location.hash = row.dataset.href;
});

route();
