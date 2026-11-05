import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/api.routes.js';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(publicDir));
app.use('/api', apiRouter);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не знайдено' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
});

export default app;
