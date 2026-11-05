function createSelect(select) {
  const wrapper = document.createElement('div');
  wrapper.className = 'searchable-select';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.classList.add('searchable-native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'select-trigger';
  trigger.id = `${select.id}-trigger`;
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'listbox');

  const value = document.createElement('span');
  value.className = 'select-value';
  trigger.appendChild(value);

  const menu = document.createElement('div');
  menu.className = 'select-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'listbox');

  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'select-search';
  search.placeholder = 'Пошук...';
  search.autocomplete = 'off';
  search.setAttribute('aria-label', 'Пошук у списку');

  const options = document.createElement('div');
  options.className = 'select-options';

  menu.append(search, options);
  wrapper.append(trigger, menu);

  const label = document.querySelector(`label[for="${select.id}"]`);
  if (label) label.htmlFor = trigger.id;

  const allOptions = Array.from(select.options).map((option) => ({
    value: option.value,
    label: option.textContent.trim()
  }));

  function updateValue() {
    const selected = select.options[select.selectedIndex];
    const text =
      selected && selected.value
        ? selected.textContent.trim()
        : select.dataset.placeholder || 'Оберіть...';

    value.textContent = text;
    trigger.classList.toggle('empty', !selected || !selected.value);
  }

  function renderOptions(query = '') {
    const normalized = query.trim().toLowerCase();
    options.innerHTML = '';
    const filtered = allOptions.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    );

    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'select-empty';
      empty.textContent = 'Немає варіантів';
      options.appendChild(empty);
      return;
    }

    for (const option of filtered) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'select-option';
      button.textContent = option.label;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(option.value === select.value));
      button.classList.toggle('selected', option.value === select.value);
      button.classList.toggle('empty-option', !option.value);
      button.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        updateValue();
        close();
      });
      options.appendChild(button);
    }
  }

  function open() {
    document.querySelectorAll('.searchable-select').forEach((other) => {
      const otherMenu = other.querySelector('.select-menu');
      if (otherMenu && otherMenu !== menu) {
        otherMenu.hidden = true;
        other.querySelector('.select-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    search.value = '';
    renderOptions();
    search.focus();
  }

  function close() {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', () => {
    if (menu.hidden) open();
    else close();
  });

  search.addEventListener('input', () => renderOptions(search.value));
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const first = options.querySelector('.select-option');
      first?.click();
    }
    if (event.key === 'Escape') close();
  });

  select.addEventListener('change', updateValue);
  updateValue();
}

function initSearchableSelects() {
  document.querySelectorAll('select[data-searchable]').forEach((select) => {
    if (!select.closest('.searchable-select')) createSelect(select);
  });
}

document.addEventListener('click', (event) => {
  document.querySelectorAll('.searchable-select').forEach((wrapper) => {
    if (wrapper.contains(event.target)) return;

    const menu = wrapper.querySelector('.select-menu');
    const trigger = wrapper.querySelector('.select-trigger');
    if (menu && !menu.hidden) {
      menu.hidden = true;
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });
});
initSearchableSelects();
window.initSearchableSelects = initSearchableSelects;
