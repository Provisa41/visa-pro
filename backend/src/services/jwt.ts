import jwt, { type SignOptions } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

export interface JwtPayload {
  userId: string;
  telegramId: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
