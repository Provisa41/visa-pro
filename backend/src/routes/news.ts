import { Router } from 'express';
import newsData from '../data/news.json' with { type: 'json' };
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { param } from '../utils/params.js';

export const newsRouter = Router();

newsRouter.get('/', (req, res) => {
  const country = req.query.country as string | undefined;
  const visaType = req.query.visaType as string | undefined;

  let items = [...newsData].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (country) items = items.filter((n) => n.country === country);
  if (visaType) items = items.filter((n) => n.visaType === visaType);

  items.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  res.json(items);
});

newsRouter.use(requireAuth);

newsRouter.get('/subscriptions', async (req: AuthRequest, res) => {
  const subs = await prisma.newsSubscription.findMany({
    where: { userId: req.userId! },
  });
  res.json(subs.map((s) => s.country));
});

newsRouter.post('/subscribe', async (req: AuthRequest, res) => {
  const { country } = req.body as { country?: string };
  if (!country) {
    res.status(400).json({ error: 'country обязателен' });
    return;
  }

  await prisma.newsSubscription.upsert({
    where: {
      userId_country: { userId: req.userId!, country },
    },
    create: { userId: req.userId!, country },
    update: {},
  });

  res.json({ ok: true, country });
});

newsRouter.delete('/subscribe/:country', async (req: AuthRequest, res) => {
  await prisma.newsSubscription.deleteMany({
    where: { userId: req.userId!, country: param(req.params.country) },
  });
  res.json({ ok: true });
});
