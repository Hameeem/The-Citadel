import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles, Loader2, Globe, ArrowRight, ExternalLink, Flame } from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import {
  searchUniversalMultiverse,
  autoImportSearchResult,
  type UniversalSearchResult,
} from '../lib/apiServices'
import { getPinterestSearchUrl } from '../lib/imageLibrary'
import Emblem from './Emblem'
import type { Universe } from '../types/character'
import { sound } from '../lib/soundFx'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
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
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const { characters } = useAllCharacters()
  const [query, setQuery] = useState('')
  const [activeUniverse, setActiveUniverse] = useState<Universe | 'All'>('All')
  const [liveResults, setLiveResults] = useState<UniversalSearchResult[]>([])
  const [isSearchingLive, setIsSearchingLive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      sound.playClick()
    } else {
      setQuery('')
      setLiveResults([])
    }
  }, [isOpen])

  // Debounced search for live universal multiverse search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setLiveResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearchingLive(true)
      const results = await searchUniversalMultiverse(query, activeUniverse)
      setLiveResults(results)
      setIsSearchingLive(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [query, activeUniverse])

  // Filter local Citadel characters
  const citadelMatches = query.trim()
    ? characters.filter(
        (c) =>
          (activeUniverse === 'All' || c.universe === activeUniverse) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.series.toLowerCase().includes(query.toLowerCase()) ||
            c.universe.toLowerCase().includes(query.toLowerCase()))
      )
    : characters.filter((c) => activeUniverse === 'All' || c.universe === activeUniverse).slice(0, 6)

  const handleSelectLiveResult = (result: UniversalSearchResult) => {
    sound.playVictory()
    const converted = autoImportSearchResult(result)
    onClose()
    navigate(`/character/${converted.id}`)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-void/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple/30 z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-bright" />
              <span className="font-display text-sm tracking-wider text-gradient font-bold">
                MULTIVERSE LIVE OMNI-SEARCH & DOSSIER ENGINE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-ink-low hidden sm:inline bg-white/5 px-2 py-0.5 rounded">
                ESC to close
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg glass hover:text-crimson-bright transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-mid" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type ANY hero (Shanks, Minato, Beyonder, Gojo, Kratos, Thor)…"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass bg-void/60 text-ink-hi placeholder:text-ink-low text-base focus:outline-none focus:glow-ring font-body"
            />
          </div>

          {/* Universe Sector Filter Tabs */}
          <div className="flex gap-2 mt-3 text-xs font-head overflow-x-auto pb-1">
            {UNIVERSE_TABS.map((u) => (
              <button
                key={u}
                onClick={() => {
                  sound.playClick()
                  setActiveUniverse(u)
                }}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  activeUniverse === u
                    ? 'bg-gradient-to-r from-purple to-blue text-void font-bold shadow-glow'
                    : 'glass text-ink-mid hover:text-ink-hi'
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="mt-4 max-h-96 overflow-y-auto space-y-4 pr-1">
            {/* 1. Citadel Archive Matches */}
            <div>
              <div className="text-[10px] font-head tracking-[0.2em] text-ink-low mb-2 flex items-center justify-between">
                <span>CITADEL ARCHIVE ({citadelMatches.length} INDEXED RECORDS)</span>
              </div>
              <div className="space-y-2">
                {citadelMatches.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      sound.playClick()
                      onClose()
                      navigate(`/character/${c.id}`)
                    }}
                    className="flex items-center justify-between p-3 rounded-xl glass hover:bg-purple/20 hover:border-purple/40 border border-transparent cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Emblem character={c} size={44} />
                      <div>
                        <div className="font-head text-sm font-bold text-ink-hi group-hover:text-purple-bright transition-colors flex items-center gap-2">
                          <span>{c.name}</span>
                          {c.isUnrevealedApex && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5 text-amber-400" /> APEX
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-low">
                          {c.universe} · {c.series}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[10px] px-2 py-0.5 rounded tier-badge-S text-void font-bold">
                        {c.tier || 'S'}-TIER
                      </span>
                      <ArrowRight className="w-4 h-4 text-ink-low group-hover:text-purple-bright group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Live Multiverse Real-Time API Search Results */}
            {query.trim().length >= 2 && (
              <div>
                <div className="text-[10px] font-head tracking-[0.2em] text-blue-bright mb-2 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> LIVE REPOSITORY SEARCH (AUTOMATIC AUTO-OPEN)
                  </span>
                  {isSearchingLive && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue" />}
                </div>

                {isSearchingLive && liveResults.length === 0 ? (
                  <div className="text-center py-6 text-xs text-ink-mid font-mono flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue" />
                    Querying live repositories for "{query}"…
                  </div>
                ) : liveResults.length === 0 && !isSearchingLive ? (
                  <div className="text-center py-4 text-xs text-ink-low">
                    No live results found. Try alternate character names or aliases.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {liveResults.map((r) => {
                      const pUrl = getPinterestSearchUrl(r.name, r.universe)
                      return (
                        <div
                          key={r.id}
                          onClick={() => handleSelectLiveResult(r)}
                          className="flex items-center justify-between p-3 rounded-xl glass hover:border-blue/50 border border-white/5 transition-all group gap-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl overflow-hidden glass shrink-0 border border-blue/30">
                              {r.imageUrl ? (
                                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-blue-bright">
                                  ★
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-head text-sm font-bold text-ink-hi group-hover:text-blue-bright truncate flex items-center gap-2">
                                <span>{r.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded glass text-purple-bright">
                                  {r.universe}
                                </span>
                                {r.isUnrevealedApex && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5 text-amber-400" /> APEX
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-ink-low truncate">
                                {r.series} · Source: {r.source}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={pUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg glass text-red-400 hover:bg-red-500/20 text-[10px] font-head font-bold flex items-center gap-1"
                              title="Search Pinterest Photos"
                            >
                              <span>Pins</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <span className="px-3 py-1 rounded-xl bg-purple text-void font-head font-bold text-xs flex items-center gap-1">
                              OPEN <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
