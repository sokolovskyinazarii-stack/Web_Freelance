import { avatar, date, deliveryBadge, money, statusBadge } from '../format.js';
import { person } from '../components.js';

export const deliveries = {
  key: 'deliveries',
  label: 'Доставки',
  singular: 'Доставка',
  icon: 'deliveries',
  accent: 'cyan',
  list: {
    title: 'Доставки',
    searchHint: 'Трек-номер, місто, адреса або кур’єр',
    search: (row) =>
      [row.trackingNumber, row.city, row.address, row.courier.fullName].join(' '),
    columns: [
      { label: 'Трек-номер', render: (row) => `<span class="cell-mono">${row.trackingNumber}</span>` },
      { label: 'Замовлення', render: (row) => person(row.order.project.title, row.order.orderNumber, 'blue') },
      { label: 'Кур’єр', render: (row) => person(row.courier.fullName, row.courier.vehicle, 'green') },
      { label: 'Місто', value: (row) => row.city },
      { label: 'Статус', render: (row) => deliveryBadge(row.status) },
      { label: 'Вартість', align: 'right', value: (row) => money(row.cost) }
    ]
  },
  detail: {
    title: (row) => row.trackingNumber,
    subtitle: (row) => `${row.order.orderNumber} · ${row.order.project.title}`,
    aside: (row) => avatar(row.trackingNumber, 'cyan', 'avatar-xl'),
    badge: (row) => deliveryBadge(row.status),
    metrics: [
      { label: 'Вартість', value: (row) => money(row.cost), hint: () => 'доставки' },
      { label: 'Очікується', value: (row) => date(row.estimatedAt), hint: () => 'планова дата' },
      { label: 'Доставлено', value: (row) => date(row.deliveredAt), hint: () => 'фактична дата' },
      { label: 'Рейтинг кур’єра', value: (row) => row.courier.rating.toFixed(1), hint: (row) => row.courier.fullName }
    ],
    fields: [
      { label: 'Адреса', value: (row) => row.address },
      { label: 'Місто', value: (row) => row.city },
      { label: 'Кур’єр', render: (row) => person(row.courier.fullName, row.courier.vehicle, 'green') },
      { label: 'Статус замовлення', render: (row) => statusBadge(row.order.status) },
      { label: 'Створено', value: (row) => date(row.createdAt) },
      { label: 'Оновлено', value: (row) => date(row.order.updatedAt) }
    ],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => [row.order],
        columns: [
          { label: 'Номер', render: (row) => `<span class="cell-mono">${row.orderNumber}</span>` },
          { label: 'Проєкт', value: (row) => row.project.title },
          { label: 'Замовник', value: (row) => row.customer.companyName },
          { label: 'Статус', render: (row) => statusBadge(row.status) },
          { label: 'Сума', align: 'right', value: (row) => money(row.amount) }
        ]
      }
    ]
  }
};
