import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApi } from './router';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const raw = req.query.path;
  const segments = Array.isArray(raw)
    ? raw
    : raw
      ? [raw]
      : [];
  await handleApi(req, res, segments);
}
