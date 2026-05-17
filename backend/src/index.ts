import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth.js';
import { referenceRouter } from './routes/reference.js';
import { checklistRouter } from './routes/checklist.js';
import { documentsRouter } from './routes/documents.js';
import { newsRouter } from './routes/news.js';
import { consultRouter } from './routes/consult.js';
import { userRouter } from './routes/user.js';

const app = express();
const port = Number(process.env.PORT) || 3001;
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(
  cors({
    origin: [frontendUrl, 'https://web.telegram.org'],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'visa-pro-api' });
});

app.use('/api/auth', authRouter);
app.use('/api', referenceRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/news', newsRouter);
app.use('/api/consult', consultRouter);
app.use('/api/user', userRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Внутренняя ошибка' });
  }
);

app.listen(port, () => {
  console.log(`Visa Pro API: http://localhost:${port}`);
});
