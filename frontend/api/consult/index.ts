import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../lib/response';
import { getAuth } from '../lib/auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;

  const auth = getAuth(req);
  if (!auth) {
    json(res, 401, { error: 'Требуется авторизация' });
    return;
  }

  if (req.method === 'GET') {
    json(res, 200, []);
    return;
  }

  if (req.method === 'POST') {
    const { country, visaType, problem } = (req.body ?? {}) as {
      country?: string;
      visaType?: string;
      problem?: string;
    };
    if (!country || !visaType || !problem) {
      json(res, 400, { error: 'country, visaType, problem обязательны' });
      return;
    }
    json(res, 201, {
      id: `consult_${Date.now()}`,
      country,
      visaType,
      problem,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
}
