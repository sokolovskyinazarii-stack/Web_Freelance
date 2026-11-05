export const deliveries = [
  {
    id: 1,
    trackingNumber: 'TRK-8801',
    address: 'Приморський бульвар, 12',
    city: 'Одеса',
    status: 'in_transit',
    cost: 180,
    estimatedAt: '2026-11-07T15:00:00.000Z',
    deliveredAt: null,
    orderId: 5,
    courierId: 3,
    createdAt: '2026-11-04T10:00:00.000Z'
  },
  {
    id: 2,
    trackingNumber: 'TRK-8802',
    address: 'вул. Хрещатик, 22',
    city: 'Київ',
    status: 'delivered',
    cost: 120,
    estimatedAt: '2026-11-03T12:00:00.000Z',
    deliveredAt: '2026-11-03T11:35:00.000Z',
    orderId: 3,
    courierId: 1,
    createdAt: '2026-11-01T09:20:00.000Z'
  },
  {
    id: 3,
    trackingNumber: 'TRK-8803',
    address: 'вул. Соборна, 8',
    city: 'Львів',
    status: 'delivered',
    cost: 95,
    estimatedAt: '2026-11-04T17:00:00.000Z',
    deliveredAt: '2026-11-04T16:20:00.000Z',
    orderId: 7,
    courierId: 2,
    createdAt: '2026-11-02T13:10:00.000Z'
  },
  {
    id: 4,
    trackingNumber: 'TRK-8804',
    address: 'вул. Антоновича, 41',
    city: 'Київ',
    status: 'pending',
    cost: 140,
    estimatedAt: '2026-11-08T10:00:00.000Z',
    deliveredAt: null,
    orderId: 2,
    courierId: 4,
    createdAt: '2026-11-05T08:30:00.000Z'
  }
];
