function syncHeader(doc) {
  const header = document.querySelector('.site-header');
  const nextHeader = doc.querySelector('.site-header');
  if (!header || !nextHeader) return;

  header.className = nextHeader.className;

  const currentAccount = header.querySelector('.account-nav');
  const nextAccount = nextHeader.querySelector('.account-nav');

  if (currentAccount && nextAccount) {
    currentAccount.replaceWith(nextAccount);
  } else if (!currentAccount && nextAccount) {
    header.insertBefore(nextAccount, header.querySelector('.menu-toggle'));
  } else if (currentAccount && !nextAccount) {
    currentAccount.remove();
  }
}

function replaceView(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nextView = doc.getElementById('view');
  if (!nextView) return false;

  document.getElementById('view').innerHTML = nextView.innerHTML;
  document.getElementById('nav').innerHTML = doc.getElementById('nav').innerHTML;
  syncHeader(doc);
  document.title = doc.title;
  document.querySelectorAll('.modal:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.body.classList.remove('modal-open', 'nav-open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
  window.initSearchableSelects?.();
  window.initSteppers?.();
  return true;
}

async function submitForm(form) {
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.disabled = true;
  form.dataset.loading = 'true';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'X-Requested-With': 'fetch' },
      body: new URLSearchParams(new FormData(form))
    });
    const html = await response.text();

    if (!replaceView(html)) throw new Error('view');

    if (response.redirected) {
      const method = form.id === 'delete-form' ? 'replaceState' : 'pushState';
      history[method]({}, '', response.url);
    }

    if (response.ok) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstError = document.querySelector('.field-error, .alert-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } catch (error) {
    console.error('AJAX submit failed', error);
    if (submit) submit.disabled = false;
    form.dataset.loading = 'false';
    form.submit();
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!form.matches('.entity-form, #delete-form, .ajax-form')) return;
  event.preventDefault();
  submitForm(form);
});

window.addEventListener('popstate', async () => {
  try {
    const response = await fetch(window.location.href, {
      headers: { 'X-Requested-With': 'fetch' }
    });
    const html = await response.text();
    replaceView(html);
  } catch (error) {
    window.location.reload();
  }
});
