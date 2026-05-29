import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from './lib/response';
import managers from './data/managers.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  const country = req.query.country as string | undefined;
  const list = country
    ? managers.filter((m) => m.specialties.includes(country))
    : managers;
  json(res, 200, list);
}
