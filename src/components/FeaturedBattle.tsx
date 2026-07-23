import { Link } from 'react-router-dom'
import Emblem from './Emblem'
import type { Character } from '../types/character'

const ROWS: { key: string; label: string }[] = [
  { key: 'attack_potency', label: 'POWER' },
  { key: 'speed', label: 'SPEED' },
  { key: 'intelligence', label: 'IQ' },
]

export default function FeaturedBattle({ a, b }: { a: Character; b: Character }) {
  return (
    <Link
      to={`/arena?a=${a.id}&b=${b.id}`}
      className="block glass rounded-2xl p-5 hover:glow-ring transition-all group"
    >
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Emblem character={a} size={64} />
          <span className="font-head text-sm font-semibold text-ink-hi mt-2">{a.name.split(' ')[0]}</span>
        </div>
        <span className="font-display text-xs text-ink-low">VS</span>
        <div className="flex flex-col items-center">
          <Emblem character={b} size={64} />
          <span className="font-head text-sm font-semibold text-ink-hi mt-2">{b.name.split(' ')[0]}</span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {ROWS.map((row) => {
          const av = a.stats.find((s) => s.key === row.key)?.value ?? a.popularity
          const bv = b.stats.find((s) => s.key === row.key)?.value ?? b.popularity
          const aShare = (av / (av + bv)) * 100
          return (
            <div key={row.key}>
              <div className="text-[9px] font-head tracking-wide text-ink-low mb-1 text-center">{row.label}</div>
              <div className="h-1.5 rounded-full bg-white/5 flex overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-deep to-purple" style={{ width: `${aShare}%` }} />
                <div className="h-full bg-gradient-to-l from-blue-bright to-blue" style={{ width: `${100 - aShare}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-4 text-xs font-head tracking-wide text-purple-bright group-hover:text-purple-bright/80">
        VIEW FULL ANALYSIS →
      </div>
    </Link>
  )
}
