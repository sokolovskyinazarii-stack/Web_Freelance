const modal = document.getElementById('delete-modal');

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

async function prepareDelete(button) {
  if (!modal) return;

  const resource = button.dataset.resource;
  const id = button.dataset.id;
  const title = button.dataset.title || '';
  const form = document.getElementById('delete-form');
  const name = document.getElementById('delete-name');
  const warning = document.getElementById('delete-warning');
  const list = document.getElementById('delete-related');
  const checkbox = document.getElementById('cascade-check');
  const submit = document.getElementById('delete-submit');

  form.action = `/${resource}/${id}/delete`;
  name.textContent = title;
  list.innerHTML = '';
  warning.hidden = true;
  checkbox.checked = false;
  submit.disabled = true;
  modal.hidden = false;
  document.body.classList.add('modal-open');

  try {
    const response = await fetch(`/api/${resource}/${id}/related`);
    const data = await response.json();

    if (data.total > 0) {
      warning.hidden = false;
      for (const item of data.related) {
        const li = document.createElement('li');
        li.textContent = `${item.label}: ${item.count}`;
        list.appendChild(li);
      }
      submit.disabled = true;
    } else {
      submit.disabled = false;
    }
  } catch (error) {
    submit.disabled = false;
  }

  if (modal.hidden) return;
  (warning.hidden ? submit : checkbox)?.focus();
}

document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton) {
    prepareDelete(deleteButton);
    return;
  }

  if (event.target.closest('[data-close-modal]')) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

document.addEventListener('change', (event) => {
  if (event.target.id !== 'cascade-check') return;
  const submit = document.getElementById('delete-submit');
  if (submit) submit.disabled = !event.target.checked;
});
