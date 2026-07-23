# The Arena

## How it works right now (no setup required)

The Arena is fully functional out of the box. Pick two characters and it runs
`src/lib/battleAnalysis.ts` — a deterministic engine that:

- Compares every shared stat between the two characters, weighted by category
  (Attack Potency and Combat Skill count more than Intelligence, for example —
  see `STAT_WEIGHTS` in that file if you want to retune it)
- Computes a win probability from the weighted gap, not a coin flip
- Builds its "reasons" list directly from the `reasoning` strings already
  stored on each character's stats — it literally cannot invent a justification
  that isn't already in the data
- Generates a 5-beat fight narrative (Opening → Escalation → Turning Point →
  Final Clash → Ending) using template sentences filled in with each
  character's real abilities and the actual deciding stat

This satisfies the brief's core rule — reasoning before verdict, every number
traceable to evidence — without needing an API key, a backend, or a deploy.

## The optional upgrade: LLM-written analysis

`api/analyze.ts` is a template for a Vercel serverless function that sends the
same evidence (stats, abilities, archive) to the Anthropic API and asks it to
write the verdict in richer prose, still constrained to the input data. It is
**not wired into the UI** — `Arena.tsx` calls `analyzeBattle()` directly.

To wire it up:

1. Set `ANTHROPIC_API_KEY` in your deployment's environment variables (see
   `.env.example` and `DEPLOYMENT.md`)
2. In `Arena.tsx`, replace the direct `analyzeBattle(a, b)` call with a
   `fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ characterA: a, characterB: b }) })`,
   falling back to `analyzeBattle(a, b)` if the request fails — that fallback
   is what keeps the feature working if the API key is missing, rate-limited,
   or the function cold-starts slowly
3. Test it after deploying — serverless functions don't run under plain
   `npm run dev`; you'd need `vercel dev` locally or a real deployment to
   exercise this path

## Why it's built this way

A pure "call an LLM and trust whatever it says" implementation would violate
the brief's own rule that the AI must never invent numbers. Grounding the
prose (LLM or template) in data that's already sitting in the character record
is what makes the "AI must explain itself" requirement actually true, instead
of just a UI label on top of a black box.
