import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import apiRouter from './routes/api.routes.js';
import pageRouter from './routes/page.routes.js';
import { date, initials, money, plural } from './lib/format.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(currentDir, 'public');
const viewsDir = path.join(currentDir, 'views');
const app = express();

const nunjucksEnv = nunjucks.configure(viewsDir, {
  express: app,
  autoescape: true,
  watch: false
});

nunjucksEnv.addFilter('money', money);
nunjucksEnv.addFilter('date', date);
nunjucksEnv.addFilter('plural', plural);
nunjucksEnv.addFilter('initials', initials);

app.set('view engine', 'njk');
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use('/api', apiRouter);
app.use('/', pageRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.locals.navItems = [
  { key: 'overview', label: 'Огляд', href: '/' },
  { key: 'freelancers', label: 'Фрілансери', href: '/freelancers' },
  { key: 'customers', label: 'Замовники', href: '/customers' },
  { key: 'projects', label: 'Проєкти', href: '/projects' },
  { key: 'categories', label: 'Категорії', href: '/categories' },
  { key: 'orders', label: 'Замовлення', href: '/orders' },
  { key: 'statuses', label: 'Статуси', href: '/statuses' },
  { key: 'deliveries', label: 'Доставки', href: '/deliveries' },
  { key: 'couriers', label: 'Кур’єри', href: '/couriers' }
];

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Маршрут не знайдено' });
  }

  return res.status(404).render('error.njk', {
    title: 'Сторінку не знайдено',
    message: 'Перевірте адресу або поверніться до огляду платформи.',
    active: ''
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (req.path.startsWith('/api')) {
    return res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }

  return res.status(500).render('error.njk', {
    title: 'Помилка',
    message: 'Не вдалося завантажити сторінку. Спробуйте ще раз.',
    active: ''
  });
});

export default app;
