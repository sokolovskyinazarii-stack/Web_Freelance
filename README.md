# FreelanceHub

Платформа для фрілансу: проєкти, замовлення, заявки, статуси, кур’єри та доставки.
Сторінки й REST API працюють на одному Express-застосунку.

Демо: https://freelancehub-g4k0.onrender.com

## Стек

- Node.js 22, ESM
- Express 5, `express-session`
- PostgreSQL 18 (Neon), Prisma 6
- Nunjucks
- Passport (`passport-local`), `bcryptjs`
- `connect-pg-simple` для сесій у PostgreSQL
- `generate-password` для паролів

Локальної бази немає: застосунок працює лише з Neon через `DATABASE_URL` і
`DATABASE_URL_UNPOOLED`.

## Ролі

- **Відвідувач** переглядає проєкти, фрілансерів і категорії.
- **Замовник** створює замовлення, обирає виконавця, приймає роботу.
- **Фрілансер** подає заявки, виконує роботу.
- **Кур’єр** приймає доставки та підтверджує вручення.
- **Адміністратор** керує довідниками, користувачами, модерацією та доставками.

## Демо-акаунти

| Роль | Email | Пароль |
| --- | --- | --- |
| Адміністратор | `admin@freelancehub.ua` | `2ye6{%A;baD%&aQ8Gp?q` |
| Фрілансер | `lev.kravchenko@freelancehub.ua` | `>/msQ+Qr1pQ(5+r&9{K.` |
| Замовник | `roman.shevchuk@freelancehub.ua` | `PZ]%TPh>3.gYS3XkQZQh` |
| Кур’єр | `daria.sereda@freelancehub.ua` | `tD{;eB7"9<Y#t^5"dFVR` |

Паролі згенеровані `generate-password` (20 символів) і зберігаються в
`src/db/seed-data/users.js` у відкритому вигляді; в базу потрапляють bcrypt-хеші
з cost 12. Повний список також у `prisma/seed-accounts.txt` (файл не комітиться).

## Запуск

```bash
npm install
cp .env.example .env
# DATABASE_URL, DATABASE_URL_UNPOOLED — з консолі Neon
# SESSION_SECRET — довгий випадковий рядок
npm run db:reset
npm start
```

Сайт: `http://localhost:4000`.

## Скидання бази

Після видалення або псування даних:

1. запустіть `reset-db.cmd` у корені проєкту;
2. введіть `RESET` для підтвердження.

Скрипт перевіряє Node.js і `.env`, за потреби встановлює залежності, генерує
Prisma Client і виконує `npm run db:reset`. Команда робить
`prisma db push --force-reset` проти Neon і заповнює базу з
`src/db/seed-data/*`. Усі наявні записи буде видалено.

Те саме вручну:

```bash
npm run db:reset
```

## База даних

- `prisma/schema.prisma` — моделі, зокрема `Session` для сесій;
- `src/db/seed-data/*` — демонстраційні дані;
- `src/db/seed.js` — сід із bcrypt-хешами;
- `src/db/sequences.js` — синхронізація послідовностей після явних `id`;
- `scripts/db-reset.mjs` — очищення й повторне заповнення.

## Розгортання на Render

Сервіс `freelancehub` (Frankfurt, free) уже створений у Render і підключений до
публічного репозиторію. Безплатний інстанс засинає після простою, тому перший
запит може тривати до 50 секунд.

У репозиторії є `render.yaml` (Blueprint):

- runtime: Node;
- build: `npm install --include=dev && npm run build`;
- start: `npm start`;
- health check: `/healthz`;
- region: Frankfurt;
- змінні: `NODE_ENV`, `DB_SSL`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`,
  `SESSION_SECRET`.

`DATABASE_URL` і `DATABASE_URL_UNPOOLED` треба вставити з Neon, решту Render
бере з `render.yaml` (`SESSION_SECRET` генерується автоматично).

### Health check і холодний старт

`GET /healthz` відповідає `200 { "status": "ok", "db": "ok", "dbCheckedAt": ... }`.
Сесія для health-check не створюється.

Запит `SELECT 1` до PostgreSQL виконується **не частіше ніж раз на 3 години**.
Монітор пінгує `/healthz` кожні 5 хвилин, але база перевіряється лише коли минув
інтервал; решта пінгів повертають закешований статус без звернення до Neon.
Інтервал можна змінити змінною `DB_WARM_INTERVAL_MS` (у мілісекундах).

Render Free засинає після ~15 хвилин без запитів, тому перший запит може тривати
30–50 секунд. Варіанти:

- Render Starter (платний) — інстанс не засинає;
- безкоштовний монітор (UptimeRobot / cron-job.org / Cloudflare Worker Cron), який
  раз на 5 хвилин відкриває `/healthz`. Це тримає Render активним, а Neon будиться
  лише раз на 3 години.

Один запит до Neon тримає compute активною приблизно 5 хвилин, тому перевірка
раз на 3 години — це близько 20 compute-годин на місяць, а не 730.

Після першого деплою база вже засіяна локальною командою `db:reset`; повторно
сіяти на Render не потрібно.

## REST API

Базовий шлях `/api`, доступ лише для адміністратора.

| Метод | Шлях | Опис |
| --- | --- | --- |
| GET | `/api/overview` | агрегована статистика |
| GET | `/api/freelancers` | фрілансери |
| GET | `/api/freelancers/:id` | один фрілансер |
| GET | `/api/customers` | замовники |
| GET | `/api/categories` | категорії |
| GET | `/api/projects` | проєкти |
| GET | `/api/orders` | замовлення |
| GET | `/api/statuses` | статуси |
| GET | `/api/deliveries` | доставки |
| GET | `/api/couriers` | кур’єри |

Для кожної сутності працює `GET /api/<resource>/:id`.

## Інтерфейс

- `/` — огляд;
- `/login`, `/register` — вхід і реєстрація;
- `/profile`, `/profile/edit` — профіль і пароль;
- `/freelancers`, `/customers`, `/projects`, `/categories`;
- `/orders`, `/statuses`, `/deliveries`, `/couriers`;
- `/users` — користувачі (адміністратор).

CSS: `src/public/css/{base,layout,components,forms,overlays,pages}.css`.
Поява при скролі — `src/public/js/core/reveal.js`, інтерфейс — `core/ui.js`.

## Структура

```text
prisma/schema.prisma     моделі Prisma
render.yaml              Render Blueprint
reset-db.cmd             очищення й заповнення бази
scripts/db-reset.mjs     скрипт скидання
src/api/                 REST API
src/auth/                Passport, ролі, паролі
src/controllers/         контролери сторінок
src/db/                  Prisma Client, сід, послідовності
src/presenters/          підготовка даних для шаблонів
src/public/              CSS, JS, іконки
src/views/               Nunjucks-шаблони
src/app.js               Express-застосунок
src/server.js            запуск
```
