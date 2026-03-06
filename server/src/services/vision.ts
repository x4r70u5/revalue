import { SYSTEM_PROMPT, USER_PROMPT } from './prompts.js';
import type { EstimateResponse } from '../../../shared/types.js';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export async function analyzeDevicePhotos(
  photos: Array<{ buffer: Buffer; mimeType: string }>
): Promise<EstimateResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseURL = process.env.ANTHROPIC_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!apiKey) {
    throw new Error('Brak klucza API. Ustaw ANTHROPIC_API_KEY w pliku .env');
  }

  const imageContent = photos.map((photo) => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:${photo.mimeType};base64,${photo.buffer.toString('base64')}`,
    },
  }));

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: [
        ...imageContent,
        { type: 'text', text: USER_PROMPT },
      ],
    },
  ];

  const res = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4.6',
      max_tokens: 2048,
      messages,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('OpenRouter error:', res.status, errorText);
    throw new Error(`Blad API (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Brak odpowiedzi z modelu AI');
  }

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  const parsed = JSON.parse(cleaned) as EstimateResponse;
  return parsed;
}
