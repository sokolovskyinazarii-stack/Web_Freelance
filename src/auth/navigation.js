import { ROLES } from './roles.js';

const publicItems = [
  { key: 'overview', label: 'Огляд', href: '/', icon: 'overview' },
  { key: 'projects', label: 'Проєкти', href: '/projects', icon: 'projects' },
  { key: 'freelancers', label: 'Фрілансери', href: '/freelancers', icon: 'freelancers' },
  { key: 'categories', label: 'Категорії', href: '/categories', icon: 'categories' }
];

const adminItems = [
  { key: 'overview', label: 'Огляд', href: '/', icon: 'overview' },
  { key: 'orders', label: 'Замовлення', href: '/orders', icon: 'orders' },
  { key: 'projects', label: 'Проєкти', href: '/projects', icon: 'projects' },
  { key: 'freelancers', label: 'Фрілансери', href: '/freelancers', icon: 'freelancers' },
  { key: 'categories', label: 'Категорії', href: '/categories', icon: 'categories' },
  { key: 'deliveries', label: 'Доставки', href: '/deliveries', icon: 'deliveries' },
  { key: 'customers', label: 'Замовники', href: '/customers', icon: 'customers', secondary: true },
  { key: 'statuses', label: 'Статуси', href: '/statuses', icon: 'statuses', secondary: true },
  { key: 'couriers', label: 'Кур’єри', href: '/couriers', icon: 'couriers', secondary: true },
  { key: 'users', label: 'Користувачі', href: '/users', icon: 'users', secondary: true }
];

export function getNavItems(role) {
  if (role === ROLES.ADMIN) return adminItems;

  if (role === ROLES.GUEST) {
    return [
      ...publicItems,
      { key: 'login', label: 'Увійти', href: '/login', icon: 'login' }
    ];
  }

  if (role === ROLES.COURIER) {
    return [
      { key: 'overview', label: 'Огляд', href: '/', icon: 'overview' },
      { key: 'deliveries', label: 'Доставки', href: '/deliveries', icon: 'deliveries' }
    ];
  }

  if (role === ROLES.FREELANCER) {
    return [
      ...publicItems,
      { key: 'orders', label: 'Замовлення', href: '/orders', icon: 'orders' },
      { key: 'deliveries', label: 'Мої доставки', href: '/deliveries', icon: 'deliveries' }
    ];
  }

  return [
    ...publicItems,
    { key: 'orders', label: 'Мої замовлення', href: '/orders', icon: 'orders' },
    { key: 'deliveries', label: 'Мої доставки', href: '/deliveries', icon: 'deliveries' }
  ];
}
