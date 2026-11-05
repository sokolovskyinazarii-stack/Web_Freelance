export const freelancers = {
  key: 'freelancers',
  model: 'freelancer',
  label: 'Фрілансери',
  singular: 'Фрілансер',
  createTitle: 'Створити фрілансера',
  editTitle: 'Редагувати фрілансера',
  fields: [
    { name: 'fullName', label: 'ПІБ', type: 'text', required: true, minLength: 5, maxLength: 255 },
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
    { name: 'specialty', label: 'Спеціальність', type: 'text', required: true, minLength: 2, maxLength: 100 },
    { name: 'city', label: 'Місто', type: 'text', required: true, minLength: 2, maxLength: 100 },
    {
      name: 'hourlyRate',
      label: 'Ставка за годину',
      type: 'number',
      required: true,
      min: 0,
      step: '0.01'
    },
    {
      name: 'rating',
      label: 'Рейтинг',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
      step: '0.1'
    },
    { name: 'bio', label: 'Про фахівця', type: 'textarea', rows: 4, maxLength: 1000, wide: true }
  ]
};
