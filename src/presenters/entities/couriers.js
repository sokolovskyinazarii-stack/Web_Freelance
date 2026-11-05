import {
  activeBadge,
  avatar,
  dateCell,
  deliveryBadge,
  moneyCell,
  mono,
  person,
  rating,
  text
} from '../cells.js';

export const couriers = {
  key: 'couriers',
  label: 'Кур’єри',
  singular: 'Кур’єр',
  accent: 'green',
  search: (row) => [row.fullName, row.vehicle, row.zone, row.email].join(' '),
  list: {
    title: 'Кур’єри',
    searchHint: 'Ім’я, транспорт, зона або email',
    columns: [
      { label: 'Кур’єр', cell: (row) => person(row.fullName, row.vehicle, 'green') },
      { label: 'Зона', cell: (row) => text(row.zone) },
      { label: 'Рейтинг', cell: (row) => rating(row.rating) },
      { label: 'Статус', cell: (row) => activeBadge(row.isActive) },
      { label: 'Доставки', align: 'right', cell: (row) => text(row._count.deliveries) }
    ]
  },
  detail: {
    title: (row) => row.fullName,
    subtitle: (row) => `${row.vehicle} · ${row.zone}`,
    avatar: (row) => avatar(row.fullName, 'green', 'avatar-xl'),
    badge: (row) => activeBadge(row.isActive),
    metrics: [
      { label: 'Рейтинг', cell: (row) => rating(row.rating), hint: () => 'середня оцінка' },
      { label: 'Доставки', cell: (row) => text(row._count.deliveries), hint: () => 'виконано' },
      { label: 'Статус', cell: (row) => activeBadge(row.isActive), hint: () => 'поточна зміна' },
      { label: 'У команді', cell: (row) => dateCell(row.createdAt), hint: () => 'дата приєднання' }
    ],
    fields: [
      { label: 'Телефон', cell: (row) => text(row.phone) },
      { label: 'Email', cell: (row) => text(row.email) },
      { label: 'Транспорт', cell: (row) => text(row.vehicle) },
      { label: 'Зона', cell: (row) => text(row.zone) }
    ],
    relations: [
      {
        title: 'Доставки',
        resource: 'deliveries',
        items: (row) => row.deliveries,
        columns: [
          { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
          {
            label: 'Замовлення',
            cell: (row) => person(row.order.project.title, row.order.orderNumber, 'blue')
          },
          { label: 'Адреса', cell: (row) => text(`${row.city}, ${row.address}`) },
          { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
          { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
        ]
      }
    ]
  }
};
