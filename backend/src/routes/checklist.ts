import { Router } from 'express';
import templates from '../data/checklist-templates.json' with { type: 'json' };
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { generateChecklistItems } from '../services/openai.js';
import type { Prisma } from '@prisma/client';
import type {
  ChecklistItemProgress,
  ChecklistItemTemplate,
  ChecklistItemStatus,
} from '../types.js';
import { param } from '../utils/params.js';

export const checklistRouter = Router();

checklistRouter.use(requireAuth);

function getTemplate(
  country: string,
  visaType: string
): ChecklistItemTemplate[] | null {
  const countryData = templates[country as keyof typeof templates];
  if (!countryData) return null;
  return (
    (countryData as Record<string, ChecklistItemTemplate[]>)[visaType] ?? null
  );
}

checklistRouter.get('/:country/:visaType', async (req: AuthRequest, res) => {
  const country = param(req.params.country);
  const visaType = param(req.params.visaType);
  const userId = req.userId!;

  let template = getTemplate(country, visaType);
  if (!template) {
    template = (await generateChecklistItems(country, visaType)) ?? [];
  }

  const saved = await prisma.checklistProgress.findUnique({
    where: {
      userId_country_visaType: { userId, country, visaType },
    },
  });

  const savedMap = new Map<string, ChecklistItemStatus>();
  if (saved?.items && Array.isArray(saved.items)) {
    for (const item of saved.items as unknown as ChecklistItemProgress[]) {
      savedMap.set(item.id, item.status);
    }
  }

  const items: ChecklistItemProgress[] = template.map((t) => ({
    ...t,
    status: savedMap.get(t.id) ?? 'needed',
  }));

  res.json({ country, visaType, items });
});

checklistRouter.put('/:country/:visaType', async (req: AuthRequest, res) => {
  const country = param(req.params.country);
  const visaType = param(req.params.visaType);
  const { items } = req.body as { items: ChecklistItemProgress[] };
  const userId = req.userId!;

  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'items обязателен' });
    return;
  }

  const itemsJson = items as unknown as Prisma.InputJsonValue;

  const progress = await prisma.checklistProgress.upsert({
    where: {
      userId_country_visaType: { userId, country, visaType },
    },
    create: { userId, country, visaType, items: itemsJson },
    update: { items: itemsJson },
  });

  const readyCount = items.filter((i) => i.status === 'ready').length;
  const progressPct = items.length
    ? Math.round((readyCount / items.length) * 100)
    : 0;

  const existing = await prisma.application.findFirst({
    where: { userId, country, visaType },
  });
  if (existing) {
    await prisma.application.update({
      where: { id: existing.id },
      data: {
        progress: progressPct,
        status: progressPct === 100 ? 'ready' : 'in_progress',
      },
    });
  } else {
    await prisma.application.create({
      data: {
        userId,
        country,
        visaType,
        progress: progressPct,
        status: progressPct === 100 ? 'ready' : 'in_progress',
      },
    });
  }

  res.json(progress);
});
