import {
  avatar,
  dateCell,
  deliveryBadge,
  moneyCell,
  mono,
  person,
  statusBadge,
  text
} from '../cells.js';

export const deliveries = {
  key: 'deliveries',
  label: 'Доставки',
  singular: 'Доставка',
  accent: 'cyan',
  search: (row) =>
    [row.trackingNumber, row.city, row.address, row.courier.fullName].join(' '),
  list: {
    title: 'Доставки',
    searchHint: 'Трек-номер, місто, адреса або кур’єр',
    columns: [
      { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
      {
        label: 'Замовлення',
        cell: (row) => person(row.order.project.title, row.order.orderNumber, 'blue')
      },
      { label: 'Кур’єр', cell: (row) => person(row.courier.fullName, row.courier.vehicle, 'green') },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
      { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
    ]
  },
  detail: {
    title: (row) => row.trackingNumber,
    subtitle: (row) => `${row.order.orderNumber} · ${row.order.project.title}`,
    avatar: (row) => avatar(row.trackingNumber, 'cyan', 'avatar-xl'),
    badge: (row) => deliveryBadge(row.status),
    metrics: [
      { label: 'Вартість', cell: (row) => moneyCell(row.cost), hint: () => 'доставки' },
      { label: 'Очікується', cell: (row) => dateCell(row.estimatedAt), hint: () => 'планова дата' },
      { label: 'Доставлено', cell: (row) => dateCell(row.deliveredAt), hint: () => 'фактична дата' },
      {
        label: 'Рейтинг кур’єра',
        cell: (row) => text(row.courier.rating.toFixed(1)),
        hint: (row) => row.courier.fullName
      }
    ],
    fields: [
      { label: 'Адреса', cell: (row) => text(row.address) },
      { label: 'Місто', cell: (row) => text(row.city) },
      {
        label: 'Кур’єр',
        cell: (row) => person(row.courier.fullName, row.courier.vehicle, 'green')
      },
      { label: 'Статус замовлення', cell: (row) => statusBadge(row.order.status) },
      { label: 'Створено', cell: (row) => dateCell(row.createdAt) },
      { label: 'Оновлено', cell: (row) => dateCell(row.order.updatedAt) }
    ],
    relations: [
      {
        title: 'Замовлення',
        resource: 'orders',
        items: (row) => [row.order],
        columns: [
          { label: 'Номер', cell: (row) => mono(row.orderNumber) },
          { label: 'Проєкт', cell: (row) => text(row.project.title) },
          { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
          { label: 'Статус', cell: (row) => statusBadge(row.status) },
          { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
        ]
      }
    ]
  }
};
