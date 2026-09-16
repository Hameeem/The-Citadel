import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles, Flame, Check } from 'lucide-react'
import Emblem from './Emblem'
import type { Character, Universe, PowerTier } from '../types/character'
import { sound } from '../lib/soundFx'

interface ArenaSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (id: string) => void
  characters: Character[]
  selectedId: string
  excludeId: string
  sideTitle: string
}

const UNIVERSE_TABS: Array<Universe | 'All'> = [
  'All',
  'Anime',
  'Marvel',
  'DC',
  'Games',
  'Movies',
  'Mythology',
  'Cartoons',
  'Comics',
]

const TIER_TABS: Array<PowerTier | 'All'> = ['All', 'SSS', 'SS', 'S', 'A', 'B']

export default function ArenaSelectorModal({
  isOpen,
  onClose,
  onSelect,
  characters,
  selectedId,
  excludeId,
  sideTitle,
}: ArenaSelectorModalProps) {
  const [query, setQuery] = useState('')
  const [activeUniverse, setActiveUniverse] = useState<Universe | 'All'>('All')
  const [activeTier, setActiveTier] = useState<PowerTier | 'All'>('All')

  if (!isOpen) return null

  const filtered = characters
    .filter((c) => c.id !== excludeId)
    .filter((c) => activeUniverse === 'All' || c.universe === activeUniverse)
    .filter((c) => activeTier === 'All' || (c.tier || 'S') === activeTier)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.series.toLowerCase().includes(query.toLowerCase()) ||
        (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(query.toLowerCase())))
    )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-void/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl glass-card rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple/30 z-10 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div>
              <span className="text-[10px] font-head font-bold tracking-[0.2em] text-purple-bright uppercase">
                SELECT CHAMPION FOR {sideTitle}
              </span>
              <h2 className="font-display text-xl font-bold text-ink-hi mt-0.5">
                Multiverse Champion Registry ({filtered.length} Available)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass hover:text-crimson-bright transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 mt-4 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mid" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by hero name, universe, series, or alias…"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass bg-void/60 text-ink-hi text-sm placeholder:text-ink-low focus:outline-none focus:glow-ring"
              />
            </div>

            {/* Universe Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-head">
              {UNIVERSE_TABS.map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    sound.playClick()
                    setActiveUniverse(u)
                  }}
                  className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                    activeUniverse === u
                      ? 'bg-gradient-to-r from-purple to-blue text-void font-bold shadow-glow'
                      : 'glass text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Power Tier Tabs */}
            <div className="flex gap-1.5 overflow-x-auto text-xs font-display">
              {TIER_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sound.playClick()
                    setActiveTier(t)
                  }}
                  className={`px-2.5 py-0.5 rounded-lg transition-all shrink-0 ${
                    activeTier === t
                      ? 'bg-purple-bright text-void font-extrabold shadow-glow'
                      : 'glass text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  {t === 'All' ? 'ALL TIERS' : `${t}-TIER`}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Champions */}
          <div className="mt-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-1 py-1 flex-1">
            {filtered.map((c) => {
              const isSelected = c.id === selectedId
              const tier = c.tier || 'S'

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    sound.playVictory()
                    onSelect(c.id)
                    onClose()
                  }}
                  className={`p-3 rounded-2xl glass border transition-all cursor-pointer flex items-center justify-between group gap-3 ${
                    isSelected
                      ? 'border-purple-bright bg-purple/20 shadow-glow'
                      : 'border-white/5 hover:border-purple/50 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Emblem character={c} size={46} />
                    <div className="min-w-0">
                      <div className="font-head text-sm font-bold text-ink-hi group-hover:text-purple-bright transition-colors truncate flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.isUnrevealedApex && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Flame className="w-2.5 h-2.5 text-amber-400 inline" /> APEX
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-ink-low truncate">
                        {c.universe} · {c.series}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-display font-extrabold px-2 py-0.5 rounded text-void tier-badge-${tier}`}>
                      {tier}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-bright text-void flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
