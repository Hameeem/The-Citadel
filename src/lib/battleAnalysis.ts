import type { Character, Stat } from '../types/character'

/**
 * The Citadel's analysis engine is intentionally NOT a black-box LLM call.
 * It computes verdicts directly from each character's own evidence-backed
 * stats, so every number in the output traces back to something already
 * visible on both profile pages. This is what the brief's "reasoning first,
 * verdict second — never invent a number" rule actually requires: the AI
 * Arena should explain itself using the archive's own data, not guess.
 *
 * (Swapping this for a real LLM call later is straightforward — see the
 * README note in Arena.tsx — but it should generate the *narrative*, not
 * the underlying numbers, to keep the "every stat has evidence" promise.)
 */

// Weight reflects how much a stat matters to actually winning a fight,
// not how "cool" it is — e.g. attack potency and durability decide fights
// more directly than raw intelligence.
const WEIGHTS: Record<string, number> = {
  strength: 1.0,
  speed: 1.05,
  durability: 1.15,
  attack_potency: 1.3,
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

  const gap = scoreA - scoreB
  // logistic curve keeps probabilities within a believable 5-95 band —
  // no matchup is ever presented as a mathematical certainty
  const rawProb = 100 / (1 + Math.pow(10, -gap / 18))
  const winProbabilityA = Math.round(Math.min(95, Math.max(5, rawProb)))

  const absGap = Math.abs(gap)
  const confidence: BattleAnalysis['confidence'] = absGap > 18 ? 'High' : absGap > 8 ? 'Moderate' : 'Low'
  const difficulty: BattleAnalysis['difficulty'] =
    winProbabilityA > 85 || winProbabilityA < 15
      ? 'One-Sided'
      : winProbabilityA > 68 || winProbabilityA < 32
      ? 'Clear Edge'
      : winProbabilityA > 56 || winProbabilityA < 44
      ? 'Close Fight'
      : 'Toss-up'

  const favored: BattleAnalysis['favored'] = winProbabilityA > 54 ? 'a' : winProbabilityA < 46 ? 'b' : 'even'

  const keyFactors = [...categories]
    .filter((c) => c.winner !== 'tie')
    .sort((x, y) => y.gap * (WEIGHTS[y.key] ?? 1) - x.gap * (WEIGHTS[x.key] ?? 1))
    .slice(0, 3)

  // The strongest category for whoever is the underdog — the honest
  // "here's how the other side actually wins" scenario
  const underdog = favored === 'a' ? 'b' : 'a'
  const alternativeScenario =
    favored === 'even'
      ? null
      : [...categories]
          .filter((c) => c.winner === underdog)
          .sort((x, y) => y.gap - x.gap)[0] ?? null

  return { categories, scoreA, scoreB, winProbabilityA, confidence, difficulty, favored, keyFactors, alternativeScenario }
}

export function simulateFight(a: Character, b: Character, analysis: BattleAnalysis) {
  const aTopAbility = a.abilities[0]?.name ?? `${a.name}'s signature ability`
  const bTopAbility = b.abilities[0]?.name ?? `${b.name}'s signature ability`
  const favoredChar = analysis.favored === 'a' ? a : analysis.favored === 'b' ? b : null
  const underdogChar = analysis.favored === 'a' ? b : analysis.favored === 'b' ? a : null
  const swingCategory = analysis.alternativeScenario

  return [
    {
      id: 'opening',
      title: 'Opening',
      text: `${a.name} and ${b.name} size each other up. ${a.name} tests the range with ${aTopAbility.toLowerCase().startsWith('the') ? aTopAbility : aTopAbility}, while ${b.name} answers with ${bTopAbility}. Neither commits fully yet.`,
    },
    {
      id: 'escalation',
      title: 'Escalation',
      text: analysis.keyFactors[0]
        ? `The fight tilts toward a battle of ${analysis.keyFactors[0].label.toLowerCase()} — the category with the widest gap between them. ${
            analysis.keyFactors[0].winner === 'a' ? a.name : b.name
          } starts to press the advantage there.`
        : `Both fighters are closely matched across the board, so neither can lean on a single clear advantage.`,
    },
    {
      id: 'turning-point',
      title: 'Turning Point',
      text: swingCategory && underdogChar
        ? `${underdogChar.name} finds an opening by leaning on ${swingCategory.label.toLowerCase()} — the one category where the numbers actually favor them — and the fight becomes genuinely competitive again.`
        : `Both sides trade momentum without either fully breaking the other's defense.`,
    },
    {
      id: 'final-clash',
      title: 'Final Clash',
      text: favoredChar
        ? `In the closing exchange, ${favoredChar.name}'s edge in ${analysis.keyFactors[0]?.label.toLowerCase() ?? 'overall output'} becomes decisive under sustained pressure.`
        : `The final exchange stays razor-close, decided by a single exchange rather than a clear power gap.`,
    },
    {
      id: 'ending',
      title: 'Ending',
      text: favoredChar
        ? `${favoredChar.name} comes out ahead — not a clean sweep, but the result the underlying numbers pointed to. ${
            underdogChar?.name
          } lands real hits along the way.`
        : `The two fight to a draw — the stat gap is too small for this engine to call it either way with confidence.`,
    },
  ]
}
