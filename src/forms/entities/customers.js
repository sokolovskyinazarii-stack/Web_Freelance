export const customers = {
  key: 'customers',
  model: 'customer',
  label: 'Замовники',
  singular: 'Замовник',
  createTitle: 'Створити замовника',
  editTitle: 'Редагувати замовника',
  fields: [
    {
      name: 'companyName',
      label: 'Назва компанії',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 255
    },
    {
      name: 'contactName',
      label: 'Контактна особа',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 255
    },
    { name: 'email', label: 'Email', type: 'email', required: true, email: true, unique: true },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      required: true,
      minLength: 10,
      maxLength: 20,
      pattern: /^[+\d\s()-]{10,20}$/
    },
    { name: 'city', label: 'Місто', type: 'text', required: true, minLength: 2, maxLength: 100 }
  ]
};
