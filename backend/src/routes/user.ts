import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.get('/me', async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    include: {
      applications: { orderBy: { updatedAt: 'desc' }, take: 5 },
      docChecks: { orderBy: { createdAt: 'desc' }, take: 5 },
      consultations: { orderBy: { createdAt: 'desc' }, take: 5 },
      newsSubscriptions: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }

  res.json({
    id: user.id,
    telegramId: user.telegramId.toString(),
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    applications: user.applications,
    docChecks: user.docChecks,
    consultations: user.consultations,
    newsSubscriptions: user.newsSubscriptions.map((s) => s.country),
  });
});

userRouter.get('/application/latest', async (req: AuthRequest, res) => {
  const app = await prisma.application.findFirst({
    where: { userId: req.userId! },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(app);
});
