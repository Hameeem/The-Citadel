import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Sparkles, Filter, Grid, List, Plus, Vote, Trophy, ArrowRight, Loader2 } from 'lucide-react'
import { useAllCharacters, getMatchupVotes, voteMatchup } from '../lib/citadelStore'
import CharacterCard from '../components/CharacterCard'
import Emblem from '../components/Emblem'
import { searchMyAnimeList, convertMalToCitadelCharacter, type MalCharacterResult } from '../lib/apiServices'
import type { Universe, PowerTier } from '../types/character'
import { sound } from '../lib/soundFx'

const UNIVERSE_FILTERS: Array<Universe | 'All'> = [
  'All',
  'Anime',
  'Marvel',
  'DC',
  'Games',
  'Cartoons',
  'Movies',
  'Mythology',
  'Comics',
]

const TIER_FILTERS: Array<PowerTier | 'All'> = ['All', 'SSS', 'SS', 'S', 'A', 'B']

const MATCHUPS: [string, string][] = [
  ['son-goku', 'superman'],
  ['monkey-d-luffy', 'naruto-uzumaki'],
  ['gojo-satoru', 'scarlet-witch'],
  ['kratos', 'thor-odinson'],
]

export default function Characters() {
  const [searchParams] = useSearchParams()
  const initialUniverse = (searchParams.get('universe') as Universe) || 'All'
  const { characters, addCharacter } = useAllCharacters()

  const [universeFilter, setUniverseFilter] = useState<Universe | 'All'>(initialUniverse)
  const [tierFilter, setTierFilter] = useState<PowerTier | 'All'>('All')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [malResults, setMalResults] = useState<MalCharacterResult[]>([])
  const [isSearchingMal, setIsSearchingMal] = useState(false)
  const [votes, setVotes] = useState(getMatchupVotes())

  // Filter local database
  const filteredList = useMemo(() => {
    return characters
      .filter((c) => universeFilter === 'All' || c.universe === universeFilter)
      .filter((c) => tierFilter === 'All' || (c.tier || 'S') === tierFilter)
      .filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.series.toLowerCase().includes(query.toLowerCase()) ||
          (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(query.toLowerCase())))
      )
  }, [characters, universeFilter, tierFilter, query])

  const ranked = useMemo(() => [...characters].sort((a, b) => b.popularity - a.popularity), [characters])

  const handleSearchMal = async () => {
    if (!query.trim()) return
    setIsSearchingMal(true)
    const results = await searchMyAnimeList(query)
    setMalResults(results)
    setIsSearchingMal(false)
  }

  const handleImport = (malChar: MalCharacterResult) => {
    sound.playVictory()
    const converted = convertMalToCitadelCharacter(malChar)
    addCharacter(converted)
    setMalResults(malResults.filter((m) => m.mal_id !== malChar.mal_id))
  }

  const handleVote = (matchupKey: string, side: 'a' | 'b') => {
    sound.playClick()
    const updated = voteMatchup(matchupKey, side)
    setVotes({ ...votes, [matchupKey]: updated })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-head tracking-[0.25em] text-purple-bright uppercase font-bold">
            THE GRAND MULTIVERSE ARCHIVE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gradient mt-1">THE DATABASE</h1>
          <p className="text-ink-mid text-sm mt-1">
            Browse {characters.length} legendary fighters with evidence-backed stats, Power Signatures, and verified lore.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 glass rounded-2xl p-1 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs font-head font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid' ? 'bg-purple text-void' : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl text-xs font-head font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-purple text-void' : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* MAIN LIST & FILTERS */}
        <div>
          {/* Search bar & Universe pills */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-mid" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search archive by hero name, series, alias, or anime…"
                className="w-full pl-12 pr-4 py-3 rounded-2xl glass text-sm placeholder:text-ink-low text-ink-hi focus:outline-none focus:glow-ring"
              />
              {query && (
                <button
                  onClick={handleSearchMal}
                  disabled={isSearchingMal}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-blue/20 hover:bg-blue/30 border border-blue/40 text-blue-bright text-xs font-head font-bold transition-all flex items-center gap-1.5"
                >
                  {isSearchingMal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Search MAL
                </button>
              )}
            </div>

            {/* Universe Filter Tabs */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-head tracking-wider text-ink-low uppercase mr-1">Sector:</span>
              {UNIVERSE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    sound.playClick()
                    setUniverseFilter(f)
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-head tracking-wide transition-all ${
                    universeFilter === f
                      ? 'bg-gradient-to-r from-purple to-blue text-void font-bold shadow-glow'
                      : 'glass text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Power Tier Filter Tabs */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-head tracking-wider text-ink-low uppercase mr-1">Tier:</span>
              {TIER_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sound.playClick()
                    setTierFilter(t)
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-display transition-all ${
                    tierFilter === t
                      ? 'bg-purple-bright text-void font-extrabold shadow-glow'
                      : 'glass text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  {t === 'All' ? 'ALL TIERS' : `${t}-TIER`}
                </button>
              ))}
            </div>
          </div>

          {/* Character Grid / List */}
          {filteredList.length === 0 ? (
            <div className="text-center py-16 glass rounded-3xl p-8 border border-white/10">
              <p className="text-ink-hi font-head text-lg font-bold">No heroes match your active filter.</p>
              <p className="text-sm text-ink-mid mt-1">
                Would you like to search MyAnimeList or the Multiverse live for "{query || 'this hero'}"?
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleSearchMal}
                  disabled={isSearchingMal || !query}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue to-purple font-head font-bold text-sm text-void hover:scale-105 transition-transform flex items-center gap-2 shadow-glow-blue"
                >
                  {isSearchingMal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Search MyAnimeList for "{query}"
                </button>
                <Link
                  to={`/research?q=${encodeURIComponent(query)}`}
                  className="px-6 py-2.5 rounded-full glass border border-purple/40 font-head font-bold text-sm text-ink-hi hover:glow-ring"
                >
                  AI Multiverse Research →
                </Link>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredList.map((c, i) => (
                <CharacterCard key={c.id} character={c} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/5">
              {filteredList.map((c) => {
                const tier = c.tier || 'S'
                return (
                  <Link
                    key={c.id}
                    to={`/character/${c.id}`}
                    onClick={() => sound.playClick()}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <Emblem character={c} size={48} />
                      <div className="min-w-0">
                        <div className="font-head text-base font-bold text-ink-hi group-hover:text-purple-bright transition-colors truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-ink-low truncate">
                          {c.universe} · {c.series}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`font-display text-[10px] px-2 py-0.5 rounded tier-badge-${tier} text-void font-bold`}>
                        {tier}-TIER
                      </span>
                      <span className="font-mono text-xs text-purple-bright font-bold">★ {c.popularity}</span>
                      <ArrowRight className="w-4 h-4 text-ink-low group-hover:text-purple-bright group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Live MAL Search Results Drawer if triggered */}
          {malResults.length > 0 && (
            <div className="mt-12 glass-card rounded-3xl p-6 border border-blue/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-ink-hi flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-bright" /> MyAnimeList Live Imports
                </h3>
                <span className="text-xs font-mono text-ink-low">{malResults.length} heroes found</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {malResults.map((m) => {
                  const img = m.images.webp?.large_image_url || m.images.jpg?.image_url
                  return (
                    <div
                      key={m.mal_id}
                      className="flex items-center justify-between p-3 rounded-2xl glass border border-white/5 hover:border-blue/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl overflow-hidden glass shrink-0">
                          {img ? <img src={img} alt={m.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-head text-sm font-bold text-ink-hi truncate">{m.name}</div>
                          <div className="text-[11px] text-ink-low truncate">
                            {m.anime?.[0]?.anime?.title || 'Anime'} · ★ {m.favorites.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleImport(m)}
                        className="px-3 py-1.5 rounded-xl bg-blue text-void font-head font-bold text-xs hover:scale-105 transition-transform shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Import
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Top Rankings Widget */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-head text-sm font-bold tracking-wider text-ink-hi flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-purple-bright" /> GLOBAL RANKINGS
              </h3>
              <Link to="/rankings" className="text-[10px] font-head text-purple-bright hover:underline">
                VIEW ALL →
              </Link>
            </div>
            <div className="space-y-3">
              {ranked.slice(0, 5).map((c, i) => (
                <Link
                  key={c.id}
                  to={`/character/${c.id}`}
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-3 group p-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <span className="font-display text-sm w-4 text-ink-low font-bold">{i + 1}</span>
                  <Emblem character={c} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-head font-bold text-ink-hi truncate group-hover:text-purple-bright transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-ink-low truncate">{c.series}</div>
                  </div>
                  <span className="text-[11px] font-mono text-purple-bright font-bold">★ {c.popularity}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Interactive Matchup Prediction Polls */}
          <div className="glass rounded-3xl p-5 border border-white/10">
            <h3 className="font-head text-sm font-bold tracking-wider text-ink-hi flex items-center gap-1.5 mb-1">
              <Vote className="w-4 h-4 text-blue-bright" /> COMMUNITY CLASH POLLS
            </h3>
            <p className="text-[11px] text-ink-low mb-4">Vote on multiverse dream clashes</p>

            <div className="space-y-4">
              {MATCHUPS.map(([aId, bId]) => {
                const a = characters.find((c) => c.id === aId)
                const b = characters.find((c) => c.id === bId)
                if (!a || !b) return null
                const key = `${aId}_vs_${bId}`
                const voteData = votes[key] || { a: 120, b: 95 }
                const total = voteData.a + voteData.b
                const aPct = Math.round((voteData.a / total) * 100)
                const bPct = 100 - aPct

                return (
                  <div key={key} className="glass rounded-2xl p-3 border border-white/5">
                    <div className="flex items-center justify-between text-xs font-head font-bold mb-2">
                      <button
                        onClick={() => handleVote(key, 'a')}
                        className={`hover:text-purple-bright transition-colors ${
                          voteData.userVoted === 'a' ? 'text-purple-bright underline font-extrabold' : 'text-ink-hi'
                        }`}
                      >
                        {a.name.split(' ')[0]} ({aPct}%)
                      </button>
                      <span className="text-ink-low font-mono text-[10px]">VS</span>
                      <button
                        onClick={() => handleVote(key, 'b')}
                        className={`hover:text-blue-bright transition-colors ${
                          voteData.userVoted === 'b' ? 'text-blue-bright underline font-extrabold' : 'text-ink-hi'
                        }`}
                      >
                        {b.name.split(' ')[0]} ({bPct}%)
                      </button>
                    </div>

                    <div className="h-2 rounded-full overflow-hidden flex bg-white/5">
                      <div className="bg-purple h-full transition-all duration-300" style={{ width: `${aPct}%` }} />
                      <div className="bg-blue h-full transition-all duration-300" style={{ width: `${bPct}%` }} />
                    </div>

                    <div className="mt-2 text-right">
                      <Link
                        to={`/arena?a=${aId}&b=${bId}`}
                        className="text-[10px] font-head text-purple-bright hover:underline"
                      >
                        Test In Arena →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
