export const couriers = {
  key: 'couriers',
  model: 'courier',
  label: 'Кур’єри',
  singular: 'Кур’єр',
  createTitle: 'Створити кур’єра',
  editTitle: 'Редагувати кур’єра',
  fields: [
    { name: 'fullName', label: 'ПІБ', type: 'text', required: true, minLength: 5, maxLength: 255 },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      required: true,
      minLength: 10,
      maxLength: 20,
      unique: true,
      pattern: /^[+\d\s()-]{10,20}$/
    },
    { name: 'email', label: 'Email', type: 'email', required: true, email: true, unique: true },
    { name: 'vehicle', label: 'Транспорт', type: 'text', required: true, minLength: 2, maxLength: 100 },
    { name: 'zone', label: 'Зона', type: 'text', required: true, minLength: 2, maxLength: 100 },
    {
      name: 'rating',
      label: 'Рейтинг',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
      step: '0.1'
    },
    {
      name: 'isActive',
      label: 'Статус',
      type: 'select',
      required: true,
      default: 'true',
      valueType: 'boolean',
      placeholder: 'Оберіть статус',
      options: [
        { value: 'true', label: 'Активний' },
        { value: 'false', label: 'Неактивний' }
      ]
    }
  ]
};
