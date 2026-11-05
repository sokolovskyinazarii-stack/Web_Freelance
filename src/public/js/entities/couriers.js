import { activeBadge, avatar, date, deliveryBadge, money, rating } from '../format.js';
import { person } from '../components.js';

export const couriers = {
  key: 'couriers',
  label: 'Кур’єри',
  singular: 'Кур’єр',
  icon: 'couriers',
  accent: 'green',
  list: {
    title: 'Кур’єри',
    searchHint: 'Ім’я, транспорт, зона або email',
    search: (row) => [row.fullName, row.vehicle, row.zone, row.email].join(' '),
    columns: [
      { label: 'Кур’єр', render: (row) => person(row.fullName, row.vehicle, 'green') },
      { label: 'Зона', value: (row) => row.zone },
      { label: 'Рейтинг', render: (row) => rating(row.rating) },
      { label: 'Статус', render: (row) => activeBadge(row.isActive) },
      { label: 'Доставки', align: 'right', value: (row) => row._count.deliveries }
    ]
  },
  detail: {
    title: (row) => row.fullName,
    subtitle: (row) => `${row.vehicle} · ${row.zone}`,
    aside: (row) => avatar(row.fullName, 'green', 'avatar-xl'),
    badge: (row) => activeBadge(row.isActive),
    metrics: [
      { label: 'Рейтинг', render: (row) => rating(row.rating), hint: () => 'середня оцінка' },
      { label: 'Доставки', value: (row) => row._count.deliveries, hint: () => 'виконано' },
      { label: 'Статус', render: (row) => activeBadge(row.isActive), hint: () => 'поточна зміна' },
      { label: 'У команді', value: (row) => date(row.createdAt), hint: () => 'дата приєднання' }
    ],
    fields: [
      { label: 'Телефон', value: (row) => row.phone },
      { label: 'Email', value: (row) => row.email },
      { label: 'Транспорт', value: (row) => row.vehicle },
      { label: 'Зона', value: (row) => row.zone }
    ],
    relations: [
      {
        title: 'Доставки',
        resource: 'deliveries',
        items: (row) => row.deliveries,
        columns: [
          { label: 'Трек-номер', render: (row) => `<span class="cell-mono">${row.trackingNumber}</span>` },
          { label: 'Замовлення', render: (row) => person(row.order.project.title, row.order.orderNumber, 'blue') },
          { label: 'Адреса', value: (row) => `${row.city}, ${row.address}` },
          { label: 'Статус', render: (row) => deliveryBadge(row.status) },
          { label: 'Вартість', align: 'right', value: (row) => money(row.cost) }
        ]
      }
    ]
  }
};
