import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../lib/response';
import { getAuth } from '../lib/auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (!getAuth(req)) {
    json(res, 401, { error: 'Требуется авторизация' });
    return;
  }
  json(res, 200, []);
}
