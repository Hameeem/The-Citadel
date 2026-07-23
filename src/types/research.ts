// Schema for AI-researched characters — i.e. anyone NOT in the curated
// src/data/characters.ts archive. Deliberately a different shape than
// Character (see src/types/character.ts): the curated archive uses 0-100
// scaled stats with reasoning because every entry was hand-verified against
// specific feats. Live-researched profiles can't make that promise on every
// field, so stats here are short factual text ("Superhuman", "Unknown",
// "Disputed — sources disagree") rather than a fabricated number.

export interface ResearchProfile {
  name: string
  aliases: string[]
  universe: string
  series: string
  race: string
  occupation: string
  alignment: string
  description: string

  powers: string[]
  abilities: string[]
  weapons: string[]
  equipment: string[]
  transformations: string[]
  skills: string[]

  strength: string
  speed: string
  durability: string
  stamina: string
  intelligence: string
  battleIQ: string

  weaknesses: string[]
  majorFeats: string[]
  knownBattles: string[]
  allies: string[]
  enemies: string[]
  quotes: string[]

  sources: string[]
  disputedNotes?: string[] // fields where sources disagree, called out explicitly
}

export type ResearchResult =
  | { status: 'found'; profile: ResearchProfile }
  | { status: 'ambiguous'; options: string[] }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
