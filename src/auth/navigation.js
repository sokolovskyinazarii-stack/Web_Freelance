import { ROLES } from './roles.js';

const publicItems = [
  { key: 'overview', label: 'Огляд', href: '/' },
  { key: 'projects', label: 'Проєкти', href: '/projects' },
  { key: 'freelancers', label: 'Фрілансери', href: '/freelancers' },
  { key: 'categories', label: 'Категорії', href: '/categories' }
];

const adminItems = [
  { key: 'overview', label: 'Огляд', href: '/' },
  { key: 'freelancers', label: 'Фрілансери', href: '/freelancers' },
  { key: 'customers', label: 'Замовники', href: '/customers' },
  { key: 'projects', label: 'Проєкти', href: '/projects' },
  { key: 'categories', label: 'Категорії', href: '/categories' },
  { key: 'orders', label: 'Замовлення', href: '/orders' },
  { key: 'statuses', label: 'Статуси', href: '/statuses' },
  { key: 'deliveries', label: 'Доставки', href: '/deliveries' },
  { key: 'couriers', label: 'Кур’єри', href: '/couriers' },
  { key: 'users', label: 'Користувачі', href: '/users' }
];

export function getNavItems(role) {
  if (role === ROLES.ADMIN) return adminItems;

  if (role === ROLES.GUEST) {
    return [
      ...publicItems,
      { key: 'login', label: 'Увійти', href: '/login' },
      { key: 'register', label: 'Реєстрація', href: '/register' }
    ];
  }

  if (role === ROLES.COURIER) {
    return [
      { key: 'overview', label: 'Огляд', href: '/' },
      { key: 'deliveries', label: 'Доставки', href: '/deliveries' }
    ];
  }

  if (role === ROLES.FREELANCER) {
    return [
      ...publicItems,
      { key: 'orders', label: 'Замовлення', href: '/orders' },
      { key: 'deliveries', label: 'Мої доставки', href: '/deliveries' }
    ];
  }

  return [
    ...publicItems,
    { key: 'orders', label: 'Мої замовлення', href: '/orders' },
    { key: 'deliveries', label: 'Мої доставки', href: '/deliveries' }
  ];
}
