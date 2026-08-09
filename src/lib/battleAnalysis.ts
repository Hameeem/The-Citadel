import type { Character, Stat } from '../types/character'

// Weight reflects how much a stat matters to deciding a lethal combat confrontation:
// Attack Potency & Durability are the heaviest decisive metrics in verse power scaling.
const WEIGHTS: Record<string, number> = {
  strength: 1.1,
  speed: 1.15,
  durability: 1.35,
  attack_potency: 1.45,
  intelligence: 0.75,
  combat_skill: 1.1,
  willpower: 0.85,
  versatility: 0.8,
}

export interface CategoryComparison {
  key: string
  label: string
  a: number
  b: number
  winner: 'a' | 'b' | 'tie'
  gap: number
  note: string
}

export interface BattleAnalysis {
  categories: CategoryComparison[]
  scoreA: number
  scoreB: number
  winProbabilityA: number // 0-100
  confidence: 'Low' | 'Moderate' | 'High'
  difficulty: 'Toss-up' | 'Close Fight' | 'Clear Edge' | 'One-Sided'
  favored: 'a' | 'b' | 'even'
  keyFactors: CategoryComparison[]
  alternativeScenario: CategoryComparison | null
  
  // Dual-Canon Source Breakdown
  mangaComicVerdict: {
    title: string
    summary: string
    sourceA: string
    sourceB: string
  }
  mediaAdaptationVerdict: {
    title: string
    summary: string
    adaptationA: string
    adaptationB: string
  }
}

function sharedStats(a: Character, b: Character): Array<{ key: string; label: string; a: Stat; b: Stat }> {
  return a.stats
    .map((sa) => {
      const sb = b.stats.find((s) => s.key === sa.key)
      return sb ? { key: sa.key, label: sa.label, a: sa, b: sb } : null
    })
    .filter((x): x is { key: string; label: string; a: Stat; b: Stat } => x !== null)
}

