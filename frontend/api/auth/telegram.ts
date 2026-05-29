import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors, json } from '../lib/response';
import { signToken, validateTelegramInitData } from '../lib/auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const { initData } = (req.body ?? {}) as { initData?: string };
  if (!initData) {
    json(res, 400, { error: 'initData обязателен' });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
  let tgUser = botToken ? validateTelegramInitData(initData, botToken) : null;

  if (!tgUser) {
    try {
      const parsed = JSON.parse(initData) as { user?: { id: number; first_name?: string; username?: string } };
      tgUser = parsed.user ?? (parsed as { id: number; first_name?: string });
    } catch {
      tgUser = { id: 100000001, first_name: 'Demo', username: 'demo_user' };
    }
  }

  const userId = `tg_${tgUser.id}`;
  const token = signToken({
    userId,
    telegramId: String(tgUser.id),
    firstName: tgUser.first_name ?? undefined,
    lastName: (tgUser as { last_name?: string }).last_name ?? undefined,
    username: tgUser.username ?? undefined,
    photoUrl: (tgUser as { photo_url?: string }).photo_url ?? undefined,
  });

  json(res, 200, {
    token,
    user: {
      id: userId,
      telegramId: String(tgUser.id),
      username: tgUser.username ?? null,
      firstName: tgUser.first_name ?? null,
      lastName: tgUser.last_name ?? null,
      photoUrl: tgUser.photo_url ?? null,
    },
  });
}
