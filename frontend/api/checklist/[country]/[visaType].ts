import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../../lib/response';
import { getAuth } from '../../lib/auth';
import templates from '../../data/checklist-templates.json';

type Item = {
  id: string;
  title: string;
  instruction: string;
  required: boolean;
  status?: 'ready' | 'needed' | 'none';
};

function getTemplate(country: string, visaType: string): Item[] {
  const countryData = templates[country as keyof typeof templates];
  if (!countryData) return [];
  return (countryData as Record<string, Item[]>)[visaType] ?? [];
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;

  const auth = getAuth(req);
  if (!auth) {
    json(res, 401, { error: 'Требуется авторизация' });
    return;
  }

  const country = String(req.query.country);
  const visaType = String(req.query.visaType);
  const template = getTemplate(country, visaType);

  if (req.method === 'GET') {
    const items = template.map((t) => ({ ...t, status: 'needed' as const }));
    json(res, 200, { country, visaType, items });
    return;
  }

  if (req.method === 'PUT') {
    const { items } = (req.body ?? {}) as { items?: Item[] };
    if (!Array.isArray(items)) {
      json(res, 400, { error: 'items обязателен' });
      return;
    }
    const readyCount = items.filter((i) => i.status === 'ready').length;
    const progress = items.length ? Math.round((readyCount / items.length) * 100) : 0;
    json(res, 200, {
      country,
      visaType,
      items,
      progress,
      status: progress === 100 ? 'ready' : 'in_progress',
    });
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
}
