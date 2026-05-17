import OpenAI from 'openai';
import type { ChecklistItemTemplate } from '../types.js';

const apiKey = process.env.OPENAI_API_KEY;

function getClient(): OpenAI | null {
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export interface DocAnalysisResult {
  overall: 'ok' | 'issues' | 'rejected';
  summary: string;
  items: Array<{
    document: string;
    status: 'ok' | 'warning' | 'error';
    message: string;
  }>;
  recommendations: string[];
}

export async function analyzeDocument(
  fileName: string,
  mimeType: string,
  buffer: Buffer,
  country: string,
  visaType: string,
  checklist: ChecklistItemTemplate[]
): Promise<DocAnalysisResult> {
  const client = getClient();
  const checklistText = checklist
    .map((c) => `- ${c.title}: ${c.instruction}`)
    .join('\n');

  if (!client) {
    return mockAnalysis(fileName, checklist);
  }

  const isImage = mimeType.startsWith('image/');
  const prompt = `Ты визовый эксперт. Проанализируй документ "${fileName}" для визы: страна=${country}, тип=${visaType}.
Требования:
${checklistText}

Ответь строго JSON:
{"overall":"ok"|"issues"|"rejected","summary":"...","items":[{"document":"...","status":"ok"|"warning"|"error","message":"..."}],"recommendations":["..."]}`;

  try {
    if (isImage) {
      const base64 = buffer.toString('base64');
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
      return parseJsonResponse(text);
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nФайл: ${fileName}, тип ${mimeType}. PDF без изображения — дай общие рекомендации по имени файла и типу визы.`,
        },
      ],
      max_tokens: 1500,
    });
    return parseJsonResponse(response.choices[0]?.message?.content ?? '');
  } catch {
    return mockAnalysis(fileName, checklist);
  }
}

export async function generateChecklistItems(
  country: string,
  visaType: string
): Promise<ChecklistItemTemplate[] | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Сгенерируй JSON-массив документов для туристической/деловой визы: страна ${country}, тип ${visaType}.
Формат: [{"id":"slug","title":"...","instruction":"...","required":true}]
Только JSON, на русском, 5-8 пунктов.`,
        },
      ],
      max_tokens: 1200,
    });
    const text = response.choices[0]?.message?.content ?? '[]';
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    return JSON.parse(match[0]) as ChecklistItemTemplate[];
  } catch {
    return null;
  }
}

function parseJsonResponse(text: string): DocAnalysisResult {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return mockAnalysis('document', []);
  try {
    return JSON.parse(match[0]) as DocAnalysisResult;
  } catch {
    return mockAnalysis('document', []);
  }
}

function mockAnalysis(
  fileName: string,
  checklist: ChecklistItemTemplate[]
): DocAnalysisResult {
  const items = checklist.slice(0, 3).map((c) => ({
    document: c.title,
    status: 'warning' as const,
    message: `Проверьте соответствие требованию: ${c.instruction.slice(0, 80)}...`,
  }));

  if (items.length === 0) {
    items.push({
      document: fileName,
      status: 'warning',
      message: 'Добавьте OPENAI_API_KEY для полноценной AI-проверки. Сейчас показан демо-отчёт.',
    });
  }

  return {
    overall: 'issues',
    summary:
      'Демо-режим: настройте OPENAI_API_KEY в .env для реальной проверки документов.',
    items,
    recommendations: [
      'Убедитесь, что фото соответствует биометрическим требованиям',
      'Проверьте срок действия паспорта',
      'При необходимости закажите консультацию с менеджером',
    ],
  };
}
