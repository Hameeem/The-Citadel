// Live character research via the Gemini API — the "AI as research engine,
// not a static encyclopedia" feature. Requires GEMINI_API_KEY to be set in
// your deployment's environment variables (see .env.example / DEPLOYMENT.md).
//
// This is a Vercel Edge Function: any file under /api gets deployed as one
// automatically, no extra config needed. It does NOT run under plain
// `npm run dev` — you need a real deploy (or `vercel dev`) to exercise it.

export const config = { runtime: 'edge' }

// Configurable because Gemini model names change / deprecate frequently —
// check https://ai.google.dev/gemini-api/docs/models for current options
// if this default ever starts 404ing.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const SYSTEM_PROMPT = `You are a professional fictional-universe researcher for
"The Citadel," a multiverse character archive. When given a character name,
you research them the way a careful reference editor would:

- Prioritize official sources: original comics/anime/games/movies, official
  publisher or developer bios, official wikis maintained by the rights holder.
- Use secondary community wikis (Fandom, etc.) only to fill gaps, never as the
  sole source for a specific claim.
- Extract only factual, canonical information. Ignore fan theories, fan-made
  power scaling, and speculation.
- NEVER invent a power, stat, feat, or battle that you don't have real basis
  for. If something is unknown, say "Unknown" — do not guess.
- If sources meaningfully disagree on something (e.g. two different stated
  power levels, disputed canon status), say so explicitly rather than picking
  one silently.
- Quotes must be short (under 15 words) and you may paraphrase themes instead
  of quoting directly — never reproduce large chunks of copyrighted dialogue
  or text.
- strength/speed/durability/stamina/intelligence/battleIQ are short
  qualitative descriptions (e.g. "Superhuman", "Peak human", "Unknown"), NOT
  fabricated numeric scores — you have no reliable basis for a 0-100 number
  on a character you're researching live.

First decide which of three cases applies:
1. The name is genuinely ambiguous between two or more distinct, real
   fictional characters (e.g. "Robin" could mean several different
   characters) — return the ambiguous case with a short list of the specific
   named options.
2. The name does not correspond to any real, identifiable fictional character
   you have reliable information on — return the not_found case. Do not
   invent a character to fill the gap.
3. Otherwise, research the character and return the found case with a full
   profile.

Respond with ONLY a single JSON object, no markdown fences, no commentary,
matching exactly one of these three shapes:

{"status":"ambiguous","options":["Robin (DC Comics)","Robin Hood (English folklore)","Nico Robin (One Piece)"]}

{"status":"not_found"}

{"status":"found","profile":{
  "name":"", "aliases":[], "universe":"", "series":"", "race":"", "occupation":"", "alignment":"", "description":"",
  "powers":[], "abilities":[], "weapons":[], "equipment":[], "transformations":[], "skills":[],
  "strength":"", "speed":"", "durability":"", "stamina":"", "intelligence":"", "battleIQ":"",
  "weaknesses":[], "majorFeats":[], "knownBattles":[], "allies":[], "enemies":[], "quotes":[],
  "sources":[], "disputedNotes":[]
}}`

function emptyProfile(name: string) {
  return {
    name,
    aliases: [],
    universe: 'Unknown',
    series: 'Unknown',
    race: 'Unknown',
    occupation: 'Unknown',
    alignment: 'Unknown',
    description: '',
    powers: [],
    abilities: [],
    weapons: [],
    equipment: [],
    transformations: [],
    skills: [],
    strength: 'Unknown',
    speed: 'Unknown',
    durability: 'Unknown',
    stamina: 'Unknown',
    intelligence: 'Unknown',
    battleIQ: 'Unknown',
    weaknesses: [],
    majorFeats: [],
    knownBattles: [],
    allies: [],
    enemies: [],
    quotes: [],
    sources: [],
    disputedNotes: [],
  }
}

// Fill any field Gemini's output omits, so the frontend never has to
// null-check twenty fields. This is defensive normalization, not a source
// of new facts — every filled default is either an empty value or "Unknown".
function normalize(raw: any, fallbackName: string) {
  const base = emptyProfile(fallbackName)
  return { ...base, ...raw }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'error', message: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ status: 'error', message: 'GEMINI_API_KEY not configured' }), { status: 500 })
  }

  let query: string
  try {
    const body = await req.json()
    query = String(body.query || '').trim()
  } catch {
    return new Response(JSON.stringify({ status: 'error', message: 'Invalid request body' }), { status: 400 })
  }

  if (!query) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing query' }), { status: 400 })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`

  let upstream: Response
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Research this character: ${query}` }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    })
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: 'Could not reach Gemini API' }), { status: 502 })
  }

  if (!upstream.ok) {
    const text = await upstream.text()
    return new Response(JSON.stringify({ status: 'error', message: `Gemini API error: ${upstream.status}`, detail: text }), {
      status: 502,
    })
  }

  const data = await upstream.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ?? ''

  let parsed: any
  try {
    parsed = JSON.parse(text)
  } catch {
    return new Response(JSON.stringify({ status: 'error', message: 'Could not parse Gemini output', raw: text }), { status: 502 })
  }

  if (parsed.status === 'ambiguous' && Array.isArray(parsed.options)) {
    return new Response(JSON.stringify({ status: 'ambiguous', options: parsed.options }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (parsed.status === 'not_found') {
    return new Response(JSON.stringify({ status: 'not_found' }), { headers: { 'Content-Type': 'application/json' } })
  }

  if (parsed.status === 'found' && parsed.profile) {
    return new Response(JSON.stringify({ status: 'found', profile: normalize(parsed.profile, query) }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ status: 'error', message: 'Unexpected response shape from model' }), { status: 502 })
}
