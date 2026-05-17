import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const consultRouter = Router();
consultRouter.use(requireAuth);

consultRouter.get('/', async (req: AuthRequest, res) => {
  const list = await prisma.consultation.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
  });
  res.json(list);
});

consultRouter.post('/', async (req: AuthRequest, res) => {
  const { country, visaType, problem, preferredAt, contactType, managerId } =
    req.body as {
      country?: string;
      visaType?: string;
      problem?: string;
      preferredAt?: string;
      contactType?: string;
      managerId?: string;
    };

  if (!country || !visaType || !problem) {
    res.status(400).json({ error: 'country, visaType, problem обязательны' });
    return;
  }

  const consultation = await prisma.consultation.create({
    data: {
      userId: req.userId!,
      country,
      visaType,
      problem,
      preferredAt: preferredAt ?? null,
      contactType: contactType ?? 'chat',
      managerId: managerId ?? null,
    },
  });

  res.status(201).json(consultation);
});
