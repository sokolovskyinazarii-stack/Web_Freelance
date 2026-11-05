(function () {
  const passwordModal = document.getElementById('password-modal');
  const passwordForm = document.getElementById('password-form');
  const passwordUser = document.getElementById('password-modal-user');
  const passwordResult = document.getElementById('password-result');
  const passwordValue = document.getElementById('password-value');
  const passwordSubmit = passwordForm?.querySelector('[type="submit"]');

  function closePasswordModal() {
    if (!passwordModal) return;
    passwordModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function openPasswordModal(button) {
    if (!passwordModal) return;

    const resource = button.dataset.resource || 'users';
    const id = button.dataset.id || button.dataset.userId;

    passwordForm.action = resource === 'users'
      ? `/users/${id}/password`
      : `/users/password/${resource}/${id}`;
    passwordUser.textContent = button.dataset.userName || '';
    passwordForm.hidden = false;
    passwordResult.hidden = true;
    passwordValue.textContent = '';
    passwordSubmit.disabled = false;
    passwordSubmit.textContent = 'Згенерувати новий пароль';
    passwordModal.hidden = false;
    document.body.classList.add('modal-open');
    passwordSubmit.focus();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-password]');
    if (button) {
      event.preventDefault();
      openPasswordModal(button);
      return;
    }

    if (event.target.closest('[data-password-close]')) {
      closePasswordModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && passwordModal && !passwordModal.hidden) {
      closePasswordModal();
    }
  });

  passwordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    passwordSubmit.disabled = true;
    passwordSubmit.textContent = 'Генеруємо...';

    try {
      const response = await fetch(passwordForm.action, {
        method: 'POST',
        headers: { 'X-Requested-With': 'fetch', Accept: 'application/json' }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      passwordValue.textContent = data.password;
      passwordForm.hidden = true;
      passwordResult.hidden = false;
      passwordResult.querySelector('[data-copy]')?.focus();
    } catch (error) {
      passwordSubmit.disabled = false;
      passwordSubmit.textContent = 'Спробувати ще раз';
    }
  });
})();
