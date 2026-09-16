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
  Search,
} from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import type { Character } from '../types/character'
import { analyzeBattle, simulateFight, type BattleAnalysis } from '../lib/battleAnalysis'
import Emblem from '../components/Emblem'
import FeaturedBattle from '../components/FeaturedBattle'
import ArenaSelectorModal from '../components/ArenaSelectorModal'
import { sound } from '../lib/soundFx'

const QUICK_MATCHUPS: [string, string][] = [
  ['shanks', 'roronoa-zoro'],
  ['son-goku', 'superman'],
  ['minato', 'killua-zoldyck'],
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

  const defaultA = searchParams.get('a') || 'shanks'
  const defaultB = searchParams.get('b') || 'roronoa-zoro'

  const [aId, setAId] = useState<string>(characters.find((c) => c.id === defaultA)?.id || characters[0]?.id || '')
  const [bId, setBId] = useState<string>(characters.find((c) => c.id === defaultB)?.id || characters[1]?.id || '')
  const [selectedStage, setSelectedStage] = useState(ARENA_STAGES[0])

  // Fighter selection modals
  const [activeModalSide, setActiveModalSide] = useState<'ALPHA' | 'BETA' | null>(null)

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
          FEATURED CANON MATCHUPS
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
          onOpenModal={() => setActiveModalSide('ALPHA')}
          onSelect={(id) => pick('a', id)}
          characters={characters}
          hp={hpA}
          color={a.emblemColor}
        />
        <FighterSlot
          side="BETA"
          selected={b}
          exclude={a.id}
          onOpenModal={() => setActiveModalSide('BETA')}
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

      {/* Hero Selector Modal */}
      <ArenaSelectorModal
        isOpen={activeModalSide !== null}
        onClose={() => setActiveModalSide(null)}
        sideTitle={activeModalSide === 'ALPHA' ? 'FIGHTER ALPHA' : 'FIGHTER BETA'}
        selectedId={activeModalSide === 'ALPHA' ? a.id : b.id}
        excludeId={activeModalSide === 'ALPHA' ? b.id : a.id}
        characters={characters}
        onSelect={(id) => {
          if (activeModalSide === 'ALPHA') pick('a', id)
          else pick('b', id)
        }}
      />
    </div>
  )
}

