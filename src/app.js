import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import passport from 'passport';
import apiRouter from './routes/api.routes.js';
import pageRouter from './routes/page.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import workflowRouter from './routes/workflow.routes.js';
import { configurePassport } from './auth/passport.js';
import { authLocals, requireRole } from './auth/middleware/index.js';
import { ROLES } from './auth/roles.js';
import { date, initials, money, plural } from './lib/format.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(currentDir, 'public');
const viewsDir = path.join(currentDir, 'views');
const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET && isProduction) {
  throw new Error('SESSION_SECRET не заданий. Додайте його в змінні середовища.');
}

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Легкий health-check без сесії та бази: для Render і зовнішнього монітора.
app.get('/healthz', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok' });
});

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-Frame-Options', 'DENY');
  res.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "script-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; base-uri 'self'"
  );
  next();
});

// Статика до сесій: CSS/JS не залежать від PostgreSQL.
app.use(express.static(publicDir, {
  maxAge: isProduction ? '1h' : 0,
  etag: true
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const PgStore = connectPgSimple(session);
const sessionPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: Number(process.env.DB_POOL_MAX) || 3
});

const sessionStore = new PgStore({
  pool: sessionPool,
  tableName: 'session',
  createTableIfMissing: false,
  pruneSessionInterval: 60 * 15
});

app.use(
  session({
    name: 'freelance.sid',
    secret: process.env.SESSION_SECRET || 'freelance-local-only-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) res.set('Cache-Control', 'no-store');
  next();
});
app.use(authLocals);

const nunjucksEnv = nunjucks.configure(viewsDir, {
  express: app,
  autoescape: true,
  watch: !isProduction,
  noCache: !isProduction
});

nunjucksEnv.addFilter('money', money);
nunjucksEnv.addFilter('date', date);
nunjucksEnv.addFilter('plural', plural);
nunjucksEnv.addFilter('initials', initials);

configurePassport();

app.set('view engine', 'njk');

app.use('/', authRouter);
app.use('/api', requireRole(ROLES.ADMIN), apiRouter);
app.use('/users', requireRole(ROLES.ADMIN), userRouter);
app.use('/', workflowRouter);
app.use('/', pageRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Маршрут не знайдено' });
  }

  return res.status(404).render('shared/error.njk', {
    title: 'Сторінку не знайдено',
    message: 'Такої сторінки не існує.',
    active: ''
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (req.path.startsWith('/api')) {
    return res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }

  return res.status(500).render('shared/error.njk', {
    title: 'Помилка',
    message: 'Не вдалося завантажити сторінку. Спробуйте ще раз.',
    active: ''
  });
});

export default app;
