import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Swords,
  Play,
  RotateCcw,
  Zap,
  Shield,
  Sparkles,
  Trophy,
  Flame,
  Activity,
  MapPin,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Film,
} from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import type { Character } from '../types/character'
import { analyzeBattle, simulateFight } from '../lib/battleAnalysis'
import Emblem from '../components/Emblem'
import FeaturedBattle from '../components/FeaturedBattle'
import { sound } from '../lib/soundFx'

const QUICK_MATCHUPS: [string, string][] = [
  ['monkey-d-luffy', 'roronoa-zoro'],
  ['the-one-above-all', 'iron-man'],
  ['killua-zoldyck', 'roronoa-zoro'],
]

const ARENA_STAGES = [
  { id: 'multiverse-nexus', name: 'Dimensional Nexus', desc: 'Floating cosmic arena at the boundary of all realities.', color: '#8B5CF6' },
  { id: 'wano-rooftop', name: 'Onigashima Skull Dome', desc: 'Stormy skies with lightning and volcanic embers.', color: '#EF4444' },
  { id: 'new-york-ruins', name: 'Ruins of New York', desc: 'Urban battleground with skyscrapers and debris.', color: '#3B82F6' },
  { id: 'throne-of-gods', name: 'Olympus Divine Peak', desc: 'Golden marble pillars bathed in divine thunder.', color: '#F59E0B' },
]