function FighterSlot({
  side,
  selected,
  exclude,
  onOpenModal,
  onSelect,
  characters,
  hp,
  color,
}: {
  side: string
  selected: Character
  exclude: string
  onOpenModal: () => void
  onSelect: (id: string) => void
  characters: Character[]
  hp: number
  color: string
}) {
  const tier = selected.tier || 'S'
  return (
    <div
      className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden border border-white/10 group"
      style={{ boxShadow: `0 0 35px ${color}22` }}
    >
      <div className="text-[10px] font-head font-bold tracking-[0.2em] text-ink-low mb-4 uppercase">
        FIGHTER {side} · {tier}-TIER
      </div>

      <div onClick={onOpenModal} className="cursor-pointer transition-transform group-hover:scale-105">
        <Emblem character={selected} size={110} />
      </div>

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

      {/* Open Full Multiverse Registry Modal Button */}
      <button
        onClick={onOpenModal}
        className="mt-4 w-full py-2.5 px-4 rounded-xl glass border border-purple/40 hover:border-purple text-ink-hi font-head font-bold text-xs flex items-center justify-center gap-2 hover:glow-ring transition-all"
      >
        <Search className="w-3.5 h-3.5 text-purple-bright" /> Select From All 50+ {selected.universe} Heroes
      </button>

      {/* Selector Quick Dropdown */}
      <select
        value={selected.id}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-2 w-full px-3 py-2 rounded-xl glass text-xs font-head font-bold text-ink-hi focus:outline-none focus:glow-ring bg-panel cursor-pointer opacity-80"
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id} disabled={c.id === exclude} className="bg-void text-ink-hi">
            {c.name} ({c.universe} · {c.tier || 'S'}-TIER)
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
  analysis: BattleAnalysis
  narrative: Array<{ title: string; text: string }>
  onReset: () => void
}) {
  const winner = analysis.winProbabilityA >= 50 ? a : b
  const winPct = analysis.winProbabilityA >= 50 ? analysis.winProbabilityA : 100 - analysis.winProbabilityA

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-8 border border-purple/40 space-y-8"
    >
      {/* Winner Spotlight Banner */}
      <div className="text-center relative py-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple/20 border border-amber-400/40 text-amber-300 text-xs font-head font-bold tracking-widest mb-4">
          <Trophy className="w-4 h-4 text-amber-400" /> CANONICAL COMBAT VERDICT
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-black text-gradient">
          VICTOR: {winner.name.toUpperCase()}
        </h2>
        <p className="font-head text-lg text-purple-bright font-semibold mt-2">
          Calculated Win Probability: {winPct}% · Classification: {analysis.difficulty}
        </p>

        {/* Win percentage bar */}
        <div className="max-w-md mx-auto mt-5">
          <div className="flex justify-between text-xs font-mono mb-1 font-bold">
            <span style={{ color: a.emblemColor }}>{a.name}: {analysis.winProbabilityA}%</span>
            <span style={{ color: b.emblemColor }}>{b.name}: {100 - analysis.winProbabilityA}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex bg-white/5 p-0.5">
            <div className="h-full rounded-l-full transition-all" style={{ width: `${analysis.winProbabilityA}%`, background: a.emblemColor }} />
            <div className="h-full rounded-r-full transition-all" style={{ width: `${100 - analysis.winProbabilityA}%`, background: b.emblemColor }} />
          </div>
        </div>
      </div>

      {/* Decisive Analysis Factors */}
      <div>
        <h3 className="font-head text-base font-bold text-ink-hi flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-purple-bright" /> Decisive Battle Factors & Key Stat Disparities
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {analysis.keyFactors.map((factor, i) => (
            <div key={i} className="glass rounded-2xl p-4 border border-white/5">
              <div className="text-xs font-head font-bold text-ink-hi mb-1 flex items-center justify-between">
                <span>{factor.label} Advantage</span>
                <span className="text-purple-bright uppercase text-[10px] font-mono">
                  {factor.winner === 'a' ? a.name : factor.winner === 'b' ? b.name : 'EVEN'} (+{factor.gap})
                </span>
              </div>
              <p className="text-xs text-ink-mid leading-relaxed">{factor.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual-Canon Source Comparison (Manga/Comic vs Anime/Movie) */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="font-head text-base font-bold text-ink-hi flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-bright" /> Dual-Canon Source Verdict Breakdown
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="glass rounded-xl p-4 border border-purple/30">
            <div className="font-head font-bold text-purple-bright flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5" /> {analysis.mangaComicVerdict.title}
            </div>
            <p className="text-ink-mid leading-relaxed">{analysis.mangaComicVerdict.summary}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-blue/30">
            <div className="font-head font-bold text-blue-bright flex items-center gap-1.5 mb-1">
              <Film className="w-3.5 h-3.5" /> {analysis.mediaAdaptationVerdict.title}
            </div>
            <p className="text-ink-mid leading-relaxed">{analysis.mediaAdaptationVerdict.summary}</p>
          </div>
        </div>
      </div>

      {/* Detailed Fight Log Breakdown */}
      <div>
        <h3 className="font-head text-base font-bold text-ink-hi flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-crimson-bright" /> Full 5-Beat Combat Log
        </h3>
        <div className="space-y-3">
          {narrative.map((beat, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-white/5">
              <div className="text-xs font-head font-bold text-purple-bright">
                BEAT {i + 1}: {beat.title}
              </div>
              <p className="text-xs text-ink-mid mt-1 leading-relaxed">{beat.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reset CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3.5 rounded-full glass border border-purple/50 font-head font-bold text-sm text-ink-hi hover:glow-ring inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> RESET & CONFIGURE NEW CLASH
        </button>
      </div>
    </motion.div>
  )
}
