// OPTIONAL upgrade — not wired into the UI by default.
//
// The Arena works out of the box using the deterministic engine in
// src/lib/analyzeMatchup.ts, which needs no API key. This file is a
// template for a Vercel serverless function that would let an LLM write
// richer prose on top of that SAME evidence (it still receives the real
// stats/abilities/archive data — it should not invent new numbers).
//
// To use this:
//   1. `npm install` already includes nothing extra needed — this uses fetch.
//   2. Set ANTHROPIC_API_KEY in your Vercel project's environment variables.
//   3. Deploy. Vercel auto-detects files under /api as serverless functions.
//   4. Update src/pages/Arena.tsx to call POST /api/analyze with
//      { characterA, characterB } and use the response instead of (or
//      alongside) analyzeMatchup().
//
// This file is untested against a live deploy in this environment — review
// it before relying on it, especially error handling and rate limiting.

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), { status: 500 })
  }

  const { characterA, characterB } = await req.json()

  const systemPrompt = `You are the Citadel's battle analyst. You will be given two
characters' full evidence — stats with reasoning, abilities, and archive feats.
Write a battle outlook using ONLY that evidence. Do not invent feats or stats
not present in the input. Respond with strict JSON matching this shape:
{
  "aWinProbability": number, "bWinProbability": number,
  "confidence": "Low" | "Moderate" | "High",
  "reasons": string[], "keyFactors": string[],
  "alternativeScenario": string,
  "narrative": [{ "title": string, "text": string }]
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: JSON.stringify({ characterA, characterB }) },
      ],
    }),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Upstream API error' }), { status: 502 })
  }

  const data = await response.json()
  const text = data.content?.map((b: any) => b.text || '').join('') ?? ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return new Response(JSON.stringify(parsed), { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ error: 'Could not parse model output', raw: text }), { status: 502 })
  }
}