export function analyzeBattle(a: Character, b: Character): BattleAnalysis {
  const shared = sharedStats(a, b)

  const categories: CategoryComparison[] = shared.map(({ key, label, a: sa, b: sb }) => {
    const gap = sa.value - sb.value
    return {
      key,
      label,
      a: sa.value,
      b: sb.value,
      winner: gap > 4 ? 'a' : gap < -4 ? 'b' : 'tie',
      gap: Math.abs(gap),
      note:
        gap > 4
          ? `${a.name} holds the edge here — ${sa.reasoning}`
          : gap < -4
          ? `${b.name} holds the edge here — ${sb.reasoning}`
          : `Close to even in this category.`,
    }
  })

  const totalWeight = shared.reduce((sum, s) => sum + (WEIGHTS[s.key] ?? 1), 0)
  const scoreA = shared.reduce((sum, s) => sum + s.a.value * (WEIGHTS[s.key] ?? 1), 0) / totalWeight
  const scoreB = shared.reduce((sum, s) => sum + s.b.value * (WEIGHTS[s.key] ?? 1), 0) / totalWeight

  // Absolute Tier 0 / Omnipotent check (e.g. The One Above All)
  const isOmnipotentA = a.alignment === 'Omnipotent' || a.id === 'the-one-above-all'
  const isOmnipotentB = b.alignment === 'Omnipotent' || b.id === 'the-one-above-all'

  let winProbabilityA = 50

  if (isOmnipotentA && !isOmnipotentB) {
    winProbabilityA = 100
  } else if (!isOmnipotentA && isOmnipotentB) {
    winProbabilityA = 0
  } else {
    // Tier multiplier based on power disparity
    const apA = a.stats.find((s) => s.key === 'attack_potency')?.value ?? 80
    const apB = b.stats.find((s) => s.key === 'attack_potency')?.value ?? 80
    const durA = a.stats.find((s) => s.key === 'durability')?.value ?? 80
    const durB = b.stats.find((s) => s.key === 'durability')?.value ?? 80

    // Net potency vs durability differential
    const damageDiffA = apA - durB
    const damageDiffB = apB - durA
    const netCombatGap = (scoreA - scoreB) * 1.25 + (damageDiffA - damageDiffB) * 0.5

    // Logistic probability curve
    const rawProb = 100 / (1 + Math.pow(10, -netCombatGap / 16))
    winProbabilityA = Math.round(Math.min(98, Math.max(2, rawProb)))
  }

  const absGap = Math.abs(winProbabilityA - 50)
  const confidence: BattleAnalysis['confidence'] = absGap > 30 ? 'High' : absGap > 12 ? 'Moderate' : 'Low'
  const difficulty: BattleAnalysis['difficulty'] =
    winProbabilityA >= 90 || winProbabilityA <= 10
      ? 'One-Sided'
      : winProbabilityA >= 68 || winProbabilityA <= 32
      ? 'Clear Edge'
      : winProbabilityA >= 55 || winProbabilityA <= 45
      ? 'Close Fight'
      : 'Toss-up'

  const favored: BattleAnalysis['favored'] = winProbabilityA > 51 ? 'a' : winProbabilityA < 49 ? 'b' : 'even'
  const favoredChar = favored === 'a' ? a : favored === 'b' ? b : null
  const underdogChar = favored === 'a' ? b : favored === 'b' ? a : null

  const keyFactors = [...categories]
    .filter((c) => c.winner !== 'tie')
    .sort((x, y) => y.gap * (WEIGHTS[y.key] ?? 1) - x.gap * (WEIGHTS[x.key] ?? 1))
    .slice(0, 3)

  const underdog = favored === 'a' ? 'b' : 'a'
  const alternativeScenario =
    favored === 'even'
      ? null
      : [...categories]
          .filter((c) => c.winner === underdog)
          .sort((x, y) => y.gap - x.gap)[0] ?? null

  // Dual-Canon Source Summaries
  const sourceNameA = a.primarySource?.title || `${a.series} (Original Canon)`
  const sourceNameB = b.primarySource?.title || `${b.series} (Original Canon)`
  const adaptNameA = a.adaptationMedia?.title || `${a.series} Adaptation`
  const adaptNameB = b.adaptationMedia?.title || `${b.series} Adaptation`

  const mangaComicVerdict = {
    title: 'Original Source Canon (Manga / Comic Lore)',
    summary: favoredChar
      ? `Under pure original Manga / Comic canonical limits, ${favoredChar.name} holds the decisive advantage. Their demonstrated peak feats in ${favoredChar.primarySource?.title || favoredChar.series} outscale ${underdogChar?.name}'s cosmological parameters.`
      : `Both fighters demonstrate virtually equal cosmological scaling and technique potency in their original source publications.`,
    sourceA: a.primarySource?.peakMangaOrComicFeat || `${a.name}'s peak canonical manga/comic feats.`,
    sourceB: b.primarySource?.peakMangaOrComicFeat || `${b.name}'s peak canonical manga/comic feats.`,
  }

  const mediaAdaptationVerdict = {
    title: 'Media Adaptation Lore (Anime / Movie Cinematic Feats)',
    summary: favoredChar
      ? `In televised Anime / Cinematic Movie depictions, ${favoredChar.name}'s visual animation scaling and on-screen pacing reinforce their victory over ${underdogChar?.name}.`
      : `Cinematic animations and film choreography portray both champions with peerless on-screen spectacle.`,
    adaptationA: a.adaptationMedia?.adaptationFeat || `${a.name}'s animated/movie cinematic feats.`,
    adaptationB: b.adaptationMedia?.adaptationFeat || `${b.name}'s animated/movie cinematic feats.`,
  }

  return {
    categories,
    scoreA,
    scoreB,
    winProbabilityA,
    confidence,
    difficulty,
    favored,
    keyFactors,
    alternativeScenario,
    mangaComicVerdict,
    mediaAdaptationVerdict,
  }
}

