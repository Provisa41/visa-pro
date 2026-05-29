import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { cors, json } from './lib/response';
import { getAuth, signToken, validateTelegramInitData } from './lib/auth';
import countries from './data/countries.json';
import faq from './data/faq.json';
import managers from './data/managers.json';
import newsData from './data/news.json';
import {
  countryOverrides,
  schengenBusiness,
  schengenTourist,
  SCHENGEN_COUNTRIES,
} from './checklist-lib';

const VISA_TYPES = [
  { id: 'tourist', label: 'Туристическая' },
  { id: 'business', label: 'Деловая' },
  { id: 'transit', label: 'Транзитная' },
  { id: 'student', label: 'Учебная' },
];

type ChecklistItem = {
  id: string;
  title: string;
  instruction: string;
  required: boolean;
  status?: 'ready' | 'needed' | 'none';
};

function getTemplate(country: string, visaType: string): ChecklistItem[] {
  const override = countryOverrides[country]?.[visaType];
  if (override?.length) return [...override];
  if (visaType === 'business' && SCHENGEN_COUNTRIES.includes(country)) {
    return [...schengenBusiness];
  }
  if (visaType === 'tourist' && SCHENGEN_COUNTRIES.includes(country)) {
    return [...schengenTourist];
  }
  if (visaType === 'tourist') return [...schengenTourist];
  if (visaType === 'business') return [...schengenBusiness];
  return [...schengenTourist];
}

function mockReport(fileName: string) {
  return {
    overall: 'issues' as const,
    summary:
      'Демо-режим: добавьте OPENAI_API_KEY в настройках Vercel для полной AI-проверки.',
    items: [
      {
        document: fileName,
        status: 'warning' as const,
        message: 'Проверьте соответствие требованиям консульства.',
      },
    ],
    recommendations: [
      'Убедитесь в сроке действия паспорта',
      'Проверьте формат фотографии',
    ],
  };
}

export async function handleApi(
  req: VercelRequest,
  res: VercelResponse,
  segments: string[]
): Promise<void> {
  if (cors(req, res)) return;

  const method = req.method ?? 'GET';
  const path = segments.join('/');

  if (path === 'health' || path === '') {
    json(res, 200, { status: 'ok', service: 'visa-pro-api' });
    return;
  }

  if (path === 'auth/telegram' && method === 'POST') {
    const { initData } = (req.body ?? {}) as { initData?: string };
    if (!initData) {
      json(res, 400, { error: 'initData обязателен' });
      return;
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
    let tgUser = botToken ? validateTelegramInitData(initData, botToken) : null;
    if (!tgUser) {
      try {
        const parsed = JSON.parse(initData) as {
          user?: { id: number; first_name?: string; username?: string };
        };
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
    return;
  }

  if (path === 'countries') {
    json(res, 200, countries);
    return;
  }

  if (path === 'visa-types') {
    json(res, 200, VISA_TYPES);
    return;
  }

  if (path === 'managers') {
    const country = req.query.country as string | undefined;
    const list = country
      ? managers.filter((m) => m.specialties.includes(country))
      : managers;
    json(res, 200, list);
    return;
  }

  if (path === 'faq') {
    json(res, 200, faq);
    return;
  }

  if (path === 'news') {
    const country = req.query.country as string | undefined;
    const visaType = req.query.visaType as string | undefined;
    let items = [...newsData].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    if (country) items = items.filter((n) => n.country === country);
    if (visaType) items = items.filter((n) => n.visaType === visaType);
    items.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    json(res, 200, items);
    return;
  }

  const auth = getAuth(req);

  if (path === 'news/subscriptions') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    json(res, 200, []);
    return;
  }

  if (path === 'news/subscribe' && method === 'POST') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    json(res, 200, { ok: true });
    return;
  }

  const newsUnsub = path.match(/^news\/subscribe\/(.+)$/);
  if (newsUnsub && method === 'DELETE') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    json(res, 200, { ok: true });
    return;
  }

  const checklistMatch = path.match(/^checklist\/([^/]+)\/([^/]+)$/);
  if (checklistMatch) {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    const [, country, visaType] = checklistMatch;
    const template = getTemplate(country, visaType);
    if (method === 'GET') {
      const items = template.map((t) => ({ ...t, status: 'needed' as const }));
      json(res, 200, { country, visaType, items });
      return;
    }
    if (method === 'PUT') {
      const { items } = (req.body ?? {}) as { items?: ChecklistItem[] };
      if (!Array.isArray(items)) {
        json(res, 400, { error: 'items обязателен' });
        return;
      }
      const readyCount = items.filter((i) => i.status === 'ready').length;
      const progress = items.length
        ? Math.round((readyCount / items.length) * 100)
        : 0;
      json(res, 200, {
        country,
        visaType,
        items,
        progress,
        status: progress === 100 ? 'ready' : 'in_progress',
      });
      return;
    }
  }

  if (path === 'documents/analyze' && method === 'POST') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    const { fileName, mimeType, base64, country, visaType } = (req.body ?? {}) as {
      fileName?: string;
      mimeType?: string;
      base64?: string;
      country?: string;
      visaType?: string;
    };
    if (!fileName || !base64 || !country || !visaType) {
      json(res, 400, { error: 'fileName, base64, country, visaType обязательны' });
      return;
    }
    const checklist = getTemplate(country, visaType);
    const checklistText = checklist
      .map((c) => `- ${c.title}: ${c.instruction}`)
      .join('\n');
    let report = mockReport(fileName);
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && mimeType?.startsWith('image/')) {
      try {
        const client = new OpenAI({ apiKey });
        const prompt = `Ты визовый эксперт. Проанализируй документ "${fileName}" для визы: страна=${country}, тип=${visaType}.
Требования:
${checklistText}
Ответь строго JSON:
{"overall":"ok"|"issues"|"rejected","summary":"...","items":[{"document":"...","status":"ok"|"warning"|"error","message":"..."}],"recommendations":["..."]}`;
        const response = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: `data:${mimeType};base64,${base64}` },
                },
              ],
            },
          ],
          max_tokens: 1500,
        });
        const text = response.choices[0]?.message?.content ?? '';
        const match = text.match(/\{[\s\S]*\}/);
        if (match) report = JSON.parse(match[0]);
      } catch {
        /* mock */
      }
    }
    json(res, 200, {
      id: `doc_${Date.now()}`,
      report,
      createdAt: new Date().toISOString(),
    });
    return;
  }

  if (path === 'documents/history') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    json(res, 200, []);
    return;
  }

  if (path === 'consult') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    if (method === 'GET') {
      json(res, 200, []);
      return;
    }
    if (method === 'POST') {
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
  }

  if (path === 'user/me') {
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
    return;
  }

  if (path === 'user/application/latest') {
    if (!auth) {
      json(res, 401, { error: 'Требуется авторизация' });
      return;
    }
    json(res, 200, null);
    return;
  }

  json(res, 404, { error: 'Not found', path });
}
