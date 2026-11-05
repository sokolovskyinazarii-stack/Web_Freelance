import { avatar, esc, money, plural, rating, statusBadge } from '../format.js';
import { person, tableMarkup } from '../components.js';

const statCard = (label, value, note) => `
  <article class="stat-card">
    <span class="stat-label">${esc(label)}</span>
    <strong class="stat-value">${esc(value)}</strong>
    <span class="stat-note">${esc(note)}</span>
  </article>`;

const statusRow = (status, total) => {
  const width = Math.max((status.count / Math.max(total, 1)) * 100, 3);

  return `
    <div class="status-row">
      <div class="status-head">
        <span><i style="--tone:${status.color}"></i>${esc(status.name)}</span>
        <strong>${status.count}</strong>
      </div>
      <div class="bar"><span style="width:${width}%;background:${status.color}"></span></div>
    </div>`;
};

const rankRow = (freelancer) => `
  <a class="rank-row" href="#/freelancers/${freelancer.id}">
    ${avatar(freelancer.fullName, 'violet')}
    <span class="rank-copy">
      <strong>${esc(freelancer.fullName)}</strong>
      <small>${esc(freelancer.specialty)}</small>
    </span>
    <span class="rank-meta">
      ${rating(freelancer.rating)}
      <small>${freelancer._count.orders} ${plural(freelancer._count.orders, 'замовлення', 'замовлення', 'замовлень')}</small>
    </span>
  </a>`;

const categoryRow = (category, max) => `
  <a class="category-row" href="#/categories/${category.id}">
    <div class="category-head">
      <strong>${esc(category.name)}</strong>
      <span>${category._count.projects} ${plural(category._count.projects, 'проєкт', 'проєкти', 'проєктів')}</span>
    </div>
    <div class="bar"><span style="width:${Math.max((category._count.projects / Math.max(max, 1)) * 100, 4)}%"></span></div>
  </a>`;

export function renderDashboard(view, data) {
  const { totals, revenue, activeOrders, statusBreakdown, recentOrders, topFreelancers, categories, deliveryBreakdown } = data;
  const maxCategory = Math.max(...categories.map((category) => category._count.projects), 1);
  const orderColumns = [
    { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
    { label: 'Проєкт', render: (row) => person(row.project.title, row.project.category.name, 'blue') },
    { label: 'Фрілансер', render: (row) => person(row.freelancer.fullName, row.freelancer.specialty, 'violet') },
    { label: 'Статус', render: (row) => statusBadge(row.status) },
    { label: 'Сума', align: 'right', value: (row) => money(row.amount) }
  ];

  view.innerHTML = `
    <section class="page-head">
      <h1>Огляд</h1>
    </section>

    <section class="stat-grid">
      ${statCard('Сума замовлень', money(revenue), 'без скасованих')}
      ${statCard('Активні замовлення', activeOrders, 'у роботі та на перевірці')}
      ${statCard('Проєкти', totals.projects, 'усього')}
      ${statCard('Доставки', totals.deliveries, 'у логістиці')}
    </section>

    <div class="dashboard-grid">
      <section class="panel">
        <header class="panel-head">
          <h3>Замовлення за статусами</h3>
          <span class="tag">${totals.orders}</span>
        </header>
        <div class="panel-body status-list">
          ${statusBreakdown.map((status) => statusRow(status, totals.orders)).join('')}
        </div>
      </section>
      <section class="panel">
        <header class="panel-head">
          <h3>Фрілансери</h3>
          <a class="link-arrow" href="#/freelancers">Усі</a>
        </header>
        <div class="panel-body rank-list">
          ${topFreelancers.map(rankRow).join('')}
        </div>
      </section>
    </div>

    <section class="panel recent-panel">
      <header class="panel-head">
        <h3>Останні замовлення</h3>
        <a class="link-arrow" href="#/orders">Усі замовлення</a>
      </header>
      <div class="table-wrap">${tableMarkup(orderColumns, recentOrders, 'orders')}</div>
    </section>

    <div class="dashboard-grid">
      <section class="panel">
        <header class="panel-head">
          <h3>Категорії</h3>
          <a class="link-arrow" href="#/categories">Усі</a>
        </header>
        <div class="panel-body category-list">
          ${categories.map((category) => categoryRow(category, maxCategory)).join('')}
        </div>
      </section>
      <section class="panel">
        <header class="panel-head">
          <h3>Доставки</h3>
          <a class="link-arrow" href="#/deliveries">Усі</a>
        </header>
        <div class="panel-body logistics-grid">
          <div class="logistics-tile"><span>Очікують</span><strong>${deliveryBreakdown.pending || 0}</strong></div>
          <div class="logistics-tile"><span>У дорозі</span><strong>${deliveryBreakdown.in_transit || 0}</strong></div>
          <div class="logistics-tile"><span>Доставлено</span><strong>${deliveryBreakdown.delivered || 0}</strong></div>
          <div class="logistics-tile"><span>Кур’єри</span><strong>${totals.couriers}</strong></div>
        </div>
      </section>
    </div>`;
}
