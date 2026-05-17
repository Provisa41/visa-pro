import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from './lib/response.js';
import faq from '../backend/src/data/faq.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  json(res, 200, faq);
}
