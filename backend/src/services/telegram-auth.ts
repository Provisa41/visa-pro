import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

/** Validates Telegram WebApp initData per https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app */
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

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) return null;

  const authDate = Number(params.get('auth_date'));
  if (authDate && Date.now() / 1000 - authDate > 86400) return null;

  const userStr = params.get('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as TelegramUser;
  } catch {
    return null;
  }
}

/** Dev fallback when BOT_TOKEN not set */
export function parseDevUser(initData: string): TelegramUser | null {
  try {
    const parsed = JSON.parse(initData) as { user?: TelegramUser };
    if (parsed.user?.id) return parsed.user;
    if ((parsed as TelegramUser).id) return parsed as TelegramUser;
  } catch {
    /* ignore */
  }
  return null;
}
