import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../../lib/response.js';
import { getAuth } from '../../lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (!getAuth(req)) {
    json(res, 401, { error: 'Требуется авторизация' });
    return;
  }
  json(res, 200, { ok: true });
}
