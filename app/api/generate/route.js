import { NextResponse } from 'next/server';
import { CLAUDE_MODEL, getClaudeClient } from '../../../lib/claude';

const WORD_RANGES = {
  '1 min': { min: 120, max: 150 },
  '3 min': { min: 350, max: 450 },
  '5 min': { min: 700, max: 900 },
  '10 min': { min: 1300, max: 1600 },
};

const LENGTH_ALIASES = {
  '1 minute': '1 min',
  '3 minutes': '3 min',
  '5 minutes': '5 min',
  '10 minutes': '10 min',
};

const TONE_GUIDANCE = {
  Dramatic:
    'Use vivid language, emotional stakes, and narrative tension while keeping the flow natural for voiceover.',
  Neutral:
    'Use clear and balanced language, informative pacing, and objective narration without sounding dry.',
  Uplifting:
    'Use hopeful language, encouraging phrasing, and momentum that leaves the audience inspired.',
};

function normalizeLength(length) {
  const value = String(length || '').trim();
  return LENGTH_ALIASES[value] || value;
}

function validatePayload(body) {
  const idea = typeof body?.idea === 'string' ? body.idea.trim() : '';
  const tone = typeof body?.tone === 'string' ? body.tone.trim() : '';
  const length = normalizeLength(body?.length);

  if (!idea) {
    return { error: 'Idea is required' };
  }

  if (idea.length > 2000) {
    return { error: 'Idea is too long' };
  }

  if (!Object.prototype.hasOwnProperty.call(TONE_GUIDANCE, tone)) {
    return { error: 'Invalid tone value' };
  }

  if (!Object.prototype.hasOwnProperty.call(WORD_RANGES, length)) {
    return { error: 'Invalid length value' };
  }

  return { idea, tone, length };
}

function buildPrompt({ idea, tone, length }) {
  const wordRange = WORD_RANGES[length];

  return [
    `Write a ${tone.toLowerCase()} video script about: ${idea}.`,
    `Target duration: ${length}.`,
    '',
    'Make it engaging, natural, and suitable for voiceover narration.',
    TONE_GUIDANCE[tone],
    `Target word count: ${wordRange.min}-${wordRange.max} words.`,
    '',
    'Structure requirements:',
    '- Hook: 1 short opening paragraph that grabs attention.',
    '- Main Content: clear progression of the story or explanation with smooth transitions.',
    '- Ending: a satisfying close with a strong final line.',
    '',
    'Return plain text only in this exact format:',
    'Hook:',
    '<content>',
    '',
    'Main Content:',
    '<content>',
    '',
    'Ending:',
    '<content>',
    '',
    'No markdown code fences. No extra sections.',
  ].join('\n');
}

function extractText(messageResponse) {
  const blocks = Array.isArray(messageResponse?.content) ? messageResponse.content : [];

  return blocks
    .filter((block) => block?.type === 'text' && typeof block?.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function mapClaudeError(error) {
  const status = Number(error?.status || error?.response?.status || 500);

  if (status === 401) {
    return createHttpError(401, 'Missing x-candidate-token header');
  }

  if (status === 403) {
    return createHttpError(403, 'Claude token is invalid or revoked');
  }

  if (status === 429) {
    return createHttpError(429, 'Rate limit reached');
  }

  if (status === 400) {
    return createHttpError(400, 'Invalid request body sent to Claude');
  }

  return createHttpError(502, 'Claude request failed');
}

async function generateScriptWithClaude(input) {
  const client = getClaudeClient();

  let response;
  try {
    response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: buildPrompt(input),
        },
      ],
    });
  } catch (error) {
    throw mapClaudeError(error);
  }

  const script = extractText(response);
  if (!script) {
    throw createHttpError(502, 'Claude returned an empty script');
  }

  return script;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = validatePayload(body);
  if (validated?.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const script = await generateScriptWithClaude(validated);
    return NextResponse.json({ script });
  } catch (error) {
    const status = Number(error?.status || 500);
    const message = error?.message || 'Unexpected server error';
    return NextResponse.json({ error: message }, { status });
  }
}
