import { useState } from 'react'
import { Link } from 'react-router-dom'
import { characters } from '../data/characters'
import Emblem from '../components/Emblem'

const CATEGORIES = [
  { key: 'popularity', label: 'Most Popular', statKey: null },
  { key: 'strength', label: 'Strongest', statKey: 'strength' },
  { key: 'intelligence', label: 'Smartest', statKey: 'intelligence' },
  { key: 'speed', label: 'Fastest', statKey: 'speed' },
] as const

export default function Rankings() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]['key']>('popularity')
  const cat = CATEGORIES.find((c) => c.key === active)!

  const ranked = [...characters]
    .map((c) => ({
      c,
      value: cat.statKey ? c.stats.find((s) => s.key === cat.statKey)?.value ?? 0 : c.popularity,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl md:text-4xl text-gradient mb-2">GLOBAL RANKINGS</h1>
      <p className="text-ink-mid mb-8">Ranked across the current sample archive — grows more meaningful as the dataset scales.</p>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`px-4 py-2 rounded-xl text-xs font-head tracking-wide transition-all ${
              active === c.key ? 'bg-gradient-to-r from-purple to-blue text-void font-semibold' : 'glass text-ink-mid hover:text-ink-hi'
            }`}
          >
            {c.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {ranked.map(({ c, value }, i) => (
          <Link
            to={`/character/${c.id}`}
            key={c.id}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${i !== 0 ? 'border-t border-white/5' : ''}`}
          >
            <span className="font-display text-lg w-8 text-center text-ink-low">{i + 1}</span>
            <Emblem character={c} size={44} />
            <div className="flex-1">
              <div className="font-head text-ink-hi text-sm">{c.name}</div>
              <div className="text-xs text-ink-low">{c.universe} · {c.series}</div>
            </div>
            <div className="font-mono text-purple-bright text-sm">{value}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
