import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from './lib/response.js';

const VISA_TYPES = [
  { id: 'tourist', label: 'Туристическая' },
  { id: 'business', label: 'Деловая' },
  { id: 'transit', label: 'Транзитная' },
  { id: 'student', label: 'Учебная' },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  json(res, 200, VISA_TYPES);
}
