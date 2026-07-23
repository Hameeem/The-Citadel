# The Citadel — Where Every Universe Meets

A multiverse character archive and battle-analysis UI: Anime, Marvel, DC, and Disney
characters in one system, with evidence-backed stats, a "Power Signature" visual
per character, an Archive of canon feats, and battle history.

**This is a working foundation, not a finished 500-character platform.** It ships with
7 fully-populated sample characters across 4 universes to prove out the design system
and data schema end to end. See [`DATA_SCHEMA.md`](./DATA_SCHEMA.md) for how to add more.

## What's actually built

- Animated landing page (hero, universe districts, trending characters)
- Character archive with search + universe filtering
- Full character profile page: identity fields, animated "Power Signature" radar
  chart, stat bars with reasoning, ability cards (strengths/weaknesses/evidence),
  power growth timeline, Archive (feats/relationships/artifacts), battle history
- Global rankings page (by popularity, strength, intelligence, speed)
- **The Arena**: pick two characters, get a weighted stat comparison, win
  probability, confidence/difficulty rating, reasoning list, alternative
  scenario, and a 5-beat fight narrative — all generated deterministically
  from each character's stored stats/reasoning, no API key required. See
  [`ARENA.md`](./ARENA.md) for how it works and how to optionally upgrade it
  to LLM-written prose via the Anthropic API.
- **Live AI research**: search a character not in the curated archive and get
  a "Research with AI" option — a Gemini-powered pipeline researches them live
  (official sources first, no invented stats, handles ambiguous names and
  "not found" honestly) instead of returning nothing. See
  [`RESEARCH.md`](./RESEARCH.md) for setup and how it works.
- Dark glassmorphism design system (purple/blue/crimson) built for this brief

## What's intentionally NOT built (be aware before you promise this to anyone)

- **No real character artwork.** Every character uses a generated abstract emblem
  (color + glyph) instead of licensed art, to avoid reproducing copyrighted
  character likenesses. Swap in real art via the `image` field in the character
  type once you have the rights to use it.
- **No backend / database.** Character data lives in a single TypeScript file
  (`src/data/characters.ts`). The schema is written to map cleanly onto a Supabase/
  PostgreSQL table if you outgrow that — see `DATA_SCHEMA.md`.
- **The Arena's analysis is template-based, not LLM-generated**, by default —
  see `ARENA.md` for exactly what that means and how to upgrade it.
- **Live AI research (`/research`) needs a Gemini API key to actually work.**
  Without `GEMINI_API_KEY` set on your deployment, that button will show an
  error state, not silently fail. See `RESEARCH.md`.
- **No user accounts, comments, voting, or real-time community features.**
  The "Community Discussions" panel on the Database page is a static
  placeholder, clearly labeled as such in the UI.
- **No CI/CD or live deployment.** A GitHub Actions workflow template is included,
  but you need to create the GitHub repo and Vercel project yourself — see
  `DEPLOYMENT.md`.
- **Only 7 characters.** Scaling to hundreds is a data-authoring task — see
  `DATA_SCHEMA.md` for the batch template.

## Local setup

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview   # serves the built dist/ folder locally
```

## Project structure

```
src/
  components/       Emblem, PowerSignature (signature radar chart), CharacterCard, Navbar
  pages/            Home, Characters, CharacterProfile, Rankings, Arena
  lib/
    battleAnalysis.ts   The Arena's deterministic analysis engine (see ARENA.md)
  data/
    characters.ts   The 7 sample characters — this is your database for now
  types/
    character.ts    The full data schema (Character, Stat, Ability, ArchiveEntry, BattleRecord)
api/
  analyze.ts        Optional serverless upgrade — LLM-written analysis (see ARENA.md)
```

## Adding a character

Add a new object to the `characters` array in `src/data/characters.ts` matching the
`Character` type in `src/types/character.ts`. See `DATA_SCHEMA.md` for a filled-in
template and guidance on writing evidence-backed stats.

## Design system

- **Palette:** void black (`#05040A`), glass panel purple-black, purple `#8B5CF6`,
  blue `#3B82F6`, crimson `#E11D48`
- **Type:** Orbitron (display/wordmark), Rajdhani (headings/labels), Inter (body),
  JetBrains Mono (stat numbers, data)
- **Signature element:** the "Power Signature" — every character's stat block
  resolves into one glowing polygon shape, used full-size on profile pages and as
  a compact thumbnail on cards and rankings

## Next steps if you continue this project

1. Push this to a GitHub repo (see `DEPLOYMENT.md`)
2. Populate more characters in batches using `DATA_SCHEMA.md`
3. Optionally upgrade the Arena to LLM-written prose (see `ARENA.md`)
4. Migrate `characters.ts` to a real database once the dataset grows past what's
   comfortable to hand-edit in one file
