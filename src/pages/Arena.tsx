import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { characters } from '../data/characters'
import { analyzeBattle, simulateFight } from '../lib/battleAnalysis'
import FeaturedBattle from '../components/FeaturedBattle'
import Emblem from '../components/Emblem'
import type { Character } from '../types/character'

type Phase = 'select' | 'loading' | 'result'

const QUICK_MATCHUPS: [string, string][] = [
  ['batman', 'iron-man'],
  ['monkey-d-luffy', 'naruto-uzumaki'],
  ['superman', 'scarlet-witch'],
]

export default function Arena() {
  const [params] = useSearchParams()
  const initialA = params.get('a')
  const initialB = params.get('b')
  const [aId, setAId] = useState<string>(characters.some((c) => c.id === initialA) ? initialA! : characters[0].id)
  const [bId, setBId] = useState<string>(characters.some((c) => c.id === initialB) ? initialB! : characters[2].id)
  const [phase, setPhase] = useState<Phase>('select')

  const a = characters.find((c) => c.id === aId)!
  const b = characters.find((c) => c.id === bId)!
  const analysis = phase === 'result' ? analyzeBattle(a, b) : null
  const narrative = analysis ? simulateFight(a, b, analysis) : null

  const enterArena = () => {
    if (aId === bId) return
    setPhase('loading')
    setTimeout(() => setPhase('result'), 1400)
  }

  const pick = (side: 'a' | 'b', id: string) => {
    if (side === 'a') setAId(id)
    else setBId(id)
    setPhase('select')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-gradient">THE ARENA</h1>
        <p className="text-ink-mid mt-2">Pick two characters. Get a reasoned outlook, not a coin flip.</p>
      </div>

      {/* FEATURED / QUICK MATCHUPS */}
      <div className="mb-14">
        <div className="text-[10px] font-head tracking-[0.25em] text-ink-low mb-4 text-center">FEATURED BATTLES</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {QUICK_MATCHUPS.map(([x, y]) => {
            const cx = characters.find((c) => c.id === x)!
            const cy = characters.find((c) => c.id === y)!
            return <FeaturedBattle key={x + y} a={cx} b={cy} />
          })}
        </div>
      </div>

      {/* SELECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <FighterPicker side="A" selected={a} onSelect={(id) => pick('a', id)} exclude={bId} color="#8B5CF6" />
        <div className="flex flex-col items-center justify-center py-4">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="font-display text-2xl text-ink-low"
          >
            VS
          </motion.div>
        </div>
        <FighterPicker side="B" selected={b} onSelect={(id) => pick('b', id)} exclude={aId} color="#3B82F6" />
      </div>

      <div className="text-center mt-10">
        <button
          onClick={enterArena}
          disabled={aId === bId || phase === 'loading'}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-purple via-blue to-crimson font-head font-semibold text-sm tracking-widest text-void shadow-glow hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
        >
          {phase === 'loading' ? 'ENTERING THE ARENA…' : 'ENTER THE ARENA'}
        </button>
        {aId === bId && <p className="text-xs text-crimson-bright mt-3">Pick two different characters.</p>}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-purple/30 border-t-purple"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="font-head text-sm tracking-[0.2em] text-ink-mid">ANALYZING CANON EVIDENCE…</p>
          </motion.div>
        )}

        {phase === 'result' && analysis && narrative && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <VerdictPanel a={a} b={b} analysis={analysis} narrative={narrative} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FighterPicker({
  side,
  selected,
  onSelect,
  exclude,
  color,
}: {
  side: 'A' | 'B'
  selected: Character
  onSelect: (id: string) => void
  exclude: string
  color: string
}) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col items-center text-center" style={{ boxShadow: `0 0 30px ${color}22` }}>
      <div className="text-[10px] font-head tracking-[0.2em] text-ink-low mb-4">FIGHTER {side}</div>
      <Emblem character={selected} size={100} />
      <h3 className="font-head text-lg font-semibold text-ink-hi mt-4">{selected.name}</h3>
      <p className="text-xs text-ink-mid">{selected.universe} · {selected.series}</p>
      <select
        value={selected.id}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-5 w-full px-3 py-2 rounded-lg glass text-sm text-ink-hi focus:outline-none focus:glow-ring"
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id} disabled={c.id === exclude} className="bg-panel">
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function VerdictPanel({
  a,
  b,
  analysis,
  narrative,
}: {
  a: Character
  b: Character
  analysis: ReturnType<typeof analyzeBattle>
  narrative: ReturnType<typeof simulateFight>
}) {
  const bProb = 100 - analysis.winProbabilityA
  const favoredChar = analysis.favored === 'a' ? a : analysis.favored === 'b' ? b : null
  const aTop = [...a.stats].sort((x, y) => y.value - x.value).slice(0, 2)
  const bTop = [...b.stats].sort((x, y) => y.value - x.value).slice(0, 2)

  return (
    <div className="space-y-10">
      {/* BATTLE OUTLOOK */}
      <div className="glass rounded-3xl p-8">
        <div className="text-center mb-6">
          <div className="text-[10px] font-head tracking-[0.25em] text-ink-low mb-1">BATTLE OUTLOOK</div>
          <h2 className="font-display text-2xl text-ink-hi">
            {favoredChar ? (
              <>{favoredChar.name} <span className="text-purple-bright">favored</span></>
            ) : (
              <span className="text-purple-bright">Too close to call</span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono mb-2">
          <span className="text-ink-hi">{a.name}</span>
          <span className="ml-auto text-ink-hi">{b.name}</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.winProbabilityA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-purple-deep to-purple flex items-center justify-end pr-2"
          >
            <span className="text-[10px] font-mono text-void font-bold">{analysis.winProbabilityA}%</span>
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bProb}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-l from-blue-bright to-blue flex items-center justify-start pl-2"
          >
            <span className="text-[10px] font-mono text-void font-bold">{bProb}%</span>
          </motion.div>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <Badge label="Confidence" value={analysis.confidence} />
          <Badge label="Difficulty" value={analysis.difficulty} />
        </div>
      </div>

      {/* REASONS */}
      <div>
        <SectionLabel>Reasoning First</SectionLabel>
        <div className="mt-4 space-y-2">
          {analysis.keyFactors.map((c) => (
            <div key={c.key} className="glass rounded-xl px-5 py-3 text-sm text-ink-mid leading-relaxed">
              {c.note}
            </div>
          ))}
        </div>
      </div>

      {/* KEY FACTORS + ALTERNATIVE */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-head font-semibold text-ink-hi mb-3">Key Deciding Factors</h3>
          <ul className="space-y-2">
            {analysis.keyFactors.map((c) => (
              <li key={c.key} className="text-sm text-ink-mid flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-bright" /> {c.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-head font-semibold text-ink-hi mb-3">Alternative Scenario</h3>
          <p className="text-sm text-ink-mid leading-relaxed">
            {analysis.alternativeScenario
              ? analysis.alternativeScenario.note
              : 'No clear underdog advantage on paper — a favorable opening exchange could still change the outcome.'}
          </p>
        </div>
      </div>

      {/* BOTH SIDES RESPECTED */}
      <div className="grid md:grid-cols-2 gap-5">
        <FanCard character={a} strengths={aTop} />
        <FanCard character={b} strengths={bTop} />
      </div>

      {/* FIGHT SIMULATION */}
      <div>
        <SectionLabel>Fight Simulation</SectionLabel>
        <div className="mt-4 relative pl-6 space-y-6 border-l border-white/10">
          {narrative.map((n) => (
            <div key={n.id} className="relative">
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-gradient-to-br from-purple to-blue" />
              <h4 className="font-head font-semibold text-ink-hi">{n.title}</h4>
              <p className="text-sm text-ink-mid mt-0.5 leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FanCard({ character, strengths }: { character: Character; strengths: { label: string; value: number }[] }) {
  return (
    <div className="glass rounded-2xl p-6 flex gap-4 items-start">
      <Emblem character={character} size={56} />
      <div>
        <h4 className="font-head font-semibold text-ink-hi">{character.name}</h4>
        <p className="text-xs text-ink-low mb-2">strongest categories</p>
        <div className="flex gap-2 flex-wrap">
          {strengths.map((s) => (
            <span key={s.label} className="text-xs px-2.5 py-1 rounded-full glass text-ink-mid">
              {s.label} · {s.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] font-head tracking-wide text-ink-low">{label.toUpperCase()}</div>
      <div className="font-head font-semibold text-ink-hi mt-0.5">{value}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-display text-xs tracking-[0.25em] text-purple-bright">{children.toUpperCase()}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-purple/40 to-transparent" />
    </div>
  )
}
