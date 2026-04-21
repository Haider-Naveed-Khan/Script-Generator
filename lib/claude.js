import Anthropic from '@anthropic-ai/sdk';

export const CLAUDE_BASE_URL = 'https://claude-candidate-proxy.vagueae.workers.dev';
export const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

let cachedClient;

export function getClaudeClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const token = process.env.CLAUDE_TOKEN?.trim();
  if (!token) {
    const error = new Error('Missing CLAUDE_TOKEN on the server');
    error.status = 500;
    throw error;
  }

  cachedClient = new Anthropic({
    apiKey: 'dummy',
    baseURL: CLAUDE_BASE_URL,
    defaultHeaders: {
      'x-candidate-token': token,
    },
  });

  return cachedClient;
}
