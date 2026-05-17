import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { VercelRequest } from '@vercel/node';

const secret = process.env.JWT_SECRET ?? 'vercel-dev-secret-change-me';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface JwtPayload {
  userId: string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export function validateTelegramInitData(
  initData: string,
  botToken: string
): TelegramUser | null {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  if (calculatedHash !== hash) return null;
  const userStr = params.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as TelegramUser;
  } catch {
    return null;
  }
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function getAuth(req: VercelRequest): JwtPayload | null {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
