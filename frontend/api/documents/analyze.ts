import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { cors, json } from '../lib/response.js';
import { getAuth } from '../lib/auth.js';
import templates from '../data/checklist-templates.json';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const auth = getAuth(req);
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

  const countryData = templates[country as keyof typeof templates];
  const checklist =
    countryData && (countryData as Record<string, { title: string; instruction: string }[]>)[visaType]
      ? (countryData as Record<string, { title: string; instruction: string }[]>)[visaType]
      : [];

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
      /* keep mock */
    }
  }

  json(res, 200, {
    id: `doc_${Date.now()}`,
    report,
    createdAt: new Date().toISOString(),
  });
}
