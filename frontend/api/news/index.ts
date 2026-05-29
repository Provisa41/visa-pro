import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../lib/response';
import newsData from '../data/news.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;

  const country = req.query.country as string | undefined;
  const visaType = req.query.visaType as string | undefined;

  let items = [...newsData].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (country) items = items.filter((n) => n.country === country);
  if (visaType) items = items.filter((n) => n.visaType === visaType);
  items.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  json(res, 200, items);
}
