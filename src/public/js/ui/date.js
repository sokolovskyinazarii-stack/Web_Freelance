(function () {
  const MONTHS = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень'
  ];
  const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const pad = (value) => String(value).padStart(2, '0');

  function parseISO(value) {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function toISO(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatDate(value) {
    const date = parseISO(value);
    if (!date) return '';
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function createDatePicker(input) {
    const wrapper = document.createElement('div');
    wrapper.className = 'date-field';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.classList.add('date-native');
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'date-trigger';
    const baseId = input.id || `date-${Math.random().toString(36).slice(2, 10)}`;
    trigger.id = `${baseId}-date-trigger`;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    const value = document.createElement('span');
    value.className = 'date-value';
    trigger.appendChild(value);

    const icon = document.createElement('span');
    icon.className = 'date-icon';
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>';
    trigger.appendChild(icon);

    const menu = document.createElement('div');
    menu.className = 'date-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Календар');
    wrapper.append(trigger, menu);

    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) label.htmlFor = trigger.id;

    let view = parseISO(input.value) || new Date();
    view = new Date(view.getFullYear(), view.getMonth(), 1);

    function updateValue() {
      const formatted = formatDate(input.value);
      value.textContent = formatted || input.dataset.placeholder || 'Оберіть дату';
      trigger.classList.toggle('empty', !formatted);
    }

    function open() {
      document.querySelectorAll('.date-field').forEach((other) => {
        if (other === wrapper) return;
        other.querySelector('.date-menu').hidden = true;
        other.querySelector('.date-trigger')?.setAttribute('aria-expanded', 'false');
      });

      const selected = parseISO(input.value);
      const base = selected || new Date();
      view = new Date(base.getFullYear(), base.getMonth(), 1);
      render();

      const rect = trigger.getBoundingClientRect();
      menu.classList.toggle('date-menu-right', rect.left + 320 > window.innerWidth - 16);
      menu.classList.toggle('date-menu-up', rect.bottom + 360 > window.innerHeight);

      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }

    function close() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    function shiftMonth(delta) {
      view = new Date(view.getFullYear(), view.getMonth() + delta, 1);
      render();
    }

    function render() {
      const title = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
      menu.innerHTML = '';

      const head = document.createElement('div');
      head.className = 'date-head';

      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'date-nav';
      prev.setAttribute('aria-label', 'Попередній місяць');
      prev.textContent = '‹';
      prev.addEventListener('click', () => shiftMonth(-1));

      const caption = document.createElement('span');
      caption.className = 'date-title';
      caption.textContent = title;

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'date-nav';
      next.setAttribute('aria-label', 'Наступний місяць');
      next.textContent = '›';
      next.addEventListener('click', () => shiftMonth(1));

      head.append(prev, caption, next);

      const grid = document.createElement('div');
      grid.className = 'date-grid';

      WEEKDAYS.forEach((day) => {
        const weekday = document.createElement('span');
        weekday.className = 'date-weekday';
        weekday.textContent = day;
        grid.appendChild(weekday);
      });

      const first = new Date(view.getFullYear(), view.getMonth(), 1);
      const offset = (first.getDay() + 6) % 7;
      const start = new Date(first);
      start.setDate(1 - offset);
      const selected = parseISO(input.value);
      const today = new Date();

      for (let index = 0; index < 42; index += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + index);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'date-day';
        button.textContent = String(day.getDate());
        button.setAttribute('aria-label', formatDate(toISO(day)));

        if (day.getMonth() !== view.getMonth()) button.classList.add('outside');
        if (sameDay(day, today)) button.classList.add('today');
        if (selected && sameDay(day, selected)) button.classList.add('selected');

        button.addEventListener('click', () => {
          input.value = toISO(day);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          updateValue();
          close();
          trigger.focus({ preventScroll: true });
        });

        grid.appendChild(button);
      }

      menu.append(head, grid);

      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'date-clear';
      clear.textContent = 'Очистити';
      clear.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        updateValue();
        close();
        trigger.focus({ preventScroll: true });
      });
      menu.appendChild(clear);
    }

    trigger.addEventListener('click', () => {
      if (menu.hidden) open();
      else close();
    });

    document.addEventListener('click', (event) => {
      if (wrapper.contains(event.target)) return;
      if (!menu.hidden) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) close();
    });

    input.addEventListener('change', updateValue);
    updateValue();
  }

  function initDatePickers() {
    document.querySelectorAll('input[type="date"]').forEach((input) => {
      if (!input.closest('.date-field')) createDatePicker(input);
    });
  }

  initDatePickers();
  window.initDatePickers = initDatePickers;
})();
