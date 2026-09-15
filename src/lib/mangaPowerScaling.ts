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
  isUnrevealedApex?: boolean
  unrevealedPowerReasoning?: string
  primarySource?: PrimarySourceInfo
  adaptationMedia?: AdaptationMediaInfo
  stats: Stat[]
  abilities: Ability[]
  growthNotes?: string
  mangaFeats: ArchiveEntry[]
}

/**
 * Canon Manga & Comic Peak Power Scaling Profiles.
 * Includes explicit Unrevealed Apex Titans (Shanks, Minato, Beyonder, Lucifer, Yoriichi, etc.)
 */
export const MANGA_PEAK_REGISTRY: Record<string, MangaPeakProfile> = {
  // ONE PIECE - RED-HAIRED SHANKS (UNREVEALED APEX)
  'shanks': {
    name: 'Red-Haired Shanks',
    aliases: ['Chief of the Red Hair Pirates', 'Four Emperors (Yonko)', 'Haki Killer'],
    series: 'One Piece',
    universe: 'Anime',
    species: 'Human',
    occupation: 'Pirate Captain / Emperor of the Sea',
    tier: 'S',
    popularity: 98,
    emblemColor: '#DC2626',
    emblemGlyph: 'sword',
    tagline: 'If you want to keep fighting, come! We will be your opponents!',
    bio: 'Captain of the Red Hair Pirates and one of the Four Emperors. Former apprentice on Gol D. Roger\'s ship. Shanks possesses the supreme mastery of Conqueror\'s Haki in the world, capable of killing Observation Haki ("Haki Killer") and paralyzing Admirals from miles away. His full combat potential and backstory remain one of the greatest unrevealed mysteries in One Piece.',
    quote: '“By making peace with the present, you open the door to the future.”',
    japaneseName: 'シャンクス',
    voiceActor: 'Shūichi Ikeda',
    imageUrl: 'https://cdn.myanimelist.net/images/characters/12/284123.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    isUnrevealedApex: true,
    unrevealedPowerReasoning: 'Stopped the Marineford War single-handedly, paralyzed Admiral Ryokugyu with wifi Conqueror\'s Haki from miles away, split the sky with Whitebeard, and one-shot Eustass Kid with Divine Departure, yet his full combat arsenal and backstory remain unrevealed in Oda\'s manga.',
    primarySource: {
      type: 'Manga',
      title: 'One Piece (Weekly Shōnen Jump Manga)',
      publisherOrCreator: 'Eiichiro Oda / Shueisha',
      eraOrDebut: 'Chapter 1 (1997)',
      peakMangaOrComicFeat: 'One-shot Eustass Kid (3 Billion Bounty) with Divine Departure (Kamusari) and paralyzed Admiral Ryokugyu with wifi Conqueror\'s Haki.',
    },
    adaptationMedia: {
      type: 'Anime',
      title: 'One Piece Film: Red & Wano Arc',
      studioOrDistributor: 'Toei Animation',
      adaptationFeat: 'Overwhelmed Kizaru and Fujitora with supreme Conqueror\'s pressure in Film Red.',
    },
    stats: [
      { key: 'strength', label: 'Strength', value: 94, reasoning: 'Clashed one-handed with Edward Newgate (Whitebeard) and stopped Akainu\'s magma fist with a single sword block.' },
      { key: 'speed', label: 'Speed', value: 95, reasoning: 'Speed-blitzed across miles of ocean in seconds to intercept Eustass Kid before his Damned Punk fired.' },
      { key: 'durability', label: 'Durability', value: 90, reasoning: 'Endured high-sea battles across the Grand Line without a Devil Fruit.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 97, reasoning: 'Divine Departure (Kamusari) obliterated Eustass Kid and Killer simultaneously.' },
      { key: 'intelligence', label: 'Intelligence', value: 94, reasoning: 'Master diplomat and strategist; visited the Five Elders at Mary Geoise.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 98, reasoning: 'Former rival of Dracule Mihawk; master swordsman wielding the Meito Gryphon.' },
      { key: 'willpower', label: 'Willpower', value: 100, reasoning: 'The supreme wielder of Conqueror\'s Haki; can suppress opponent Observation Haki entirely.' },
      { key: 'versatility', label: 'Versatility', value: 88, reasoning: 'Observation Killing, Advanced Conqueror\'s Coating, Swordplay, Diplomatic Authority.' },
    ],
    abilities: [
      {
        id: 'haki-killer',
        name: 'Observation Killing & Divine Departure (Kamusari)',
        description: 'Manipulates his Conqueror\'s aura to prevent opponents from seeing into the future with Observation Haki while delivering lethal flying slashes.',
        strengths: ['Cancels opponent Future Sight', 'Massive non-contact armor-piercing damage'],
        weaknesses: ['Unrevealed full potential in canon'],
        evidence: 'One Piece Chapter 1079 & Volume 4 Billion.',
      },
    ],
    mangaFeats: [
      { id: 'f1', category: 'Feat', title: 'Stopping the Marineford War', description: 'Arrived at Marineford and challenged anyone who wished to continue fighting, bringing the War of the Best to a complete halt.', source: 'One Piece Chapter 580' },
      { id: 'f2', category: 'Feat', title: 'Wifi Conqueror\'s Haki on Ryokugyu', description: 'Unleashed Conqueror\'s Haki from miles away at sea, paralyzing Admiral Ryokugyu in Wano.', source: 'One Piece Chapter 1055' },
    ],
  },

  // NARUTO - MINATO NAMIKAZE (UNREVEALED APEX)
  'minato': {
    name: 'Minato Namikaze',
    aliases: ['The Yellow Flash of the Leaf', 'Fourth Hokage'],
    series: 'Naruto',
    universe: 'Anime',
    species: 'Human (Shinobi)',
    occupation: 'Fourth Hokage of the Hidden Leaf Village',
    tier: 'S',
    popularity: 97,
    emblemColor: '#EAB308',
    emblemGlyph: 'bolt',
    tagline: 'When you encounter the Yellow Flash of the Leaf, run on sight.',
    bio: 'The Fourth Hokage of the Hidden Leaf and father of Naruto Uzumaki. Minato was a once-in-a-generation genius who perfected the Flying Raijin (Flying Thunder God) formula and invented the Rasengan. Enemy nations issued an official "Flee on Sight" order to all troops during the Third Shinobi World War.',
    quote: '“To be a shinobi is to endure, to fight for what you believe in.”',
    japaneseName: '波風ミナト',
    voiceActor: 'Toshiyuki Morikawa',
    imageUrl: 'https://cdn.myanimelist.net/images/characters/11/87820.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isUnrevealedApex: true,
    unrevealedPowerReasoning: 'Wiped out 1,000 Iwa shinobi single-handedly, created Rasengan, mastered Flying Raijin, and sealed Nine-Tails, but died young at age 24 before his full lifetime prime potential was realized.',
    primarySource: {
      type: 'Manga',
      title: 'Naruto Manga & Minato One-Shot (The Whorl within the Spiral)',
      publisherOrCreator: 'Masashi Kishimoto / Shueisha',
      eraOrDebut: 'Chapter 239 (2004) / One-Shot (2023)',
      peakMangaOrComicFeat: 'Single-handedly defeated 1,000 Hidden Stone shinobi in seconds using Flying Raijin teleportation.',
    },
    adaptationMedia: {
      type: 'Anime',
      title: 'Naruto Shippuden & Nine-Tails Attack',
      studioOrDistributor: 'Studio Pierrot',
      adaptationFeat: 'Outmaneuvered Tobi (Obito) and placed the Contract Seal to free Nine-Tails from control.',
    },
    stats: [
      { key: 'strength', label: 'Strength', value: 82, reasoning: 'Sage Mode physical amplification and Rasengan kinetic impact.' },
      { key: 'speed', label: 'Speed', value: 98, reasoning: 'The fastest shinobi in history via Flying Raijin instant space-time teleportation.' },
      { key: 'durability', label: 'Durability', value: 80, reasoning: 'High Jonin physical durability, enhanced by Kurama Chakra Mode in Edo Tensei.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 92, reasoning: 'Rasengan, Guiding Thunder space-time barrier, and Nine-Tails sealing.' },
      { key: 'intelligence', label: 'Intelligence', value: 98, reasoning: 'Calculated Obito\'s Kamui mechanics in under 10 seconds of combat.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 96, reasoning: 'Master of Uzumaki sealing jutsu, Flying Raijin Level 2, and kunai dueling.' },
      { key: 'willpower', label: 'Willpower', value: 96, reasoning: 'Sacrificed his life alongside Kushina to protect Naruto and the Leaf Village.' },
      { key: 'versatility', label: 'Versatility', value: 94, reasoning: 'Flying Raijin (Level 1 & 2), Rasengan, Reaper Death Seal, Guiding Thunder, Sage Mode.' },
    ],
    abilities: [
      {
        id: 'flying-raijin-2',
        name: 'Flying Raijin Level 2 & Rasengan',
        description: 'Teleports instantaneously to any marked formula kunai or target tag, executing an unavoidable Rasengan strike from dead blindspots.',
        strengths: ['Instantaneous space-time movement', 'Unblockable positioning'],
        weaknesses: ['Requires pre-marked kunai or formula seals'],
        evidence: 'Defeat of Tobi (Obito) during the Nine-Tails invasion.',
      },
    ],
    mangaFeats: [
      { id: 'f1', category: 'Feat', title: 'Outsmarting Tobi (Obito)', description: 'Faced the masked man, analyzed Kamui intangibility mid-fight, and landed a Flying Raijin Rasengan within 2 exchanges.', source: 'Naruto Chapter 502' },
    ],
  },

  // MARVEL - THE BEYONDER (PRE-RETCON) (UNREVEALED APEX)
  'beyonder': {
    name: 'The Beyonder',
    aliases: ['Pre-Retcon Beyonder', 'The One from Beyond', 'Beyond Realm Sovereign'],
    series: 'Marvel Secret Wars',
    universe: 'Marvel',
    species: 'Beyond Realm Transcendental Entity',
    occupation: 'Supreme Entity of the Beyond Realm',
    tier: 'SSS',
    popularity: 95,
    emblemColor: '#8B5CF6',
    emblemGlyph: 'star',
    tagline: 'I am everything. You are nothing.',
    bio: 'The incarnation of the entire Beyond Realm, a multiverse outside the Marvel Omniverse. In Secret Wars (1984), his power was millions of times greater than the entire Marvel multiverse combined, holding absolute unconstrained reality manipulation.',
    quote: '“I have come to learn what it means to exist.”',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=85',
    isUnrevealedApex: true,
    unrevealedPowerReasoning: 'Possessed energy millions of times greater than all Marvel realities combined, standing beyond cosmic abstracts like Eternity and Living Tribunal, leaving his ultimate power ceiling unrevealed.',
    stats: [
      { key: 'strength', label: 'Strength', value: 100, reasoning: 'Infinite multiversal physical and conceptual strength.' },
      { key: 'speed', label: 'Speed', value: 100, reasoning: 'Omnipresent across all space and time beyond the multiverse.' },
      { key: 'durability', label: 'Durability', value: 100, reasoning: 'Cannot be destroyed by any multiversal blast or cosmic entity.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 100, reasoning: 'Erased galaxic clusters and reshaped reality with effortless desire.' },
      { key: 'intelligence', label: 'Intelligence', value: 95, reasoning: 'Omniscient regarding physical laws, though curious about human emotion.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 95, reasoning: 'Transcendental reality command.' },
      { key: 'willpower', label: 'Willpower', value: 98, reasoning: 'Absolute whim and desires reshape existence.' },
      { key: 'versatility', label: 'Versatility', value: 100, reasoning: 'Infinite multiversal reality manipulation.' },
    ],
    abilities: [{ id: 'ab1', name: 'Beyond Realm Omnipotence', description: 'Manipulates all matter, energy, time, and space across all dimensions at will.', strengths: ['Dwarfs Marvel Multiverse'], weaknesses: ['Inexperience with human emotions'], evidence: 'Secret Wars (1984).' }],
    mangaFeats: [{ id: 'f1', category: 'Feat', title: 'Creating Battleworld', description: 'Plucked pieces of planets across galaxies to form Battleworld for super-heroes and villains.', source: 'Secret Wars #1' }],
  },

  // DC - LUCIFER MORNINGSTAR (UNREVEALED APEX)
  'lucifer-morningstar': {
    name: 'Lucifer Morningstar',
    aliases: ['The Lightbringer', 'Satan', 'Ruler of Hell (Former)'],
    series: 'DC Comics / Vertigo',
    universe: 'DC',
    species: 'Archangel (Demiurgic Will)',
    occupation: 'Lightbringer / Bar Owner (Lux) / Co-Creator of Reality',
    tier: 'SSS',
    popularity: 96,
    emblemColor: '#EF4444',
    emblemGlyph: 'flame',
    tagline: 'I do not bow.',
    bio: 'The second strongest entity in all of DC Comics, second only to The Presence. Lucifer wields the Demiurgic Will of God, capable of shaping the raw infinite power of his brother Michael into entire multiverses.',
    quote: '“I prefer to create my own destiny.”',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=85',
    isUnrevealedApex: true,
    unrevealedPowerReasoning: 'Wields divine light capable of shaping infinite multiverses; stood outside the DC creation and burned the Destiny Book, leaving his absolute limits beyond mortal and cosmic comprehension.',
    stats: [
      { key: 'strength', label: 'Strength', value: 100, reasoning: 'Demiurgic Will capable of shaping infinite multiverses.' },
      { key: 'speed', label: 'Speed', value: 100, reasoning: 'Omnipresent throughout creation and the Void.' },
      { key: 'durability', label: 'Durability', value: 100, reasoning: 'Immune to all physical, magical, and conceptual attacks.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 100, reasoning: 'Ignited and shaped a brand-new multiverse outside of The Presence\'s creation.' },
      { key: 'intelligence', label: 'Intelligence', value: 100, reasoning: 'Near-omniscient brilliance, outsmarted ancient gods, demons, and destiny.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 98, reasoning: 'Master swordsman and eldritch archangel combatant.' },
      { key: 'willpower', label: 'Willpower', value: 100, reasoning: 'Absolute unyielding free will that refuses to submit to divine predestination.' },
      { key: 'versatility', label: 'Versatility', value: 100, reasoning: 'Demiurgic Light, reality manipulation, matter creation, dimensional travel, immortality.' },
    ],
    abilities: [{ id: 'ab1', name: 'Demiurgic Light & Reality Shaping', description: 'Shapes raw uncreated matter into universes, stars, and physical laws.', strengths: ['Near-Omnipotent'], weaknesses: ['Cannot create raw matter out of nothing without Michael\'s power'], evidence: 'Lucifer (Vertigo) #50.' }],
    mangaFeats: [{ id: 'f1', category: 'Feat', title: 'Creating a New Multiverse', description: 'Used Michael\'s spilled demiurgic energy to ignite a completely new multiverse outside of God\'s realm.', source: 'Lucifer #16' }],
  },

  // DEMON SLAYER - YORIICHI TSUGIKUNI (UNREVEALED APEX)
  'yoriichi': {
    name: 'Yoriichi Tsugikuni',
    aliases: ['Progenitor of Sun Breathing', 'The Legendary Demon Slayer'],
    series: 'Demon Slayer (Kimetsu no Yaiba)',
    universe: 'Anime',
    species: 'Human (Awakened Mark / Transparent World)',
    occupation: 'Demon Slayer (Sengoku Era)',
    tier: 'S',
    popularity: 97,
    emblemColor: '#F97316',
    emblemGlyph: 'flame',
    tagline: 'I was born with a special power to defeat Muzan.',
    bio: 'The strongest Demon Slayer in history and creator of Sun Breathing (Hinokami Kagura). Born with the Demon Slayer Mark, Transparent World, and Selfless State. In his legendary encounter with Muzan Kibutsuji, Yoriichi cut 1,500 of Muzan\'s 1,800 flesh fragments in a single millisecond slash, traumatizing Muzan\'s cellular memory forever.',
    quote: '“Those who master their art all arrive at the same place.”',
    japaneseName: '継国縁壱',
    voiceActor: 'Kazuhiko Inoue',
    imageUrl: 'https://cdn.myanimelist.net/images/characters/5/437920.jpg',
    isUnrevealedApex: true,
    unrevealedPowerReasoning: 'Born as a natural god of swordplay with the Transparent World and Selfless State active since birth; effortlessly blitzed Muzan without taking a single scratch in his entire life, dying of old age at 85 mid-strike.',
    stats: [
      { key: 'strength', label: 'Strength', value: 85, reasoning: 'Red Sun Nichirin Blade cuts through Muzan\'s instant-regenerating blood demon armor.' },
      { key: 'speed', label: 'Speed', value: 98, reasoning: 'Sliced 1,500 flesh fragments of Muzan in under a millisecond; outspeeds all Hashira and Upper Moons combined.' },
      { key: 'durability', label: 'Durability', value: 75, reasoning: 'Human biological body, but was never hit once by any demon or human opponent in his 85 years of life.' },
      { key: 'attack_potency', label: 'Attack Potency', value: 92, reasoning: 'Sun Breathing 13th Form inflicts permanent cellular burning damage that stops demon regeneration for centuries.' },
      { key: 'intelligence', label: 'Intelligence', value: 92, reasoning: 'Transparent World allows seeing organs, muscle contractions, and blood flow instantly.' },
      { key: 'combat_skill', label: 'Combat Skill', value: 100, reasoning: 'The absolute pinnacle of swordsmanship in Demon Slayer history; invented Sun Breathing.' },
      { key: 'willpower', label: 'Willpower', value: 95, reasoning: 'Tragic yet tranquil warrior devoted to protecting human life.' },
      { key: 'versatility', label: 'Versatility', value: 90, reasoning: 'Sun Breathing 13 Forms, Red Blade, Transparent World, Selfless State, Demon Slayer Mark.' },
    ],
    abilities: [{ id: 'ab1', name: 'Sun Breathing 13th Form & Red Nichirin Blade', description: 'Connects all 12 Sun Breathing forms continuously, turning the Nichirin blade bright red to stop demon regeneration at the cellular level.', strengths: ['Permanent cellular burn on demons', 'Transparent World precognition'], weaknesses: ['Mortal human body'], evidence: 'Demon Slayer Chapter 186-187.' }],
    mangaFeats: [{ id: 'f1', category: 'Feat', title: 'One-Shotting Muzan Kibutsuji', description: 'Defeated the Demon King Muzan in a single exchange, forcing Muzan to split into 1,800 pieces to escape.', source: 'Demon Slayer Chapter 187' }],
  },
}

/**
 * Matches character name and returns canon peak manga profile if available.
 */
export function getMangaPeakProfile(name: string): MangaPeakProfile | null {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const key of Object.keys(MANGA_PEAK_REGISTRY)) {
    const cleanKey = key.replace(/[^a-z0-9]/g, '')
    if (norm.includes(cleanKey) || cleanKey.includes(norm)) {
      return MANGA_PEAK_REGISTRY[key]
    }
  }
  return null
}
