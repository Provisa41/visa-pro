import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../services/jwt.js';
import {
  validateTelegramInitData,
  parseDevUser,
} from '../services/telegram-auth.js';

export const authRouter = Router();

authRouter.post('/telegram', async (req, res) => {
  const { initData } = req.body as { initData?: string };
  if (!initData) {
    res.status(400).json({ error: 'initData обязателен' });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
  let tgUser =
    botToken.length > 0
      ? validateTelegramInitData(initData, botToken)
      : parseDevUser(initData);

  if (!tgUser && process.env.NODE_ENV !== 'production') {
    tgUser = {
      id: 100000001,
      first_name: 'Demo',
      username: 'demo_user',
    };
  }

  if (!tgUser) {
    res.status(401).json({ error: 'Не удалось проверить данные Telegram' });
    return;
  }

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(tgUser.id) },
    create: {
      telegramId: BigInt(tgUser.id),
      username: tgUser.username ?? null,
      firstName: tgUser.first_name ?? null,
      lastName: tgUser.last_name ?? null,
      photoUrl: tgUser.photo_url ?? null,
    },
    update: {
      username: tgUser.username ?? null,
      firstName: tgUser.first_name ?? null,
      lastName: tgUser.last_name ?? null,
      photoUrl: tgUser.photo_url ?? null,
    },
  });

  const token = signToken({
    userId: user.id,
    telegramId: user.telegramId.toString(),
  });

  res.json({
    token,
    user: {
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
    },
  });
});
