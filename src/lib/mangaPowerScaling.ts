import type { Character, Stat, Ability, ArchiveEntry, PowerTier, PrimarySourceInfo, AdaptationMediaInfo } from '../types/character'

export interface MangaPeakProfile {
  name: string
  aliases: string[]
  series: string
  universe: Character['universe']
  species: string
  occupation: string
  tier: PowerTier
  popularity: number
  emblemColor: string
  emblemGlyph: Character['emblemGlyph']
  tagline: string
  bio: string
  quote: string
  voiceActor?: string
  japaneseName?: string
  imageUrl?: string
  bannerUrl?: string
  primarySource?: PrimarySourceInfo
  adaptationMedia?: AdaptationMediaInfo
  stats: Stat[]
  abilities: Ability[]
  growthNotes?: string
  mangaFeats: ArchiveEntry[]
}

/**
 * Canon Manga & Comic Peak Power Scaling Profiles.
 * Carefully calibrated to the FULL PEAK POTENTIAL in canonical source lore.
 */
export const MANGA_PEAK_REGISTRY: Record<string, MangaPeakProfile> = {
  // MARVEL OMNIVERSE
  'the-one-above-all': {
    name: 'The One Above All',
    aliases: ['TOAA', 'The Supreme Creator', 'God of the Marvel Multiverse'],
    series: 'Marvel Omniverse / Marvel Comics',
    universe: 'Marvel',
    species: 'Supreme Cosmic Divinity (Transcendent)',
    occupation: 'Supreme Creator and Ruler of the Marvel Omniverse',
    tier: 'SSS',
    popularity: 99,
    emblemColor: '#F59E0B',
    emblemGlyph: 'star',
    tagline: 'I am the One Above All. I see through many eyes. I build with many hands.',
    bio: 'The supreme creator and architect of the entire Marvel Omniverse. Sole master of the Living Tribunal, Eternity, Infinity, and the Beyonders. Resides in the House of Ideas, possessing absolute, unchallengeable omnipotence, omniscience, and omnipresence across every continuity.',
    quote: '“I am the One Above All. I see through many eyes. I build with many hands. They are themselves, but they are also me.”',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
    primarySource: {
      type: 'Comic',
      title: 'Marvel Comics (Earth-616 & Beyond)',
      publisherOrCreator: 'Stan Lee, Jack Kirby & Mark Waid / Marvel Publishing',
      eraOrDebut: 'Doctor Strange #13 (1976) / Fantastic Four #511 (2004)',
      peakMangaOrComicFeat: 'Created the entire infinite Marvel Multiverse, outranking the Living Tribunal and all cosmic concepts.',
    },
    adaptationMedia: {
      type: 'Movie (MCU/DCEU)',
      title: 'Marvel Cinematic Universe (Lore Mention)',
      studioOrDistributor: 'Marvel Studios / Disney',
      adaptationFeat: 'Represented conceptually as the cosmic progenitor of the MCU multiverse and Eternity.',
    },
    stats: [
      { key: 'strength', label: 'Strength', value: 100, reasoning: 'Absolute Omnipotence; physical mass and force are trivial concepts subordinate to his thought.' },
      { key: 'speed', label: 'Speed', value: 100, reasoning: 'Absolute Omnipresence; exists simultaneously across all past, present, future, and extradimensional timelines.' },
      { key: 'durability', label: 'Durability', value: 100, reasoning: 'Cannot be harmed, destroyed, erased, or altered by any force or conceptual entity in the multiverse.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 100, reasoning: 'Boundless Omnipotence; creates, alters, or dissolves infinite multiverses with effortless thought.' },
      { key: 'intelligence', label: 'Intelligence', value: 100, reasoning: 'Absolute Omniscience; knows all possible timelines, thoughts, outcomes, and cosmic variables.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 100, reasoning: 'Transcendental supremacy; reality is an effortless extension of his will.' },
      { key: 'willpower', label: 'Willpower', value: 100, reasoning: 'Supreme sovereign intent; unchallenged across all cosmic hierarchies.' },
      { key: 'versatility', label: 'Versatility', value: 100, reasoning: 'Boundless omniversal creation, reality erasure, life and death command, extradimensional authority.' },
    ],
    abilities: [
      {
        id: 'absolute-omnipotence',
        name: 'Absolute Omnipotence & Omniscience',
        description: 'Boundless, unconstrained authority over all creation, conceptual hierarchies, dimensions, and narrative existence.',
        strengths: ['Cannot be countered, bypassed, or constrained by any cosmic law', 'Supreme over all entities including The Living Tribunal'],
        weaknesses: ['None in canonical cosmology'],
        evidence: 'Fantastic Four #511, Thanos: The Infinity Ending, Ultimates 2 #100.',
      },
    ],
    mangaFeats: [
      { id: 'f1', category: 'Feat', title: 'Restoring Ben Grimm from Heaven', description: 'Restored the Thing back to life through pure divine creation and sketched his new adventures.', source: 'Fantastic Four #511 (2004)' },
    ],
  },

  // HUNTER X HUNTER
  'killua': {
    name: 'Killua Zoldyck',
    aliases: ['Lightning Assassin', 'Heir of the Zoldycks'],
    series: 'Hunter x Hunter',
    universe: 'Anime',
    species: 'Human (Nen Transmuter)',
    occupation: 'Pro Hunter / Ex-Assassin',
    tier: 'A',
    popularity: 95,
    emblemColor: '#38BDF8',
    emblemGlyph: 'bolt',
    tagline: 'Moving at the speed of electricity.',
    bio: 'Heir to the notorious Zoldyck assassin family, Killua broke free of his family\'s conditioning. At his peak in the Chimera Ant and Election arcs, his Transmutation Nen transforms aura into high-voltage electricity, achieving the Godspeed state that bypasses ordinary nervous transmission for automated instantaneous reflex blitzes.',
    quote: '“If I ignore a friend I have the ability to help, wouldn’t I be betraying him?”',
    japaneseName: 'キルア＝ゾルディック',
    voiceActor: 'Mariya Ise',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
    primarySource: {
      type: 'Manga',
      title: 'Hunter x Hunter Manga',
      publisherOrCreator: 'Yoshihiro Togashi / Shueisha',
      eraOrDebut: 'Chapter 6 (1998)',
      peakMangaOrComicFeat: 'Godspeed Whirlwind bypassed neural reflex latency to stun Chimera Ant Royal Guard Menthuthuyoupi.',
    },
    adaptationMedia: {
      type: 'Anime',
      title: 'Hunter x Hunter (2011 Anime TV Series)',
      studioOrDistributor: 'Madhouse',
      adaptationFeat: 'Animated high-speed electrical aura blitz in the Palace Invasion arc.',
    },
    stats: [
      { key: 'strength', label: 'Strength', value: 68, reasoning: 'Opened the 5th testing gate (64 tons) without Nen; assassination claw strikes rip through steel and chimera ant armor.' },
      { key: 'speed', label: 'Speed', value: 89, reasoning: 'Godspeed: Whirlwind directly sends electric signals to muscles, reacting automatically at sub-millisecond speeds.' },
      { key: 'durability', label: 'Durability', value: 65, reasoning: 'Trained to resist lethal poisons and millions of volts of electricity, but physical durability remains human-tier against massive kinetic strikes.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 72, reasoning: 'Thunderbolt and Narukami stun Royal Guards like Youpi and decapitate officer ants, but lack mountain/island destroying output.' },
      { key: 'intelligence', label: 'Intelligence', value: 92, reasoning: 'Zoldyck tactical prodigy; rapidly calculates opponent Nen conditions and combat risks.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 90, reasoning: 'Master of Silent Gaits, Rhythm Echo, and assassination anatomy targeting vital organs.' },
      { key: 'willpower', label: 'Willpower', value: 86, reasoning: 'Removed Illumi\'s needle of fear, confronting superior adversaries to protect Gon and Alluka.' },
      { key: 'versatility', label: 'Versatility', value: 80, reasoning: 'Yo-yo weapons, claws, electrical discharges, Godspeed (Speed of Lightning & Whirlwind).' },
    ],
    abilities: [
      {
        id: 'godspeed',
        name: 'Godspeed (Kanmuru: Whirlwind & Speed of Lightning)',
        description: 'Transmutes Nen into electricity permeating the nervous system, bypassing brain latency for autonomous instant reactions and supersonic dashes.',
        strengths: ['Automated evasion and counter-attacks', 'Stuns and paralyzes opponents on contact', 'Extremely high initial reflex speed'],
        weaknesses: ['Electrical aura charge has a strict, short time limit before depletion', 'Strikes lack the mass to pierce high-tier continent/island-level armors'],
        evidence: 'Demonstrated against Chimera Ant Royal Guard Menthuthuyoupi in the Palace Invasion.',
      },
    ],
    mangaFeats: [
      { id: 'f1', category: 'Feat', title: 'Stunning Royal Guard Youpi', description: 'Used Godspeed to completely paralyze Menthuthuyoupi with a barrage of electrical strikes before his aura ran dry.', source: 'Hunter x Hunter, Chapter 281' },
    ],
  },

  // ONE PIECE
  'zoro': {
    name: 'Roronoa Zoro',
    aliases: ['King of Hell', 'Pirate Hunter', 'Master of Three-Sword Style'],
    series: 'One Piece',
    universe: 'Anime',
    species: 'Human',
    occupation: 'Swordsman / First Mate of the Straw Hats',
    tier: 'S',
    popularity: 97,
    emblemColor: '#10B981',
    emblemGlyph: 'sword',
    tagline: 'There is nothing that I cannot cut.',
    bio: 'The First Mate of the Straw Hat Pirates and master of Santoryu (Three-Sword Style). At his peak in Wano and Egghead, Zoro tamed the cursed blade Enma, unlocking Advanced Conqueror\'s Haki infusion ("King of Hell"), cutting Kaido\'s dragon scales, parrying the combined Emperor attack Ocean Sovereignty, and bifurcating mountain-sized colossi.',
    quote: '“Scars on the back are a swordsman’s greatest shame.”',
    japaneseName: 'ロロノア・ゾロ',
    voiceActor: 'Kazuya Nakai',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=85',
    primarySource: {
      type: 'Manga',
      title: 'One Piece (Weekly Shōnen Jump Manga)',
      publisherOrCreator: 'Eiichiro Oda / Shueisha',
      eraOrDebut: 'Chapter 3 (1997)',
      peakMangaOrComicFeat: 'Tamed Enma to coat three swords in Advanced Conqueror\'s Haki, scarring Kaido and parrying Ocean Sovereignty.',
    },
    adaptationMedia: {
      type: 'Anime',
      title: 'One Piece Anime & Wano Arc Climax',
      studioOrDistributor: 'Toei Animation',
      adaptationFeat: 'Animated green hellfire aura slicing through King the Conflagration\'s magma dragon.',
    },
    stats: [
      { key: 'strength', label: 'Strength', value: 93, reasoning: 'Sliced the mountain-sized stone colossus Pica cleanly in half; parried physical swings from Emperor Kaido.' },
      { key: 'speed', label: 'Speed', value: 90, reasoning: 'Shishi Sonson blitzes operate in sub-milliseconds, reacting to supersonic King and laser beam projectiles.' },
      { key: 'durability', label: 'Durability', value: 94, reasoning: 'Absorbed all of Luffy\'s accumulated lethal pain in Thriller Bark ("Nothing Happened"); survived momentary impact of Hakai from two Emperors.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 95, reasoning: 'King of Hell Advanced Conqueror\'s Haki slashes scarred Kaido and cleaved King\'s magma flame dragon.' },
      { key: 'intelligence', label: 'Intelligence', value: 55, reasoning: 'Zero sense of direction, but sharp tactical swordplay intuition and combat focus.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 98, reasoning: 'Master of Santoryu, Ittoryu, Nitoryu, Kyutoryu (Asura), and Advanced Armament/Conqueror\'s coating.' },
      { key: 'willpower', label: 'Willpower', value: 99, reasoning: 'Conqueror\'s spirit; refused death and continued fighting despite dozens of shattered bones.' },
      { key: 'versatility', label: 'Versatility', value: 78, reasoning: 'Flying sword slashes (Pound Ho), Asura nine-blade manifestation, flame-cutting techniques.' },
    ],
    abilities: [
      {
        id: 'king-of-hell-haki',
        name: 'King of Hell Three-Sword Style (Advanced Conqueror\'s Coating)',
        description: 'Tames Enma to release massive amounts of Conqueror\'s Haki, coating all three blades in green hellfire for non-contact armor-piercing kinetic slashes.',
        strengths: ['Cuts through dragon scales, lunarian magma armor, and iron bodies', 'Extreme island-level destructive potency'],
        weaknesses: ['Drains user\'s stamina if fight is dragged out across multiple hours'],
        evidence: 'Decisive victory over King the Conflagration in Wano Arc climax.',
      },
    ],
    mangaFeats: [
      { id: 'f1', category: 'Feat', title: 'Blocking Ocean Sovereignty (Hakai)', description: 'Momentarily held off the combined island-destroying Hakai blast from Emperors Kaido and Big Mom.', source: 'One Piece, Chapter 1009' },
    ],
  },
}

/**
 * Matches character name and returns canon peak manga profile if available.
 */
export function getMangaPeakProfile(name: string): MangaPeakProfile | null {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const key of Object.keys(MANGA_PEAK_REGISTRY)) {
    const cleanKey = key.replace(/[^a-z0-9]/g, '')
    if (norm.includes(cleanKey) || cleanKey.includes(norm) || (norm.includes('oneaboveall') && cleanKey.includes('oneaboveall'))) {
      return MANGA_PEAK_REGISTRY[key]
    }
  }
  return null
}
