# Data Schema & Batch Authoring Guide

## Why this matters

The project brief's core rule is: **the AI must never invent a stat — every number
needs evidence.** That means scaling from 7 characters to hundreds is a *research*
task, not a UI task. This doc is the template for doing that scaling properly,
in batches, without breaking that rule.

## The schema

See `src/types/character.ts` for the authoritative TypeScript types. Summary:

| Field | Notes |
|---|---|
| `stats` | 0–100 relative scale, **not** a literal physical unit. Each stat needs a `reasoning` string citing the feat behind the number. |
| `abilities` | Each needs strengths, weaknesses, and a paraphrased `evidence` source — never a verbatim quote from a wiki or script. |
| `archive` | Canon feats, relationships, artifacts, timeline entries, statements — this is the "why should I trust this stat" layer. |
| `battleHistory` | Opponent, outcome, difficulty, and a source reference. |

## Recommended batch size

Ask for **20–30 characters at a time**, grouped by universe or tier (e.g. "Top 30
Marvel villains" or "Top 20 Shōnen protagonists"). This keeps quality high — each
character in a batch should still get real stats grounded in actual feats, not
guessed numbers to hit a count.

## Minimal template for one character

```ts
{
  id: 'kebab-case-id',
  name: 'Character Name',
  aliases: ['Alt name'],
  universe: 'Anime', // 'Anime' | 'Marvel' | 'DC' | 'Disney'
  series: 'Source Series',
  alignment: 'Hero', // 'Hero' | 'Villain' | 'Anti-Hero' | 'Neutral'
  species: '...',
  occupation: '...',
  status: 'Active', // 'Active' | 'Deceased' | 'Unknown'
  debut: 'YYYY',
  affiliations: ['...'],
  emblemColor: '#RRGGBB',
  emblemGlyph: 'flame', // flame | bolt | shield | star | snowflake | atom | moon
  tagline: 'One line, in-universe voice.',
  bio: '2-3 sentence paraphrased summary — never copied from a wiki.',
  popularity: 0, // 0-100
  stats: [ { key: 'strength', label: 'Strength', value: 0, reasoning: 'Cite the feat.' }, /* ... */ ],
  abilities: [ { id: '...', name: '...', description: '...', strengths: [], weaknesses: [], evidence: '...' } ],
  growth: [ { id: '...', label: '...', note: '...' } ],
  archive: [ { id: '...', category: 'Feat', title: '...', description: '...', source: '...' } ],
  battleHistory: [ { id: '...', opponent: '...', outcome: 'Win', difficulty: 'Hard-fought', source: '...' } ],
}
```

## Artwork

The app currently renders an abstract generated emblem (`emblemColor` + `emblemGlyph`)
instead of character artwork, specifically to avoid reproducing copyrighted character
likenesses. If you have licensed or properly-rights-cleared art, add an `image` field
to the type and wire it into `Emblem.tsx` — don't add unlicensed fan art or scraped
images, as that's a real legal exposure for a public-facing site.

## Migrating to a real database later

The schema is flat and JSON-serializable on purpose. When you outgrow hand-editing
`characters.ts`:

- `characters` → one row per character, most fields map directly to columns
- `stats`, `abilities`, `archive`, `battleHistory` → each becomes its own table with
  a `character_id` foreign key
- Supabase (Postgres + auto-generated REST/GraphQL API) is a low-friction fit since
  the schema is already relational
