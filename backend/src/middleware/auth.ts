import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt.js';

export interface AuthRequest extends Request {
  userId?: string;
  telegramId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Требуется авторизация' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Недействительный токен' });
    return;
  }

  req.userId = payload.userId;
  req.telegramId = payload.telegramId;
  next();
}
