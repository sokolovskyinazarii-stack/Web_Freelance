const currencies = [
  { value: 'USD', label: 'USD — долар США' },
  { value: 'EUR', label: 'EUR — євро' },
  { value: 'UAH', label: 'UAH — гривня' }
];

const deliveryOptions = [
  { value: 'false', label: 'Ні' },
  { value: 'true', label: 'Так' }
];

export function buildFields(categories, values = {}) {
  return [
    {
      name: 'title',
      label: 'Назва замовлення',
      type: 'text',
      required: true,
      value: values.title || ''
    },
    {
      name: 'description',
      label: 'Опис',
      type: 'textarea',
      required: true,
      wide: true,
      rows: 5,
      value: values.description || ''
    },
    {
      name: 'categoryId',
      label: 'Категорія',
      type: 'select',
      options: categories.map((category) => ({
        value: String(category.id),
        label: category.name
      })),
      value: values.categoryId || ''
    },
    {
      name: 'amount',
      label: 'Бюджет',
      type: 'number',
      required: true,
      min: 0,
      step: '0.01',
      value: values.amount ?? ''
    },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'select',
      required: true,
      options: currencies,
      value: values.currency || 'USD'
    },
    {
      name: 'deadline',
      label: 'Дедлайн',
      type: 'date',
      value: values.deadline || ''
    },
    {
      name: 'deliveryNeeded',
      label: 'Потрібна доставка',
      type: 'select',
      required: true,
      options: deliveryOptions,
      value: values.deliveryNeeded || 'false'
    }
  ];
}

export function validateRequest(body, categories) {
  const values = {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    categoryId: String(body.categoryId || '').trim(),
    amount: String(body.amount || '').trim(),
    currency: String(body.currency || 'USD').trim(),
    deadline: String(body.deadline || '').trim(),
    deliveryNeeded: String(body.deliveryNeeded || 'false')
  };
  const errors = {};

  if (values.title.length < 3) errors.title = 'Назва має містити щонайменше 3 символи.';
  if (values.description.length < 10) {
    errors.description = 'Опис має містити щонайменше 10 символів.';
  }
  if (!values.amount || !Number.isFinite(Number(values.amount)) || Number(values.amount) < 0) {
    errors.amount = 'Вкажіть коректний бюджет.';
  }
  if (!currencies.some((item) => item.value === values.currency)) {
    errors.currency = 'Оберіть валюту.';
  }
  if (values.categoryId && !categories.some((item) => String(item.id) === values.categoryId)) {
    errors.categoryId = 'Оберіть коректну категорію.';
  }

  let deadline = null;
  if (values.deadline) {
    const parsed = new Date(values.deadline);
    if (Number.isNaN(parsed.getTime())) errors.deadline = 'Введіть коректну дату.';
    else deadline = parsed;
  }

  return {
    errors,
    values,
    data: {
      title: values.title,
      description: values.description,
      amount: Number(values.amount),
      currency: values.currency,
      deadline,
      deliveryNeeded: values.deliveryNeeded === 'true',
      categoryId: values.categoryId ? Number(values.categoryId) : null
    }
  };
}

export function renderRequestForm(res, {
  categories,
  values,
  errors,
  status = 200,
  title = 'Нове замовлення',
  action = '/orders/request',
  cancelHref = '/orders',
  submitLabel = 'Надіслати на модерацію'
}) {
  return res.status(status).render('form.njk', {
    title,
    active: 'orders',
    config: { label: 'Замовлення' },
    fields: buildFields(categories, values),
    errors,
    action,
    cancelHref,
    submitLabel
  });
}
