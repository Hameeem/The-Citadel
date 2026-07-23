// The Citadel — core data schema.
// Designed to map 1:1 onto a future Supabase/PostgreSQL "characters" table
// plus related tables (stats, abilities, archive_entries, battle_history).

export type Universe = 'Anime' | 'Marvel' | 'DC' | 'Games' | 'Cartoons' | 'Movies' | 'Mythology' | 'Comics'

export type Alignment = 'Hero' | 'Villain' | 'Anti-Hero' | 'Neutral'

/** A single stat, always paired with the evidence behind the number. */
export interface Stat {
  key: string
  label: string
  value: number // 0-100, relative power-tier scale, NOT a literal physical unit
  reasoning: string // why this number — cites the feat(s) behind it
}

export interface Ability {
  id: string
  name: string
  description: string
  strengths: string[]
  weaknesses: string[]
  evidence: string // canon reference the ability is drawn from, paraphrased
}

export interface GrowthStage {
  id: string
  label: string
  note: string
}

export interface ArchiveEntry {
  id: string
  category: 'Feat' | 'Relationship' | 'Artifact' | 'Statement' | 'Timeline'
  title: string
  description: string
  source: string // paraphrased reference, e.g. "One Piece, Wano Arc" — never verbatim text
}

export interface BattleRecord {
  id: string
  opponent: string
  outcome: 'Win' | 'Loss' | 'Draw'
  difficulty: 'Trivial' | 'Even' | 'Hard-fought' | 'Near-loss'
  source: string
}

export interface Character {
  id: string
  name: string
  aliases: string[]
  universe: Universe
  series: string
  alignment: Alignment
  species: string
  occupation: string
  status: 'Active' | 'Deceased' | 'Unknown'
  debut: string
  affiliations: string[]
  emblemColor: string // hex — used to render the abstract SVG emblem, no likeness art
  emblemGlyph: 'flame' | 'bolt' | 'shield' | 'star' | 'snowflake' | 'atom' | 'moon'
  tagline: string
  bio: string
  popularity: number // 0-100 relative index
  stats: Stat[]
  abilities: Ability[]
  growth: GrowthStage[]
  archive: ArchiveEntry[]
  battleHistory: BattleRecord[]
}
