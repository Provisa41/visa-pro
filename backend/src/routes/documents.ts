import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import templates from '../data/checklist-templates.json' with { type: 'json' };
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { analyzeDocument } from '../services/openai.js';
import type { Prisma } from '@prisma/client';
import type { ChecklistItemTemplate } from '../types.js';
import { param } from '../utils/params.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Допустимы только JPG, PNG, WEBP, PDF'));
  },
});

export const documentsRouter = Router();
documentsRouter.use(requireAuth);

function getChecklist(country: string, visaType: string): ChecklistItemTemplate[] {
  const countryData = templates[country as keyof typeof templates];
  if (!countryData) return [];
  return (countryData as Record<string, ChecklistItemTemplate[]>)[visaType] ?? [];
}

documentsRouter.post(
  '/analyze',
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      const file = req.file;
      const { country, visaType } = req.body as {
        country?: string;
        visaType?: string;
      };

      if (!file || !country || !visaType) {
        res.status(400).json({ error: 'file, country, visaType обязательны' });
        return;
      }

      const buffer = fs.readFileSync(file.path);
      const checklist = getChecklist(country, visaType);
      const report = await analyzeDocument(
        file.originalname,
        file.mimetype,
        buffer,
        country,
        visaType,
        checklist
      );

      const docCheck = await prisma.docCheck.create({
        data: {
          userId: req.userId!,
          country,
          visaType,
          fileName: file.originalname,
          fileUrl: `/uploads/${path.basename(file.path)}`,
          report: report as unknown as Prisma.InputJsonValue,
        },
      });

      res.json({ id: docCheck.id, report, createdAt: docCheck.createdAt });
    } catch (e) {
      res.status(500).json({
        error: e instanceof Error ? e.message : 'Ошибка анализа',
      });
    }
  }
);

documentsRouter.get('/history', async (req: AuthRequest, res) => {
  const history = await prisma.docCheck.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json(history);
});

documentsRouter.get('/:id', async (req: AuthRequest, res) => {
  const doc = await prisma.docCheck.findFirst({
    where: { id: param(req.params.id), userId: req.userId! },
  });
  if (!doc) {
    res.status(404).json({ error: 'Не найдено' });
    return;
  }
  res.json(doc);
});
