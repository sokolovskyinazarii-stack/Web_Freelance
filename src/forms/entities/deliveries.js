export const deliveries = {
  key: 'deliveries',
  model: 'delivery',
  label: 'Доставки',
  singular: 'Доставка',
  createTitle: 'Створити доставку',
  editTitle: 'Редагувати доставку',
  fields: [
    {
      name: 'trackingNumber',
      label: 'Трек-номер',
      type: 'text',
      required: true,
      minLength: 8,
      maxLength: 20,
      unique: true,
      pattern: /^TRK-\d{4}$/
    },
    { name: 'address', label: 'Адреса', type: 'text', required: true, minLength: 5, maxLength: 255 },
    { name: 'city', label: 'Місто', type: 'text', required: true, minLength: 2, maxLength: 100 },
    {
      name: 'status',
      label: 'Статус доставки',
      type: 'select',
      required: true,
      default: 'pending',
      placeholder: 'Оберіть статус',
      options: [
        { value: 'offered', label: 'Очікує кур’єра' },
        { value: 'pending', label: 'Очікує' },
        { value: 'in_transit', label: 'У дорозі' },
        { value: 'delivered', label: 'Доставлено' },
        { value: 'failed', label: 'Не доставлено' }
      ]
    },
    { name: 'cost', label: 'Вартість', type: 'number', required: true, min: 0, step: '0.01' },
    { name: 'estimatedAt', label: 'Очікувана дата', type: 'date', required: true },
    { name: 'deliveredAt', label: 'Фактична дата доставки', type: 'date' },
    {
      name: 'orderId',
      label: 'Замовлення',
      type: 'select',
      required: true,
      unique: true,
      placeholder: 'Оберіть замовлення',
      relation: {
        model: 'order',
        include: { project: true, delivery: true },
        orderBy: { createdAt: 'desc' },
        optionLabel: (row) => `${row.orderNumber} · ${row.project?.title || row.title || 'Без проєкту'}`,
        filter: (row, record) => !row.delivery || row.delivery.id === record?.id
      }
    },
    {
      name: 'courierId',
      label: 'Кур’єр (необов’язково)',
      type: 'select',
      placeholder: 'Оберіть кур’єра',
      relation: {
        model: 'courier',
        orderBy: { fullName: 'asc' },
        optionLabel: (row) => `${row.fullName} · ${row.vehicle}`,
        filter: (row, record) => row.isActive || record?.courierId === row.id
      }
    }
  ]
};
