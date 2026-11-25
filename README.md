# FreelanceHub

Платформа для фрілансу: фрілансери, замовники, проєкти, замовлення, статуси, кур’єри та доставки.
Серверний рендеринг сторінок і REST API працюють на одному Express-застосунку.

## Стек

- Node.js 22, ESM
- Express 5, `express-session`
- Prisma ORM 6, PostgreSQL 18 (Neon)
- Nunjucks
- Passport (`passport-local`), `bcryptjs`
- `connect-pg-simple` для сесій у PostgreSQL
- `generate-password` для генерації паролів
- `dotenv`

## База даних — лише Neon

Проєкт працює **тільки** з хмарною PostgreSQL у Neon. Локальної бази, SQLite-файлу
чи резервного підключення немає: якщо `DATABASE_URL` не заданий, застосунок не стартує
в production, а локальний запуск не має куди писати.

- `DATABASE_URL` — pooled-рядок Neon для застосунку й сесій;
- `DATABASE_URL_UNPOOLED` — прямий рядок для `prisma db push` / `prisma generate`;
- `DB_SSL=true` — Neon вимагає TLS.

Обидва рядки беруться з консолі Neon (Connection details → Pooled / Direct).
`.env` не комітиться; у репозиторії є лише `.env.example`.

## Стек інтерфейсу

Новий візуальний напрям — «операційний журнал»: темне чорнило, кістяний текст,
мідний акцент, серифні заголовки `Instrument Serif`, текст `Instrument Sans`,
цифри `JetBrains Mono`. Замість карток — аркуші з волосяними лініями, замість
бокової панелі — рухома «рейка» з назвою розділу та діями.

- CSS: `src/public/css/{base,layout,components,forms,overlays,pages}.css`;
- рух: власні криві `cubic-bezier`, press-стан `scale(0.97)`, поява сторінки одним
  кадром, `@starting-style` для меню й модалок, повага до `prefers-reduced-motion`;
- числа — `font-variant-numeric: tabular-nums`, текст — не ширше 65ch.

## Ролі

- **Відвідувач** бачить публічний огляд платформи.
- **Замовник** створює замовлення, обирає виконавця та приймає роботу.
- **Фрілансер** подає заявки, виконує роботу й отримує оплату.
- **Кур’єр** приймає доставки та відмічає вручення.
- **Адміністратор** керує довідниками, користувачами, модерацією та доставками.

## Демо-акаунти

| Роль | Email | Пароль |
| --- | --- | --- |
| Адміністратор | `admin@freelancehub.ua` | `2ye6{%A;baD%&aQ8Gp?q` |
| Фрілансер | `lev.kravchenko@freelancehub.ua` | `>/msQ+Qr1pQ(5+r&9{K.` |
| Замовник | `roman.shevchuk@freelancehub.ua` | `PZ]%TPh>3.gYS3XkQZQh` |
| Кур’єр | `daria.sereda@freelancehub.ua` | `tD{;eB7"9<Y#t^5"dFVR` |

## Паролі

- Демонстраційні паролі згенеровані бібліотекою `generate-password`: 20 символів,
  великі й малі літери, цифри та символи.
- У `src/db/seed-data/users.js` паролі лежать у відкритому вигляді, у базу потрапляють
  як bcrypt-хеші з cost 12.
- Нові паролі у формі перевіряються на довжину (12+), літеру й цифру.
- Скидання пароля в адмінці генерує новий 20-символьний пароль і показує його один раз.

## Запуск

```bash
npm install
cp .env.example .env
# вставте DATABASE_URL і DATABASE_URL_UNPOOLED з Neon, додайте SESSION_SECRET
npm run db:reset
npm start
```

Сайт: `http://localhost:4000`.

`npm run db:reset` виконує `prisma db push --force-reset` **проти Neon**, створює схему
й додає демонстраційні дані. Це видаляє всі наявні записи в цій базі — не запускайте
команду на базі з реальними даними. Під час старту сервер не змінює схему й не сідить базу.

Якщо `db:reset` не потрібен, достатньо `npm run build` (Prisma Client) і `npm start`
на вже засіяній базі.

## База даних

- `prisma/schema.prisma` — моделі Prisma для PostgreSQL, `Session` для сесій;
- `src/db/seed-data/*` — демонстраційні дані;
- `src/db/seed.js` — сід із bcrypt-хешами;
- `src/db/sequences.js` — синхронізація послідовностей після сіду з явними `id`;
- `scripts/db-reset.mjs` — повне перестворення бази.

Після явних `id` у сіді послідовності PostgreSQL синхронізуються, тому нові записи
не конфліктують з демо-даними.

## REST API

Базовий шлях: `/api`. Доступ має адміністратор.

| Метод | Шлях | Опис |
| --- | --- | --- |
| GET | `/api/overview` | агрегована статистика |
| GET | `/api/freelancers` | список фрілансерів |
| GET | `/api/freelancers/:id` | один фрілансер |
| GET | `/api/customers` | список замовників |
| GET | `/api/categories` | список категорій |
| GET | `/api/projects` | список проєктів |
| GET | `/api/orders` | список замовлень |
| GET | `/api/statuses` | довідник статусів |
| GET | `/api/deliveries` | список доставок |
| GET | `/api/couriers` | список кур’єрів |

Для кожної сутності також працює `GET /api/<resource>/:id`.

## Інтерфейс

- `/` — публічний огляд;
- `/login`, `/register` — вхід і реєстрація;
- `/profile`, `/profile/edit` — профіль і зміна пароля;
- `/freelancers`, `/customers`, `/projects`, `/categories`;
- `/orders`, `/statuses`, `/deliveries`, `/couriers`;
- `/users` — керування користувачами (адміністратор).

Для списків є пошук, для записів — сторінки деталей і пов’язаних сутностей.

## Розгортання

`api/index.js` експортує Express-застосунок як serverless-функцію, `vercel.json`
спрямовує всі запити на неї та включає `src/**/*` у функцію. У Vercel треба задати:

- `DATABASE_URL` — pooled-рядок Neon;
- `DATABASE_URL_UNPOOLED` — прямий рядок Neon;
- `SESSION_SECRET` — довгий випадковий рядок;
- `DB_SSL=true`;
- `NODE_ENV=production`.

`npm run build` виконує `prisma generate`; `postinstall` робить те саме під час
встановлення залежностей. Prisma Client зібраний із `binaryTargets`
`["native", "rhel-openssl-3.0.x"]` для runtime Vercel.

## Структура

```text
api/index.js            serverless-адаптер
prisma/schema.prisma    моделі Prisma
scripts/db-reset.mjs    перестворення бази
src/api/                REST API
src/auth/               Passport, ролі, паролі
src/controllers/        контролери сторінок і процесів
src/db/                 Prisma Client, сід, послідовності
src/public/             CSS, JS, іконки
src/views/              Nunjucks-шаблони
src/app.js              Express-застосунок
src/server.js           локальний запуск
```
