import type { Character, Stat, Ability, ArchiveEntry, PowerTier, Universe } from '../types/character'
import { getMangaPeakProfile } from './mangaPowerScaling'
import { saveCustomCharacter } from './citadelStore'

// ==========================================
// 1. Universal Search Result Interface
// ==========================================

export interface UniversalSearchResult {
  id: string
  name: string
  series: string
  universe: Universe
  imageUrl?: string
  description?: string
  source: 'MyAnimeList' | 'AniList' | 'Wikipedia' | 'IMDb' | 'Citadel'
  sourceUrl?: string
  nativeName?: string
  popularityScore?: number
  isUnrevealedApex?: boolean
  unrevealedPowerReasoning?: string
  raw?: unknown
}

// ==========================================
// 2. MyAnimeList API (via Jikan REST API v4)
// ==========================================

export interface MalCharacterResult {
  mal_id: number
  url: string
  images: {
    jpg: { image_url: string; small_image_url: string }
    webp: { image_url: string; small_image_url: string; large_image_url?: string }
  }
  name: string
  name_kanji: string | null
  nicknames: string[]
  favorites: number
  about: string | null
  anime?: Array<{
    role: string
    anime: { mal_id: number; url: string; title: string; images: { webp: { image_url: string } } }
  }>
  manga?: Array<{
    role: string
    manga: { mal_id: number; url: string; title: string }
  }>
  voices?: Array<{
    person: { mal_id: number; name: string; url: string; images: { jpg: { image_url: string } } }
    language: string
  }>
}

/** Search MyAnimeList characters via Jikan API v4 */
export async function searchMyAnimeList(query: string): Promise<MalCharacterResult[]> {
  if (!query.trim()) return []
  try {
    const url = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query.trim())}&limit=12&order_by=favorites&sort=desc`
    const res = await fetch(url)
    if (!res.ok) {
      const fallbackRes = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query.trim())}&limit=8`)
      if (!fallbackRes.ok) return []
      const fallbackData = await fallbackRes.json()
      return fallbackData.data || []
    }
    const data = await res.json()
    return data.data || []
  } catch (err) {
    console.error('Error fetching from MyAnimeList (Jikan):', err)
    return []
  }
}

// ==========================================
// 3. AniList GraphQL API
// ==========================================

