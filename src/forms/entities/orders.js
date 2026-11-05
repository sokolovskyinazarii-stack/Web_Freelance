export const orders = {
  key: 'orders',
  model: 'order',
  label: 'Замовлення',
  singular: 'Замовлення',
  createTitle: 'Створити замовлення',
  editTitle: 'Редагувати замовлення',
  fields: [
    {
      name: 'orderNumber',
      label: 'Номер замовлення',
      type: 'text',
      required: true,
      minLength: 8,
      maxLength: 20,
      unique: true,
      pattern: /^ORD-\d{4}$/
    },
    { name: 'amount', label: 'Сума', type: 'number', required: true, min: 0, step: '0.01' },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'select',
      required: true,
      default: 'USD',
      placeholder: 'Оберіть валюту',
      options: [
        { value: 'USD', label: 'USD — долар США' },
        { value: 'EUR', label: 'EUR — євро' },
        { value: 'UAH', label: 'UAH — гривня' }
      ]
    },
    {
      name: 'projectId',
      label: 'Проєкт',
      type: 'select',
      required: true,
      placeholder: 'Оберіть проєкт',
      relation: {
        model: 'project',
        include: { customer: true },
        orderBy: { title: 'asc' },
        optionLabel: (row) => `${row.title} · ${row.customer.companyName}`
      }
    },
    {
      name: 'customerId',
      label: 'Замовник',
      type: 'select',
      required: true,
      placeholder: 'Оберіть замовника',
      relation: {
        model: 'customer',
        orderBy: { companyName: 'asc' },
        optionLabel: (row) => row.companyName
      }
    },
    {
      name: 'freelancerId',
      label: 'Фрілансер',
      type: 'select',
      required: true,
      placeholder: 'Оберіть фрілансера',
      relation: {
        model: 'freelancer',
        orderBy: { fullName: 'asc' },
        optionLabel: (row) => `${row.fullName} · ${row.specialty}`
      }
    },
    {
      name: 'statusId',
      label: 'Статус',
      type: 'select',
      required: true,
      placeholder: 'Оберіть статус',
      relation: {
        model: 'status',
        orderBy: { sortOrder: 'asc' },
        optionLabel: (row) => row.name
      }
    }
  ]
};
