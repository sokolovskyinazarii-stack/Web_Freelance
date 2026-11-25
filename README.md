# FreelanceHub

Платформа для фрілансу: фрілансери, замовники, проєкти, замовлення, статуси, кур’єри та доставки.
Серверний рендеринг сторінок і REST API працюють на одному Express-застосунку.

## Стек

- Node.js 22, ESM
- Express 5, `express-session`
- Prisma ORM 6, PostgreSQL
- Nunjucks
- Passport (`passport-local`), `bcryptjs`
- `connect-pg-simple` для сесій у PostgreSQL
- `generate-password` для генерації паролів
- `dotenv`

SQLite у проєкті більше не використовується. Застосунок працює лише з PostgreSQL
і читає `DATABASE_URL` зі змінних середовища.

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
- Скидання пароля в адмінці генерує новий 20-символьний пароль.

## Запуск

```bash
npm install
cp .env.example .env
# заповніть DATABASE_URL, DATABASE_URL_UNPOOLED і SESSION_SECRET
npm run db:reset
npm start
```

Сайт: `http://localhost:4000`.

`npm run db:reset` виконує `prisma db push --force-reset`, створює схему й додає
демонстраційні дані. Під час старту сервер не змінює схему й не сідить базу.

## База даних

- `prisma/schema.prisma` — моделі Prisma для PostgreSQL;
- `src/db/seed-data/*` — демонстраційні дані;
- `src/db/seed.js` — сід із bcrypt-хешами;
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
спрямовує всі запити на неї. У середовищі розгортання потрібно задати:

- `DATABASE_URL` — рядок підключення PostgreSQL (pooled);
- `DATABASE_URL_UNPOOLED` — пряме підключення для Prisma;
- `SESSION_SECRET` — довгий випадковий рядок;
- `DB_SSL=true`.

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
