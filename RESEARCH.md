# Live Character Research (Gemini)

This is the "AI as a research engine, not a static database" feature — search
any character not in the curated archive, and it gets researched live instead
of returning nothing.

## Setup

1. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Add `GEMINI_API_KEY` to your deployment's environment variables (Vercel:
   Project Settings → Environment Variables). Don't commit a real key to the
   repo — `.env.example` is a template, not where the real value goes.
3. Deploy. `api/research.ts` auto-deploys as a Vercel Edge Function — nothing
   else to configure.
4. This does **not** work under plain `npm run dev`, because that only runs
   the Vite frontend, not the serverless function. Use `vercel dev` locally,
   or just test against a real deployment.

## How it works

```
User searches "Sung Jinwoo" on the Database page
  → not found in the curated archive (src/data/characters.ts)
  → "Research with AI" button → /research?q=Sung Jinwoo
  → src/lib/researchCache.ts checks the in-session cache first
  → cache miss → POST /api/research
  → api/research.ts calls the Gemini API with a system prompt that:
      - asks for official sources first, community wikis only to fill gaps
      - forbids inventing powers, stats, or feats
      - requires flagging disagreements between sources instead of picking one
      - handles ambiguous names (e.g. "Robin") by asking which one
      - handles characters it has no reliable info on with "not_found",
        instead of making something up
  → response normalized to a consistent shape, cached client-side, rendered
```

## Why the schema is different from the curated archive

`src/types/character.ts` (the curated archive) uses 0-100 scored stats,
because every character in `characters.ts` was hand-populated with real
reasoning behind each number. A live research pass can't make that same
promise — so `src/types/research.ts` uses short qualitative text instead
("Superhuman", "Peak human", "Unknown") rather than a fabricated score. Faking
precision here would be worse than not having it.

## Known limitations (be upfront about these)

- **Not hallucination-proof.** The prompt asks the model to stick to real
  sources, flag disagreements, and say "Unknown" rather than guess — but
  that's a strong mitigation, not a guarantee. Treat researched profiles as a
  draft to sanity-check, not verified canon, and the UI says as much.
- **Ambiguity detection depends on the model's judgment**, not a fixed list —
  it can occasionally under- or over-flag ambiguity.
- **Caching is session-only and client-side** (a JS `Map`, see
  `researchCache.ts`). It resets on page reload and isn't shared across users.
  If you want persistent, cross-user caching (so "Batman" is only ever
  researched once, globally), that needs a real key-value store (Vercel KV,
  Upstash Redis, etc.) — not implemented here to keep setup to "just add an
  API key."
- **Cost and latency**: every uncached search is a real Gemini API call,
  roughly 5-15 seconds. Fine for occasional use; would need rate-limiting
  before opening this up to a lot of traffic.
- **Model name drift**: Gemini model IDs get deprecated on a few-month cycle.
  `GEMINI_MODEL` is an env var specifically so you can bump it without a code
  change — check the current list before you deploy if it's been a while.

## Extending it

The disambiguation flow (`/research?q=Robin` → pick one → re-searches with the
specific name) is the pattern to follow if you add more entry points — e.g. a
"Research" button directly in the Arena's fighter picker for characters
outside the curated 7.