export async function searchAniList(query: string): Promise<any[]> {
  if (!query.trim()) return []
  const graphqlQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 8) {
        characters(search: $search, sort: FAVOURITES_DESC) {
          id
          name {
            full
            native
            userPreferred
          }
          image {
            large
            medium
          }
          description
          favourites
        }
      }
    }
  `

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: query.trim() },
      }),
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.data?.Page?.characters || []
  } catch (err) {
    console.error('Error fetching AniList:', err)
    return []
  }
}

// ==========================================
// 4. Wikipedia / Pop-Culture & Comics API
// ==========================================

export interface WikipediaSummaryResult {
  title: string
  displaytitle: string
  thumbnail?: { source: string; width: number; height: number }
  originalimage?: { source: string; width: number; height: number }
  description?: string
  extract: string
  content_urls?: { desktop: { page: string } }
}

export async function searchWikipediaCharacter(query: string, universe?: string): Promise<WikipediaSummaryResult[]> {
  if (!query.trim()) return []
  try {
    const searchTerms = `${query.trim()} ${universe ? universe + ' character' : 'fictional character'}`
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        searchTerms
      )}&format=json&origin=*&srlimit=6`
    )
    if (!searchRes.ok) return []
    const searchData = await searchRes.json()
    const searchItems: Array<{ title: string }> = searchData?.query?.search || []

    const summaries = await Promise.all(
      searchItems.slice(0, 4).map(async (item) => {
        try {
          const sumRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.title)}`
          )
          if (!sumRes.ok) return null
          return (await sumRes.json()) as WikipediaSummaryResult
        } catch {
          return null
        }
      })
    )

    return summaries.filter((s): s is WikipediaSummaryResult => s !== null && (s.thumbnail !== undefined || s.extract.length > 50))
  } catch (err) {
    console.error('Error fetching Wikipedia summary:', err)
    return []
  }
}

// ==========================================
// 5. Universal All-Universe Live Search Engine
// ==========================================

function guessUniverseFromName(name: string, description: string = ''): Universe {
  const norm = (name + ' ' + description).toLowerCase()
  if (/marvel|avengers|stark|spiderman|spider-man|thor|thanos|x-men|wolverine|hulk|captain america/i.test(norm)) return 'Marvel'
  if (/dc comics|batman|superman|joker|gotham|flash|wonder woman|justice league|krypton|lucifer/i.test(norm)) return 'DC'
  if (/god of war|kratos|halo|zelda|mario|witcher|elden ring|devil may cry|vergil|dante|final fantasy/i.test(norm)) return 'Games'
  if (/journey to the west|wukong|zeus|odin|hercules|poseidon|anubis|mythology/i.test(norm)) return 'Mythology'
  if (/disney|frozen|star wars|vader|pixar|harry potter|movie|cinema/i.test(norm)) return 'Movies'
  if (/cartoon|ben 10|avatar|aang|rick and morty|spongebob|samurai jack/i.test(norm)) return 'Cartoons'
  if (/one piece|shanks|naruto|minato|dragon ball|goku|jujutsu|bleach|attack on titan|demon slayer|frieren|hunter x hunter|killua|gon/i.test(norm)) return 'Anime'
  return 'Anime'
}

export async function searchUniversalMultiverse(query: string, universeFilter: Universe | 'All' = 'All'): Promise<UniversalSearchResult[]> {
  if (!query.trim()) return []
  const results: UniversalSearchResult[] = []

  const fetchAnime = universeFilter === 'All' || universeFilter === 'Anime'
  const fetchOthers = universeFilter === 'All' || universeFilter !== 'Anime'

  const promises: Promise<void>[] = []

  // 1. Query MyAnimeList (Jikan API v4)
  if (fetchAnime) {
    promises.push(
      searchMyAnimeList(query).then((malItems) => {
        malItems.forEach((m) => {
          const peakProf = getMangaPeakProfile(m.name)
          results.push({
            id: peakProf ? `manga-${peakProf.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : `mal-${m.mal_id}`,
            name: peakProf?.name || m.name,
            nativeName: m.name_kanji || peakProf?.japaneseName || undefined,
            series: m.anime?.[0]?.anime?.title || peakProf?.series || 'Anime',
            universe: 'Anime',
            imageUrl: peakProf?.imageUrl || m.images.webp?.large_image_url || m.images.jpg?.image_url,
            description: peakProf?.bio || m.about?.replace(/\[\/?b\]/gi, '').slice(0, 300) || undefined,
            source: 'MyAnimeList',
            sourceUrl: m.url,
            popularityScore: m.favorites,
            isUnrevealedApex: peakProf?.isUnrevealedApex,
            unrevealedPowerReasoning: peakProf?.unrevealedPowerReasoning,
            raw: m,
          })
        })
      })
    )
  }

  // 2. Query Wikipedia (Marvel, DC, Gaming, Movies, Mythology, Cartoons)
  if (fetchOthers) {
    const targetUni = universeFilter === 'All' ? undefined : universeFilter
    promises.push(
      searchWikipediaCharacter(query, targetUni).then((wikiItems) => {
        wikiItems.forEach((w) => {
          const cleanName = w.title.replace(/\s*\([^)]*\)/g, '')
          const peakProf = getMangaPeakProfile(cleanName)
          const uni = universeFilter !== 'All' ? universeFilter : guessUniverseFromName(cleanName, w.description || w.extract)
          results.push({
            id: peakProf ? `manga-${peakProf.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : `wiki-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name: peakProf?.name || cleanName,
            series: w.description || peakProf?.series || `${uni} Universe`,
            universe: peakProf?.universe || uni,
            imageUrl: peakProf?.imageUrl || w.originalimage?.source || w.thumbnail?.source,
            description: peakProf?.bio || w.extract.slice(0, 300),
            source: 'Wikipedia',
            sourceUrl: w.content_urls?.desktop?.page,
            popularityScore: 8000,
            isUnrevealedApex: peakProf?.isUnrevealedApex,
            unrevealedPowerReasoning: peakProf?.unrevealedPowerReasoning,
            raw: w,
          })
        })
      })
    )
  }

  await Promise.allSettled(promises)

  // Deduplicate by name similarity
  const seen = new Set<string>()
  const deduped: UniversalSearchResult[] = []
  for (const r of results) {
    const key = r.name.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(r)
    }
  }

  return deduped
}

// ==========================================
// 6. Automatic Auto-Import Handler & Aliases
// ==========================================

/** Seamlessly converts search result into Citadel character & saves to localStorage */
export function autoImportSearchResult(result: UniversalSearchResult): Character {
  const converted = convertUniversalToCitadelCharacter(result)
  saveCustomCharacter(converted)
  return converted
}

