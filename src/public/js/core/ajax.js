function syncHeader(doc) {
  const header = document.querySelector('.masthead');
  const nextHeader = doc.querySelector('.masthead');
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

function adjacentAlert(element) {
  const previous = element?.previousElementSibling;
  return previous?.classList?.contains('alert') ? previous : null;
}

function replaceView(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nextView = doc.getElementById('view');
  if (!nextView) return false;

  const view = document.getElementById('view');
  view.innerHTML = nextView.innerHTML;
  document.getElementById('nav').innerHTML = doc.getElementById('nav').innerHTML;
  syncHeader(doc);
  document.title = doc.title;
  document.querySelectorAll('.modal:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.body.classList.remove('modal-open', 'nav-open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');

  // Після AJAX-переходу контент показуємо одразу: без ефекту перезавантаження.
  window.initReveal?.(view, { instant: true });
  window.initSearchableSelects?.();
  window.initSteppers?.();
  window.initDatePickers?.();
  return true;
}

function findMatchingForm(doc, form) {
  const action = form.getAttribute('action');
  return Array.from(doc.querySelectorAll('form')).find(
    (candidate) =>
      candidate.getAttribute('action') === action &&
      candidate.querySelector('[type="submit"]')
  );
}

function updateFormInPlace(form, html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nextForm = findMatchingForm(doc, form);
  if (!nextForm) return false;

  const scrollY = window.scrollY;

  const oldAlert = adjacentAlert(form);
  const newAlert = adjacentAlert(nextForm);
  if (newAlert) {
    if (oldAlert) oldAlert.replaceWith(newAlert);
    else form.parentNode.insertBefore(newAlert, form);
  } else if (oldAlert) {
    oldAlert.remove();
  }

  // Нова форма вже в потоці сторінки — не ховаємо її під reveal-анімацію.
  nextForm.removeAttribute('data-reveal');
  nextForm.querySelectorAll('[data-reveal]').forEach((element) => element.removeAttribute('data-reveal'));
  nextForm.classList.add('is-visible');

  form.replaceWith(nextForm);
  window.scrollTo({ top: scrollY, behavior: 'auto' });

  window.initSearchableSelects?.();
  window.initSteppers?.();
  window.initDatePickers?.();

  const firstError = nextForm.querySelector('.field-error');
  const field = firstError?.closest('.form-field');
  const control = field?.querySelector('input, select, textarea');
  const errorTarget = firstError || adjacentAlert(nextForm);

  if (control) control.focus({ preventScroll: true });

  if (errorTarget) {
    const rect = errorTarget.getBoundingClientRect();
    if (rect.top < 90 || rect.bottom > window.innerHeight - 16) {
      errorTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return true;
}

async function submitForm(form) {
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.disabled = true;
  form.dataset.loading = 'true';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'fetch',
        Accept: 'text/html'
      },
      body: new URLSearchParams(new FormData(form))
    });
    const html = await response.text();
    const finalUrl = response.url || window.location.href;
    const samePage = new URL(finalUrl, window.location.href).pathname === window.location.pathname;
    const samePageError = response.redirected && samePage && /[?&]error=/.test(new URL(finalUrl).search);

    // Помилки валідності не перемальовують сторінку: оновлюємо лише форму.
    if ((response.status === 422 || samePageError) && updateFormInPlace(form, html)) {
      if (response.redirected) history.replaceState({}, '', finalUrl);
      return;
    }

    if (!replaceView(html)) throw new Error('view');

    if (response.redirected) {
      const method = form.id === 'delete-form' ? 'replaceState' : 'pushState';
      history[method]({}, '', response.url);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    if (!response.ok) {
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
