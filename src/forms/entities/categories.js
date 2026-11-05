export const categories = {
  key: 'categories',
  model: 'category',
  label: 'Категорії',
  singular: 'Категорія',
  createTitle: 'Створити категорію',
  editTitle: 'Редагувати категорію',
  fields: [
    { name: 'name', label: 'Назва', type: 'text', required: true, minLength: 2, maxLength: 100, unique: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
      unique: true,
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
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
    }
  ]
};
