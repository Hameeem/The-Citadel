import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Sparkles, Plus, Swords, ExternalLink, Globe, Loader2, Zap, Image as ImageIcon } from 'lucide-react'
import {
  searchUniversalMultiverse,
  convertUniversalToCitadelCharacter,
  type UniversalSearchResult,
} from '../lib/apiServices'
import { getPinterestSearchUrl } from '../lib/imageLibrary'
import { useAllCharacters } from '../lib/citadelStore'
import type { Universe } from '../types/character'
import { sound } from '../lib/soundFx'

const UNIVERSE_SECTORS: Array<Universe | 'All'> = [
  'All',
  'Anime',
  'Marvel',
  'DC',
  'Games',
  'Movies',
  'Mythology',
  'Cartoons',
]

export default function Research() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const queryParam = params.get('q') ?? ''
  const [query, setQuery] = useState(queryParam)
  const [sector, setSector] = useState<Universe | 'All'>('All')
  const { addCharacter } = useAllCharacters()

  const [results, setResults] = useState<UniversalSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [importingId, setImportingId] = useState<string | null>(null)

  useEffect(() => {
    if (!queryParam) return
    setQuery(queryParam)
    performSearch(queryParam, sector)
  }, [queryParam, sector])

  const performSearch = async (searchTerm: string, currentSector: Universe | 'All') => {
    if (!searchTerm.trim()) return
    setLoading(true)
    try {
      const searchData = await searchUniversalMultiverse(searchTerm, currentSector)
      setResults(searchData)
    } catch (err) {
      console.error('Universal search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setParams({ q: query.trim() })
  }

  const handleImport = (r: UniversalSearchResult) => {
    sound.playVictory()
    setImportingId(r.id)
    const converted = convertUniversalToCitadelCharacter(r)
    addCharacter(converted)
    setTimeout(() => {
      navigate(`/character/${converted.id}`)
    }, 400)
  }

  const handleFightInArena = (r: UniversalSearchResult) => {
    sound.playClash()
    const converted = convertUniversalToCitadelCharacter(r)
    addCharacter(converted)
    navigate(`/arena?a=${converted.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-head font-bold tracking-[0.25em] text-purple-bright uppercase">
          UNIVERSAL MULTIVERSE SEARCH & PINTEREST ART FETCH
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient mt-1">
          MULTIVERSE CHARACTER EXPLORER
        </h1>
        <p className="text-ink-mid text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Search ANY hero or villain across Anime, Marvel, DC, Gaming, Movies, and Mythology. Fetch exact photos, explore Pinterest pins, and import with 1-click.
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-ink-mid pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any character (e.g. Kakashi, Thor, Kratos, Levi, Spider-Man, Sukuna)…"
            className="w-full pl-12 pr-28 py-4 rounded-2xl glass-card text-base placeholder:text-ink-low text-ink-hi focus:outline-none focus:glow-ring shadow-lg font-body"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple via-blue to-crimson text-void font-head font-bold text-xs hover:scale-105 transition-transform shadow-glow"
          >
            SEARCH
          </button>
        </div>
      </form>

      {/* Universe Sector Filter Tabs */}
      <div className="flex gap-2 justify-center flex-wrap mb-10">
        {UNIVERSE_SECTORS.map((sec) => (
          <button
            key={sec}
            onClick={() => {
              sound.playClick()
              setSector(sec)
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-head font-bold tracking-wide transition-all ${
              sector === sec
                ? 'bg-gradient-to-r from-purple to-blue text-void shadow-glow font-extrabold'
                : 'glass text-ink-mid hover:text-ink-hi border border-white/5'
            }`}
          >
            {sec.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search Results Display */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-bright" />
            <p className="font-head text-sm tracking-wider text-ink-hi font-bold">
              SEARCHING MULTIVERSE REPOSITORIES & OFFICIAL SOURCES…
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/10 max-w-xl mx-auto">
            <Sparkles className="w-8 h-8 text-purple-bright mx-auto mb-3" />
            <h3 className="font-head text-xl font-bold text-ink-hi">Search Any Character in the Multiverse</h3>
            <p className="text-sm text-ink-mid mt-2 leading-relaxed">
              Type any hero or villain name above. We'll search across MyAnimeList, AniList, Wikipedia, and Pinterest to fetch their exact photos, lore, and combat stats!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r) => {
              const pinterestLink = getPinterestSearchUrl(r.name, r.universe)
              return (
                <div
                  key={r.id}
                  className="glass-card rounded-3xl p-5 border border-white/10 hover:border-purple/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Character Photo Frame */}
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden glass mb-4 relative">
                      {r.imageUrl ? (
                        <img
                          src={r.imageUrl}
                          alt={r.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-purple-bright">
                          ★
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-void/80 backdrop-blur-md text-[10px] font-head font-bold text-purple-bright border border-white/10">
                        {r.universe}
                      </div>
                      <a
                        href={pinterestLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-head font-bold flex items-center gap-1 shadow-md transition-transform hover:scale-105"
                      >
                        <ImageIcon className="w-3 h-3" /> Pinterest Pins
                      </a>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-head text-xl font-bold text-ink-hi group-hover:text-purple-bright transition-colors truncate">
                        {r.name}
                      </h3>
                      {r.nativeName && (
                        <span className="text-xs font-semibold text-ink-low shrink-0">{r.nativeName}</span>
                      )}
                    </div>
                    <p className="text-xs text-ink-mid mt-0.5">{r.series}</p>

                    {r.description && (
                      <p className="text-xs text-ink-low mt-3 line-clamp-3 leading-relaxed">
                        {r.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => handleImport(r)}
                      disabled={importingId === r.id}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple via-blue to-crimson text-void font-head font-bold text-xs hover:scale-102 transition-transform shadow-glow flex items-center justify-center gap-1.5"
                    >
                      {importingId === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Import Character
                    </button>
                    <button
                      onClick={() => handleFightInArena(r)}
                      className="px-3.5 py-2.5 rounded-xl glass hover:bg-purple/20 text-purple-bright font-head font-bold text-xs transition-colors flex items-center gap-1"
                      title="Fight in Arena"
                    >
                      <Swords className="w-4 h-4" /> Fight
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
