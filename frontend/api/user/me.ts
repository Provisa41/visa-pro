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

  json(res, 200, {
    id: auth.userId,
    telegramId: auth.telegramId,
    username: auth.username ?? null,
    firstName: auth.firstName ?? null,
    lastName: auth.lastName ?? null,
    photoUrl: auth.photoUrl ?? null,
    applications: [],
    docChecks: [],
    consultations: [],
    newsSubscriptions: [],
  });
}
