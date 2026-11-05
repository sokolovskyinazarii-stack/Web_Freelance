export const statuses = {
  key: 'statuses',
  model: 'status',
  label: 'Статуси',
  singular: 'Статус',
  createTitle: 'Створити статус',
  editTitle: 'Редагувати статус',
  fields: [
    {
      name: 'code',
      label: 'Код',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 40,
      unique: true,
      pattern: /^[a-z][a-z_]*$/
    },
    { name: 'name', label: 'Назва', type: 'text', required: true, minLength: 2, maxLength: 100 },
    {
      name: 'color',
      label: 'Колір',
      type: 'color',
      required: true,
      default: '#22d3ee',
      pattern: /^#[0-9a-fA-F]{6}$/
    },
    {
      name: 'description',
      label: 'Опис',
      type: 'textarea',
      required: true,
      minLength: 5,
      maxLength: 1000,
      rows: 4,
      wide: true
    },
    {
      name: 'sortOrder',
      label: 'Порядок',
      type: 'number',
      required: true,
      min: 0,
      step: '1',
      default: 0
    }
  ]
};
