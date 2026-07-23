import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/characters', label: 'Database' },
  { to: '/arena', label: 'Arena' },
  { to: '/rankings', label: 'Rankings' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/characters?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-blue flex items-center justify-center font-display text-xs font-bold text-void shadow-glow group-hover:scale-105 transition-transform">
              C
            </span>
            <span className="font-display text-sm tracking-[0.2em] text-ink-hi hidden sm:inline">THE CITADEL</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 font-head text-sm tracking-wide shrink-0">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`transition-colors ${
                  pathname === l.to ? 'text-purple-bright' : 'text-ink-mid hover:text-ink-hi'
                }`}
              >
                {l.label.toUpperCase()}
              </Link>
            ))}
          </div>

          <form onSubmit={submitSearch} className="flex-1 max-w-sm ml-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-low" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the archive…"
                className="w-full pl-9 pr-3 py-2 rounded-full glass text-xs text-ink-hi placeholder:text-ink-low focus:outline-none focus:glow-ring"
              />
            </div>
          </form>

          <Link
            to="/characters"
            className="hidden sm:inline text-xs font-head tracking-wide px-4 py-2 rounded-full glass glass-border-purple hover:glow-ring transition-all shrink-0"
          >
            ENTER
          </Link>
        </nav>
      </div>
    </header>
  )
}
