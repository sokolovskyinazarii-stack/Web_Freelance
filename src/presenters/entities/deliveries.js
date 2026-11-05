import {
  avatar,
  dateCell,
  deliveryBadge,
  moneyCell,
  mono,
  person,
  rating,
  statusBadge,
  text
} from '../cells.js';
import { orderTitle } from '../order-helpers.js';

export const deliveries = {
  key: 'deliveries',
  label: 'Доставки',
  singular: 'Доставка',
  accent: 'cyan',
  search: (row) =>
    [
      row.trackingNumber,
      row.city,
      row.address,
      row.courier?.fullName || '',
      orderTitle(row.order)
    ].join(' '),
  list: {
    title: 'Доставки',
    searchHint: 'Трек-номер, місто, адреса або кур’єр',
    columns: [
      { label: 'Трек-номер', cell: (row) => mono(row.trackingNumber) },
      {
        label: 'Замовлення',
        cell: (row) => person(orderTitle(row.order), row.order.orderNumber, 'blue')
      },
      {
        label: 'Кур’єр',
        cell: (row) =>
          row.courier
            ? person(row.courier.fullName, row.courier.vehicle, 'green')
            : text('Очікує кур’єра')
      },
      { label: 'Місто', cell: (row) => text(row.city) },
      { label: 'Статус', cell: (row) => deliveryBadge(row.status) },
      { label: 'Вартість', align: 'right', cell: (row) => moneyCell(row.cost) }
    ]
  },
  detail: {
    title: (row) => row.trackingNumber,
    subtitle: (row) => `${row.order.orderNumber} · ${orderTitle(row.order)}`,
    avatar: (row) => avatar(row.trackingNumber, 'cyan', 'avatar-xl'),
    badge: (row) => deliveryBadge(row.status),
    metrics: [
      { label: 'Вартість', cell: (row) => moneyCell(row.cost), hint: () => 'доставки' },
      { label: 'Очікується', cell: (row) => dateCell(row.estimatedAt), hint: () => 'планова дата' },
      { label: 'Доставлено', cell: (row) => dateCell(row.deliveredAt), hint: () => 'фактична дата' },
      {
        label: 'Рейтинг кур’єра',
        cell: (row) => (row.courier ? rating(row.courier.rating) : text('—')),
        hint: (row) => row.courier?.fullName || 'кур’єра ще не обрано'
      }
    ],
    fields: [
      { label: 'Адреса', cell: (row) => text(row.address) },
      { label: 'Місто', cell: (row) => text(row.city) },
      {
        label: 'Кур’єр',
        cell: (row) =>
          row.courier
            ? person(row.courier.fullName, row.courier.vehicle, 'green')
            : text('Очікує кур’єра')
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
          { label: 'Замовлення', cell: (row) => text(orderTitle(row)) },
          { label: 'Замовник', cell: (row) => text(row.customer.companyName) },
          { label: 'Статус', cell: (row) => statusBadge(row.status) },
          { label: 'Сума', align: 'right', cell: (row) => moneyCell(row.amount) }
        ]
      }
    ]
  }
};