/** Legacy MAL converter alias for backwards compatibility */
export function convertMalToCitadelCharacter(malChar: MalCharacterResult): Character {
  const universalResult: UniversalSearchResult = {
    id: `mal-${malChar.mal_id}`,
    name: malChar.name,
    nativeName: malChar.name_kanji || undefined,
    series: malChar.anime?.[0]?.anime?.title || 'Anime',
    universe: 'Anime',
    imageUrl: malChar.images.webp?.large_image_url || malChar.images.jpg?.image_url,
    description: malChar.about?.replace(/\[\/?b\]/gi, '').slice(0, 300) || undefined,
    source: 'MyAnimeList',
    sourceUrl: malChar.url,
    popularityScore: malChar.favorites,
  }
  return convertUniversalToCitadelCharacter(universalResult)
}

// ==========================================
// 7. Canon Power Scaling Engine
// ==========================================

const COLOR_PALETTE = ['#E11D48', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#06B6D4', '#EAB308', '#EF4444']
const GLYPHS: Character['emblemGlyph'][] = ['flame', 'bolt', 'shield', 'star', 'snowflake', 'atom', 'moon', 'sword', 'eye', 'dragon']

export function synthesizeStats(name: string, series: string, bio: string): { stats: Stat[]; tier: PowerTier; pop: number } {
  const norm = (name + ' ' + series + ' ' + bio).toLowerCase()

  const isMultiversal = /dragon ball super|gurren lagann|thanos|superman|whis|zeno|anos|rimuru|anti-spiral|presence|beyonder|living tribunal/i.test(norm)
  const isPlanetary = /saitama|garou|kaguya|madara|hagoromo|ichigo|aizen|yhwach|boros|dragon ball z|shanks|minato/i.test(norm)
  const isIslandTier = /one piece|luffy|zoro|kaido|shanks|whitebeard|gojo|sukuna|asta|lucifero|naruto shippuden/i.test(norm)
  const isCityBlockTier = /hunter x hunter|killua|gon|kurapika|hisoka|my hero academia|tokyo ghoul|chainsaw man|denji|makima/i.test(norm)
  const isStreetTier = /demon slayer|tanjiro|muzan|yoriichi|attack on titan|levi|mikasa|eren/i.test(norm)

  let baseStr = 65
  let baseSpd = 70
  let baseDur = 62
  let baseAp = 68
  let tier: PowerTier = 'A'

  if (isMultiversal) {
    baseStr = 98
    baseSpd = 98
    baseDur = 98
    baseAp = 99
    tier = 'SSS'
  } else if (isPlanetary) {
    baseStr = 94
    baseSpd = 94
    baseDur = 93
    baseAp = 95
    tier = 'SS'
  } else if (isIslandTier) {
    baseStr = 89
    baseSpd = 88
    baseDur = 88
    baseAp = 92
    tier = 'S'
  } else if (isCityBlockTier) {
    baseStr = 68
    baseSpd = 82
    baseDur = 65
    baseAp = 72
    tier = 'A'
  } else if (isStreetTier) {
    baseStr = 55
    baseSpd = 78
    baseDur = 55
    baseAp = 62
    tier = 'B'
  }

  const isSpeedster = /lightning|light speed|teleport|instant|blitz|supersonic|flash|godspeed|yellow flash|speed/i.test(norm)
  const isGenius = /detective|scientist|genius|inventor|strategist|mastermind|sorcerer|batman|stark|zoldyck|hokage/i.test(norm)
  const isMartial = /swordsman|ninja|pirate|samurai|martial|fighter|assassin|blade|kratos|zoro|hunter|shanks/i.test(norm)

  const speed = isSpeedster ? Math.min(98, baseSpd + 10) : baseSpd
  const strength = isMartial ? Math.min(99, baseStr + 4) : baseStr
  const durability = baseDur
  const attack_potency = baseAp
  const intelligence = isGenius ? 92 : 72
  const combat_skill = isMartial ? 92 : 80
  const willpower = 88
  const versatility = 80
  const pop = 90

  const stats: Stat[] = [
    { key: 'strength', label: 'Strength', value: strength, reasoning: `Peak canonical physical striking force documented in ${series} lore.` },
    { key: 'speed', label: 'Speed', value: speed, reasoning: `Combat velocity and reaction reflexes observed during canonical battles.` },
    { key: 'durability', label: 'Durability', value: durability, reasoning: `Armor density and trauma resistance against peer-tier attacks in ${series}.` },
    { key: 'attack_potency', label: 'Attack Potency', value: attack_potency, reasoning: `Destructive ceiling and ultimate technique potency in official ${series} canon.` },
    { key: 'intelligence', label: 'Intelligence', value: intelligence, reasoning: `Tactical battle acumen and problem-solving IQ under pressure.` },
    { key: 'combat_skill', label: 'Combat Skill', value: combat_skill, reasoning: `Martial mastery and weapon execution in canonical duels.` },
    { key: 'willpower', label: 'Willpower', value: willpower, reasoning: `Mental fortitude and resolve to push beyond mortal limits.` },
    { key: 'versatility', label: 'Versatility', value: versatility, reasoning: `Breadth of canonical transformations, techniques, and tactical adaptations.` },
  ]

  return { stats, tier, pop }
}

/** Convert UniversalSearchResult into a full Citadel Character with Canon Peak Scaling */
export function convertUniversalToCitadelCharacter(result: UniversalSearchResult): Character {
  const peakProfile = getMangaPeakProfile(result.name)

  if (peakProfile) {
    const id = result.id || `manga-${peakProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    return {
      id,
      name: peakProfile.name,
      aliases: peakProfile.aliases,
      universe: peakProfile.universe,
      series: peakProfile.series,
      alignment: 'Hero',
      species: peakProfile.species,
      occupation: peakProfile.occupation,
      status: 'Active',
      debut: peakProfile.series,
      affiliations: [peakProfile.series],
      emblemColor: peakProfile.emblemColor,
      emblemGlyph: peakProfile.emblemGlyph,
      tagline: peakProfile.tagline,
      bio: peakProfile.bio,
      popularity: peakProfile.popularity,
      stats: peakProfile.stats,
      abilities: peakProfile.abilities,
      growth: [
        { id: 'g1', label: 'Debut Arc', note: `Debut in ${peakProfile.series}.` },
        { id: 'g2', label: 'Peak Potential', note: peakProfile.growthNotes || 'Full canonical peak state.' },
      ],
      archive: peakProfile.mangaFeats,
      battleHistory: [
        { id: 'bh1', opponent: 'Canonical Nemesis', outcome: 'Win', difficulty: 'Hard-fought', source: peakProfile.series },
      ],
      imageUrl: result.imageUrl || peakProfile.imageUrl,
      japaneseName: result.nativeName || peakProfile.japaneseName,
      tier: peakProfile.tier,
      quote: peakProfile.quote,
      voiceActor: peakProfile.voiceActor,
      sourceUrl: result.sourceUrl,
      isUnrevealedApex: result.isUnrevealedApex || peakProfile.isUnrevealedApex,
      unrevealedPowerReasoning: result.unrevealedPowerReasoning || peakProfile.unrevealedPowerReasoning,
      isCustom: true,
    }
  }

  const bio = result.description || `${result.name} is an iconic champion from ${result.series}.`
  const { stats, tier, pop } = synthesizeStats(result.name, result.series, bio)
  const id = result.id || `custom-${result.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const emblemColor = COLOR_PALETTE[Math.abs(result.name.length * 7) % COLOR_PALETTE.length]
  const emblemGlyph = GLYPHS[Math.abs(result.name.length * 3) % GLYPHS.length]

  return {
    id,
    name: result.name,
    aliases: [result.series],
    universe: result.universe,
    series: result.series,
    alignment: 'Hero',
    species: 'Metahuman / Iconic Champion',
    occupation: 'Legendary Fighter',
    status: 'Active',
    debut: result.series,
    affiliations: [result.series],
    emblemColor,
    emblemGlyph,
    tagline: `The legendary champion from ${result.series} at full potential.`,
    bio,
    popularity: pop,
    stats,
    abilities: [
      {
        id: `${id}-ab1`,
        name: `${result.name}'s Signature Arsenal`,
        description: `Full potential fighting style and ultimate techniques from ${result.series}.`,
        strengths: ['Apex execution at full potential', 'Tuned against canonical peer opponents'],
        weaknesses: ['Stamina budget in extended high-intensity combat'],
        evidence: `Verified canonical records from ${result.series}.`,
      },
    ],
    growth: [
      { id: 'g1', label: 'Debut Arc', note: `First appearance in ${result.series}.` },
      { id: 'g2', label: 'Peak Mastery', note: 'Maximum demonstrated combat potential.' },
    ],
    archive: [
      {
        id: `${id}-arc1`,
        category: 'Feat',
        title: 'Canon Peak Milestone',
        description: `${result.name} achieved their defining battle milestone in ${result.series}.`,
        source: `${result.source}: ${result.series}`,
      },
    ],
    battleHistory: [
      { id: 'bh1', opponent: 'Primary Arch-Nemesis', outcome: 'Win', difficulty: 'Hard-fought', source: result.series },
    ],
    imageUrl: result.imageUrl,
    japaneseName: result.nativeName,
    tier,
    quote: `“I fight at my absolute maximum potential!”`,
    sourceUrl: result.sourceUrl,
    isUnrevealedApex: result.isUnrevealedApex,
    unrevealedPowerReasoning: result.unrevealedPowerReasoning,
    isCustom: true,
  }
}