export function simulateFight(a: Character, b: Character, analysis: BattleAnalysis) {
  const aTopAbility = a.abilities[0]?.name ?? `${a.name}'s signature technique`
  const bTopAbility = b.abilities[0]?.name ?? `${b.name}'s signature technique`
  const favoredChar = analysis.favored === 'a' ? a : analysis.favored === 'b' ? b : null
  const underdogChar = analysis.favored === 'a' ? b : analysis.favored === 'b' ? a : null
  const swingCategory = analysis.alternativeScenario

  const isOneSided = analysis.difficulty === 'One-Sided' || analysis.difficulty === 'Clear Edge'
  const isOmnipotent = a.alignment === 'Omnipotent' || b.alignment === 'Omnipotent'

  if (isOmnipotent) {
    const omni = a.alignment === 'Omnipotent' ? a : b
    const mortal = a.alignment === 'Omnipotent' ? b : a
    return [
      {
        id: 'opening',
        title: 'Manifestation of the Supreme Reality',
        text: `${omni.name} manifests as an omnipresent sovereign presence across all dimensional planes. ${mortal.name} attempts to engage using ${mortal.abilities[0]?.name || 'their maximum arsenal'}.`,
      },
      {
        id: 'escalation',
        title: 'Cosmic Dissolution',
        text: `${mortal.name}'s highest attacks simply dissolve into uncreated energy. Concepts of velocity, physical mass, and damage do not apply against the absolute architect of the multiverse.`,
      },
      {
        id: 'turning-point',
        title: 'The House of Ideas Reality Shift',
        text: `${omni.name} effortlessly rewrites the timeline and dimensional coordinates containing ${mortal.name}.`,
      },
      {
        id: 'final-clash',
        title: 'Supreme Transcendence',
        text: `With an unvoiced thought, ${omni.name} reasserts absolute omnipotence over all creation.`,
      },
      {
        id: 'ending',
        title: 'Absolute Omniversal Victory',
        text: `${omni.name} stands completely unchallengeable as the One Above All.`,
      },
    ]
  }

  return [
    {
      id: 'opening',
      title: 'Opening Clash & Source Lore Probe',
      text: `${a.name} engages at full manga/comic potential using ${aTopAbility}, while ${b.name} counters with ${bTopAbility}. Both test each other\'s combat velocity and reaction reflexes in high-speed initial exchanges.`,
    },
    {
      id: 'escalation',
      title: 'Tactical Escalation & Screen Animation Pacing',
      text: swingCategory && underdogChar
        ? `${underdogChar.name} attempts to exploit their advantage in ${swingCategory.label.toLowerCase()} to land rapid strikes, testing the defensive threshold of ${favoredChar?.name ?? 'their opponent'}.`
        : `The clash escalates into a battle of ${analysis.keyFactors[0]?.label.toLowerCase() ?? 'raw output'}, where ${
            analysis.keyFactors[0]?.winner === 'a' ? a.name : b.name
          } asserts undeniable dominance on the battlefield.`,
    },
    {
      id: 'turning-point',
      title: 'Durability & Defense Threshold Test',
      text: isOneSided && favoredChar
        ? `${favoredChar.name}'s massive durability and defensive aura prove too dense for ${underdogChar?.name}'s offensive toolkit to inflict critical structural damage. Even clean hits fail to bypass ${favoredChar.name}'s defensive armor.`
        : `Both combatants push their techniques to their limits, trading devastating impacts that shatter the surrounding arena terrain.`,
    },
    {
      id: 'final-clash',
      title: 'Apex Technique Clash',
      text: favoredChar
        ? `In the decisive exchange, ${favoredChar.name} unleashes their full-power ultimate attack. The sheer disparity in ${analysis.keyFactors[0]?.label.toLowerCase() ?? 'attack potency'} completely overpowers ${underdogChar?.name}'s guard.`
        : `Both fighters unleash their supreme techniques in a catastrophic simultaneous collision that rocks the dimensional arena.`,
    },
    {
      id: 'ending',
      title: 'Dual-Canon Verdict',
      text: favoredChar
        ? `${favoredChar.name} emerges decisively victorious according to peak canonical manga/comic scaling and anime/movie depictions. ${
            underdogChar?.name
          } demonstrated exceptional tactical prowess, but could not overcome the higher cosmological power tier and destructive potency gap.`
        : `The duel concludes in an absolute draw — their peak canonical parameters across comics, manga, and media adaptations are too evenly matched for either to claim definitive victory.`,
    },
  ]
}
