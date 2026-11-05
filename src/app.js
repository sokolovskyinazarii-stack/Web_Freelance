import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import session from 'express-session';
import passport from 'passport';
import apiRouter from './routes/api.routes.js';
import pageRouter from './routes/page.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import { configurePassport } from './auth/passport.js';
import { authLocals, requireRole } from './auth/middleware.js';
import { ROLES } from './auth/roles.js';
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

configurePassport();

app.set('view engine', 'njk');
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(48).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(authLocals);
app.use(express.static(publicDir));
app.use('/', authRouter);
app.use('/api', requireRole(ROLES.ADMIN), apiRouter);
app.use('/users', requireRole(ROLES.ADMIN), userRouter);
app.use('/', pageRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

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