export default function Arena() {
  const [searchParams] = useSearchParams()
  const { characters } = useAllCharacters()

  const defaultA = searchParams.get('a') || 'killua-zoldyck'
  const defaultB = searchParams.get('b') || 'roronoa-zoro'

  const [aId, setAId] = useState<string>(characters.find((c) => c.id === defaultA)?.id || characters[0]?.id || '')
  const [bId, setBId] = useState<string>(characters.find((c) => c.id === defaultB)?.id || characters[1]?.id || '')
  const [selectedStage, setSelectedStage] = useState(ARENA_STAGES[0])

  // Battle simulator phases
  const [phase, setPhase] = useState<'select' | 'battling' | 'result'>('select')
  const [currentStep, setCurrentStep] = useState(0)
  const [hpA, setHpA] = useState(100)
  const [hpB, setHpB] = useState(100)

  const a = characters.find((c) => c.id === aId) || characters[0]
  const b = characters.find((c) => c.id === bId) || characters[1]

  const analysis = a && b ? analyzeBattle(a, b) : null
  const narrative = a && b && analysis ? simulateFight(a, b, analysis) : []

  const handleStartBattle = () => {
    sound.playClash()
    setPhase('battling')
    setCurrentStep(0)
    setHpA(100)
    setHpB(100)

    let step = 0
    const interval = setInterval(() => {
      step += 1
      setCurrentStep(step)
      sound.playScan()

      // Dynamically simulate damage based on power scaling
      if (analysis) {
        const damageA = analysis.winProbabilityA > 50 ? Math.floor(Math.random() * 12) + 4 : Math.floor(Math.random() * 22) + 14
        const damageB = analysis.winProbabilityA > 50 ? Math.floor(Math.random() * 24) + 15 : Math.floor(Math.random() * 12) + 4
        setHpA((prev) => Math.max(analysis.winProbabilityA > 50 ? 35 : 0, prev - damageA))
        setHpB((prev) => Math.max(analysis.winProbabilityA <= 50 ? 35 : 0, prev - damageB))
      }

      if (step >= narrative.length - 1) {
        clearInterval(interval)
        setTimeout(() => {
          setPhase('result')
          sound.playVictory()
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [a.emblemColor, b.emblemColor, '#8B5CF6', '#3B82F6', '#F59E0B'],
          })
        }, 800)
      }
    }, 900)
  }

  const pick = (side: 'a' | 'b', id: string) => {
    sound.playClick()
    if (side === 'a') setAId(id)
    else setBId(id)
    setPhase('select')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-head font-bold tracking-[0.25em] text-purple-bright uppercase">
          TACTICAL BATTLE ENGINE & DUAL-CANON ANALYZER
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient mt-1">THE ARENA</h1>
        <p className="text-ink-mid text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Simulate multiverse combat evaluated across both **Original Manga / Comic Lore** and **Anime / Movie Adaptations**.
        </p>
      </div>

      {/* QUICK MATCHUPS */}
      <div className="mb-10">
        <div className="text-[10px] font-head tracking-[0.25em] text-ink-low mb-3 text-center uppercase font-bold">
          QUICK MATCHUPS
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {QUICK_MATCHUPS.map(([x, y]) => {
            const cx = characters.find((c) => c.id === x)
            const cy = characters.find((c) => c.id === y)
            if (!cx || !cy) return null
            return <FeaturedBattle key={x + y} a={cx} b={cy} />
          })}
        </div>
      </div>

      {/* STAGE SELECTION */}
      <div className="mb-10 glass rounded-3xl p-5 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-head font-bold text-purple-bright uppercase mb-3">
          <MapPin className="w-4 h-4" /> BATTLE ARENA REALM: <span className="text-ink-hi">{selectedStage.name}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ARENA_STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                sound.playClick()
                setSelectedStage(stage)
              }}
              className={`p-3 rounded-2xl text-left transition-all border ${
                selectedStage.id === stage.id
                  ? 'glass border-purple/60 bg-purple/10 shadow-glow'
                  : 'glass border-white/5 hover:border-white/20'
              }`}
            >
              <div className="font-head text-xs font-bold text-ink-hi" style={{ color: stage.color }}>
                {stage.name}
              </div>
              <p className="text-[10px] text-ink-low mt-1 line-clamp-2">{stage.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* FIGHTER SELECTION HUD */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch mb-10">
        <FighterSlot
          side="ALPHA"
          selected={a}
          exclude={b.id}
          onSelect={(id) => pick('a', id)}
          characters={characters}
          hp={hpA}
          color={a.emblemColor}
        />
        <FighterSlot
          side="BETA"
          selected={b}
          exclude={a.id}
          onSelect={(id) => pick('b', id)}
          characters={characters}
          hp={hpB}
          color={b.emblemColor}
        />
      </div>

      {/* ACTION CTA: INITIATE COMBAT */}
      {phase === 'select' && (
        <div className="text-center mb-12">
          <button
            onClick={handleStartBattle}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-purple via-blue to-crimson font-head font-bold text-base tracking-widest text-void shadow-glow hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" /> SIMULATE CANONICAL COMBAT
          </button>
        </div>
      )}

      {/* TURN-BY-TURN COMBAT VISUALIZER */}
      {phase === 'battling' && (
        <div className="glass-card rounded-3xl p-8 border border-purple/50 text-center mb-12 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-xs font-head font-bold tracking-widest text-purple-bright mb-3 uppercase">
            <Activity className="w-4 h-4 animate-pulse" /> COMBAT IN PROGRESS — BEAT {currentStep + 1} OF{' '}
            {narrative.length}
          </div>
          <h2 className="font-head text-2xl font-bold text-ink-hi mb-3">
            {narrative[currentStep]?.title || 'Clashing…'}
          </h2>
          <p className="text-base text-ink-mid max-w-2xl mx-auto leading-relaxed">
            {narrative[currentStep]?.text}
          </p>

          <div className="flex justify-center gap-2 mt-6">
            {narrative.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-8 bg-purple shadow-glow' : i < currentStep ? 'w-3 bg-white/40' : 'w-3 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE VERDICT & DUAL-CANON ANALYSIS */}
      {phase === 'result' && analysis && (
        <VerdictPanel
          a={a}
          b={b}
          analysis={analysis}
          narrative={narrative}
          onReset={() => {
            sound.playClick()
            setPhase('select')
            setHpA(100)
            setHpB(100)
          }}
        />
      )}
    </div>
  )
}

function FighterSlot({
  side,
  selected,
  exclude,
  onSelect,
  characters,
  hp,
  color,
}: {
  side: string
  selected: Character
  exclude: string
  onSelect: (id: string) => void
  characters: Character[]
  hp: number
  color: string
}) {
  const tier = selected.tier || 'S'
  return (
    <div
      className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden border border-white/10"
      style={{ boxShadow: `0 0 35px ${color}22` }}
    >
      <div className="text-[10px] font-head font-bold tracking-[0.2em] text-ink-low mb-4 uppercase">
        FIGHTER {side} · {tier}-TIER
      </div>

      <Emblem character={selected} size={110} />

      <h3 className="font-head text-xl font-bold text-ink-hi mt-3 line-clamp-1">{selected.name}</h3>
      <p className="text-xs text-ink-mid">
        {selected.universe} · {selected.series}
      </p>

      {/* HP Gauge Meter */}
      <div className="w-full mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between text-[10px] font-mono text-ink-low mb-1 font-bold">
          <span>HEALTH INTEGRITY</span>
          <span style={{ color }}>{hp}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden p-0.5">
          <motion.div
            animate={{ width: `${hp}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
      </div>

      {/* Selector Dropdown */}
      <select
        value={selected.id}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-4 w-full px-3 py-2 rounded-xl glass text-xs font-head font-bold text-ink-hi focus:outline-none focus:glow-ring bg-panel cursor-pointer"
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id} disabled={c.id === exclude} className="bg-panel">
            {c.name} ({c.universe})
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
  onReset,
}: {
  a: Character
  b: Character
  analysis: ReturnType<typeof analyzeBattle>
  narrative: ReturnType<typeof simulateFight>
  onReset: () => void
}) {
  const bProb = 100 - analysis.winProbabilityA
  const favoredChar = analysis.favored === 'a' ? a : analysis.favored === 'b' ? b : null

  return (
    <div className="space-y-8">
      {/* VERDICT BANNER */}
      <div className="glass-card rounded-3xl p-8 border border-purple/40 text-center relative overflow-hidden">
        <div className="text-[10px] font-head font-bold tracking-[0.3em] text-ink-low uppercase mb-2">
          DECISIVE TACTICAL VERDICT
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-hi">
          {favoredChar ? (
            <>
              <span className="text-gradient">{favoredChar.name}</span> VICTORIOUS
            </>
          ) : (
            <span className="text-purple-bright">DEAD EVEN / STALEMATE</span>
          )}
        </h2>

        {/* Win rate probability bar */}
        <div className="max-w-xl mx-auto mt-6">
          <div className="flex justify-between text-xs font-mono mb-2 font-bold">
            <span className="text-purple-bright">
              {a.name}: {analysis.winProbabilityA}%
            </span>
            <span className="text-blue-bright">
              {b.name}: {bProb}%
            </span>
          </div>
          <div className="h-4 rounded-full overflow-hidden flex bg-white/5 p-0.5">
            <div
              className="bg-gradient-to-r from-purple-deep to-purple h-full rounded-l-full flex items-center justify-end pr-2 transition-all duration-700"
              style={{ width: `${analysis.winProbabilityA}%` }}
            >
              <span className="text-[10px] font-mono text-void font-bold">{analysis.winProbabilityA}%</span>
            </div>
            <div
              className="bg-gradient-to-l from-blue to-blue-bright h-full rounded-r-full flex items-center justify-start pl-2 transition-all duration-700"
              style={{ width: `${bProb}%` }}
            >
              <span className="text-[10px] font-mono text-void font-bold">{bProb}%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-6">
          <Badge label="Confidence Index" value={analysis.confidence} />
          <Badge label="Combat Difficulty" value={analysis.difficulty} />
        </div>
      </div>

      {/* DUAL-CANON EVALUATION BREAKDOWN */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Manga / Comic Source Canon Verdict */}
        <div className="glass-card rounded-3xl p-6 border border-purple/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-head font-bold text-purple-bright tracking-wider uppercase mb-3">
            <BookOpen className="w-4 h-4" /> 📖 ORIGINAL SOURCE CANON (MANGA & COMICS)
          </div>
          <h3 className="font-head text-lg font-bold text-ink-hi mb-2">
            {analysis.mangaComicVerdict.title}
          </h3>
          <p className="text-xs text-ink-mid leading-relaxed mb-4">
            {analysis.mangaComicVerdict.summary}
          </p>
          <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="font-bold text-purple-bright">{a.name} Peak Feat:</span> {analysis.mangaComicVerdict.sourceA}
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="font-bold text-blue-bright">{b.name} Peak Feat:</span> {analysis.mangaComicVerdict.sourceB}
            </div>
          </div>
        </div>

        {/* Media Adaptation / Anime / Movie Verdict */}
        <div className="glass-card rounded-3xl p-6 border border-blue/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-head font-bold text-blue-bright tracking-wider uppercase mb-3">
            <Film className="w-4 h-4" /> 🎬 MEDIA ADAPTATION (ANIME & MOVIES)
          </div>
          <h3 className="font-head text-lg font-bold text-ink-hi mb-2">
            {analysis.mediaAdaptationVerdict.title}
          </h3>
          <p className="text-xs text-ink-mid leading-relaxed mb-4">
            {analysis.mediaAdaptationVerdict.summary}
          </p>
          <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="font-bold text-purple-bright">{a.name} Screen Feat:</span> {analysis.mediaAdaptationVerdict.adaptationA}
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="font-bold text-blue-bright">{b.name} Screen Feat:</span> {analysis.mediaAdaptationVerdict.adaptationB}
            </div>
          </div>
        </div>
      </div>

      {/* DECISIVE FACTORS & REASONING */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="font-head font-bold text-lg text-ink-hi mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-bright" /> Key Deciding Factors
          </h3>
          <ul className="space-y-3">
            {analysis.keyFactors.map((f) => (
              <li key={f.key} className="text-sm text-ink-mid flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-bright shrink-0 mt-1.5" />
                <span>
                  <strong className="text-ink-hi">{f.label}:</strong> {f.note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="font-head font-bold text-lg text-ink-hi mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-bright" /> Alternative Underdog Scenario
          </h3>
          <p className="text-sm text-ink-mid leading-relaxed">
            {analysis.alternativeScenario
              ? analysis.alternativeScenario.note
              : 'Both combatants are tightly matched in core physical and tactical categories. A decisive first-strike could swing the entire outcome.'}
          </p>
        </div>
      </div>

      {/* FULL 5-BEAT FIGHT TIMELINE */}
      <div className="glass-card rounded-3xl p-8 border border-white/10">
        <h3 className="font-head font-bold text-xl text-ink-hi mb-6 flex items-center gap-2">
          <Swords className="w-5 h-5 text-purple-bright" /> Detailed 5-Beat Combat Log
        </h3>
        <div className="relative pl-6 space-y-6 border-l border-purple/40">
          {narrative.map((beat) => (
            <div key={beat.id} className="relative">
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-purple to-blue border-2 border-void" />
              <h4 className="font-head font-bold text-base text-ink-hi">{beat.title}</h4>
              <p className="text-sm text-ink-mid mt-1 leading-relaxed">{beat.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-full glass hover:border-purple/50 font-head font-bold text-xs tracking-wider text-ink-hi transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RUN ANOTHER MATCHUP
        </button>
      </div>
    </div>
  )
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-2 border border-white/5 text-center">
      <div className="text-[10px] font-head tracking-wider text-ink-low uppercase">{label}</div>
      <div className="font-head text-sm font-bold text-ink-hi mt-0.5">{value}</div>
    </div>
  )
}
