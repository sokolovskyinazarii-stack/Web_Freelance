const toggle = document.getElementById('menu-toggle');

toggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  const row = event.target.closest('[data-href]');
  if (row) {
    window.location.href = row.dataset.href;
    return;
  }

  if (!event.target.closest('.site-header')) {
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const row = event.target.closest('tr[data-href]');
  if (row) window.location.href = row.dataset.href;
});
