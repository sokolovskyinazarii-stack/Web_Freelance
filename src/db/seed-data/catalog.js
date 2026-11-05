export const categories = [
  {
    id: 1,
    name: 'Розробка',
    slug: 'development',
    description: 'Веб, мобільні та десктопні продукти під ключ',
    createdAt: '2025-02-10T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'Дизайн',
    slug: 'design',
    description: 'Інтерфейси, брендинг та візуальні комунікації',
    createdAt: '2025-02-11T09:00:00.000Z'
  },
  {
    id: 3,
    name: 'Маркетинг',
    slug: 'marketing',
    description: 'Залучення аудиторії, реклама та зростання',
    createdAt: '2025-02-12T09:00:00.000Z'
  },
  {
    id: 4,
    name: 'Копірайтинг',
    slug: 'copywriting',
    description: 'Тексти, контент-плани та редактура',
    createdAt: '2025-02-13T09:00:00.000Z'
  },
  {
    id: 5,
    name: 'Аналітика',
    slug: 'analytics',
    description: 'Дані, дашборди та продуктові дослідження',
    createdAt: '2025-02-14T09:00:00.000Z'
  },
  {
    id: 6,
    name: 'Медіа',
    slug: 'media',
    description: 'Відео, анімація та промо-матеріали',
    createdAt: '2025-02-15T09:00:00.000Z'
  }
];

export const statuses = [
  {
    id: 7,
    code: 'moderation',
    name: 'На модерації',
    color: '#f7b955',
    description: 'Замовлення очікує перевірки адміністратором',
    sortOrder: 0
  },
  {
    id: 1,
    code: 'open',
    name: 'Відкрито',
    color: '#3dd6f5',
    description: 'Замовлення опубліковано, виконавець ще не підтверджений',
    sortOrder: 1
  },
  {
    id: 2,
    code: 'in_progress',
    name: 'В роботі',
    color: '#8b7cff',
    description: 'Фрілансер виконує узгоджений обсяг робіт',
    sortOrder: 2
  },
  {
    id: 3,
    code: 'review',
    name: 'На перевірці',
    color: '#f7b955',
    description: 'Результат передано замовнику на фінальну перевірку',
    sortOrder: 3
  },
  {
    id: 4,
    code: 'completed',
    name: 'Виконано',
    color: '#3ddc97',
    description: 'Роботу прийнято, оплату зафіксовано',
    sortOrder: 4
  },
  {
    id: 5,
    code: 'cancelled',
    name: 'Скасовано',
    color: '#ff6b8a',
    description: 'Замовлення закрито без виконання',
    sortOrder: 5
  },
  {
    id: 6,
    code: 'delivery',
    name: 'Доставка',
    color: '#5aa9ff',
    description: 'Матеріали або обладнання передані кур’єру',
    sortOrder: 6
  }
];
