import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { characters } from '../data/characters'
import CharacterCard from '../components/CharacterCard'
import Emblem from '../components/Emblem'
import type { Universe } from '../types/character'

const FILTERS: Array<Universe | 'All'> = ['All', 'Anime', 'Marvel', 'DC', 'Games', 'Cartoons', 'Movies', 'Mythology', 'Comics']

const DISCUSSIONS = [
  { title: 'Best written fictional universe?', replies: 214 },
  { title: 'Power scaling megathread', replies: 152 },
  { title: 'Which archive entry needs work?', replies: 87 },
]

const MATCHUPS: [string, string][] = [
  ['monkey-d-luffy', 'naruto-uzumaki'],
  ['batman', 'iron-man'],
  ['superman', 'scarlet-witch'],
]

export default function Characters() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<Universe | 'All'>('All')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const list = characters
    .filter((c) => filter === 'All' || c.universe === filter)
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.series.toLowerCase().includes(query.toLowerCase()))

  const ranked = useMemo(() => [...characters].sort((a, b) => b.popularity - a.popularity), [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl md:text-4xl text-gradient mb-2">THE DATABASE</h1>
      <p className="text-ink-mid mb-8">A curated sample of {characters.length} characters, proving out the full profile system.</p>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* MAIN GRID */}
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or series…"
              className="flex-1 px-4 py-2.5 rounded-xl glass text-sm placeholder:text-ink-low focus:outline-none focus:glow-ring"
            />
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-head tracking-wide transition-all ${
                    filter === f ? 'bg-gradient-to-r from-purple to-blue text-void font-semibold' : 'glass text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-20 text-ink-mid">
              <p>No characters match that search in the curated archive yet.</p>
              {query && (
                <Link
                  to={`/research?q=${encodeURIComponent(query)}`}
                  className="inline-block mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple to-blue font-head text-sm font-semibold text-void hover:scale-105 transition-transform"
                >
                  Research "{query}" with AI →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {list.map((c, i) => (
                <CharacterCard key={c.id} character={c} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-head text-sm tracking-wide text-ink-hi mb-4">GLOBAL RANKINGS</h3>
            <div className="space-y-3">
              {ranked.slice(0, 5).map((c, i) => (
                <Link key={c.id} to={`/character/${c.id}`} className="flex items-center gap-3 group">
                  <span className="font-display text-sm w-4 text-ink-low">{i + 1}</span>
                  <Emblem character={c} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-head text-ink-hi truncate group-hover:text-purple-bright transition-colors">{c.name}</div>
                  </div>
                  <span className="text-[10px] font-mono text-ink-low">{c.popularity}</span>
                </Link>
              ))}
            </div>
            <Link to="/rankings" className="block text-center text-xs font-head text-purple-bright mt-4 hover:text-purple-bright/80">
              FULL RANKINGS →
            </Link>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-head text-sm tracking-wide text-ink-hi mb-4">POPULAR MATCHUPS</h3>
            <div className="space-y-3">
              {MATCHUPS.map(([aId, bId]) => {
                const a = characters.find((c) => c.id === aId)!
                const b = characters.find((c) => c.id === bId)!
                return (
                  <Link
                    key={aId + bId}
                    to={`/arena?a=${aId}&b=${bId}`}
                    className="flex items-center justify-between text-xs font-head text-ink-mid hover:text-purple-bright transition-colors"
                  >
                    <span>{a.name.split(' ')[0]}</span>
                    <span className="text-ink-low">vs</span>
                    <span>{b.name.split(' ')[0]}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-head text-sm tracking-wide text-ink-hi mb-1">COMMUNITY DISCUSSIONS</h3>
            <p className="text-[10px] text-ink-low mb-4 italic">Placeholder — no community backend yet</p>
            <div className="space-y-3">
              {DISCUSSIONS.map((d) => (
                <div key={d.title} className="text-xs">
                  <div className="text-ink-mid hover:text-ink-hi transition-colors cursor-default">{d.title}</div>
                  <div className="text-ink-low font-mono mt-0.5">{d.replies} replies</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
