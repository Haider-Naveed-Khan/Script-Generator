# Script Generator

Single-project Next.js App Router app with integrated API route.

## Final Structure

app/
- page.js
- api/
  - generate/
    - route.js

components/
- ScriptForm.jsx
- ScriptOutput.jsx
- Loader.jsx

lib/
- claude.js

public/

## Claude Proxy Setup

The API route uses:
- baseURL: https://claude-candidate-proxy.vagueae.workers.dev
- model: claude-haiku-4-5-20251001
- apiKey: dummy
- header: x-candidate-token from CLAUDE_TOKEN

## Local Setup

1. Install dependencies
- npm install

2. Set environment variable
- Copy .env.example to .env.local
- Set CLAUDE_TOKEN in .env.local

3. Run
- npm run dev

App runs on http://localhost:3000

## API Contract

POST /api/generate

Request:
{
  "idea": "The rise and fall of Cleopatra",
  "tone": "Dramatic",
  "length": "3 min"
}

Response:
{
  "script": "..."
}

## Prompt Rules

The route enforces tone + duration guidance:
- 1 min: 120-150 words
- 3 min: 350-450 words
- 5 min: 700-900 words
- 10 min: 1300-1600 words

Output sections:
- Hook
- Main Content
- Ending

## Deployment (Vercel)

Deploy as one Next.js project.

Required env variable:
- CLAUDE_TOKEN
