import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from './lib/response';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  json(res, 200, { status: 'ok', service: 'visa-pro-api' });
}
