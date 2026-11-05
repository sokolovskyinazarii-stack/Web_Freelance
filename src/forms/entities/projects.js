export const projects = {
  key: 'projects',
  model: 'project',
  label: 'Проєкти',
  singular: 'Проєкт',
  createTitle: 'Створити проєкт',
  editTitle: 'Редагувати проєкт',
  fields: [
    { name: 'title', label: 'Назва проєкту', type: 'text', required: true, minLength: 3, maxLength: 255 },
    {
      name: 'description',
      label: 'Опис',
      type: 'textarea',
      required: true,
      minLength: 5,
      maxLength: 2000,
      rows: 4,
      wide: true
    },
    { name: 'budget', label: 'Бюджет', type: 'number', required: true, min: 0, step: '0.01' },
    { name: 'deadline', label: 'Дедлайн', type: 'date', required: true },
    {
      name: 'categoryId',
      label: 'Категорія',
      type: 'select',
      required: true,
      placeholder: 'Оберіть категорію',
      relation: {
        model: 'category',
        orderBy: { name: 'asc' },
        optionLabel: (row) => row.name
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
        optionLabel: (row) => `${row.companyName} · ${row.city}`
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
    }
  ]
};
