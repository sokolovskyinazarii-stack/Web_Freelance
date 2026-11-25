import 'dotenv/config';
import app from '../src/app.js';

// Prisma підключається ліниво під час першого запиту.
// Статика віддається до сесій, тому CSS/JS не залежать від PostgreSQL.
export default app;
