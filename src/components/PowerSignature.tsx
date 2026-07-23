import { motion } from 'framer-motion'
import type { Stat } from '../types/character'

/**
 * The Citadel's signature element: every character's stat block resolves
 * into one glowing polygon "Power Signature" — a shape as recognizable as
 * the character's stat spread itself. Used full-size on profile pages and
 * as a tiny thumbnail on cards/rankings.
 */
export default function PowerSignature({
  stats,
  color = '#8B5CF6',
  size = 260,
  compact = false,
}: {
  stats: Stat[]
  color?: string
  size?: number
  compact?: boolean
}) {
  const n = stats.length
  const center = 50
  const maxR = 40
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const point = (i: number, value: number) => {
    const r = (value / 100) * maxR
    const a = angleFor(i)
    return [center + r * Math.cos(a), center + r * Math.sin(a)]
  }

  const polygon = stats.map((s, i) => point(i, s.value).join(',')).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {rings.map((r) => (
          <polygon
            key={r}
            points={stats.map((_, i) => point(i, r * 100).join(',')).join(' ')}
            fill="none"
            stroke="rgba(167,159,201,0.15)"
            strokeWidth="0.4"
          />
        ))}
        {!compact &&
          stats.map((_, i) => {
            const [x, y] = point(i, 100)
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(167,159,201,0.15)" strokeWidth="0.4" />
          })}
        <motion.polygon
          points={polygon}
          fill={color}
          fillOpacity={0.28}
          stroke={color}
          strokeWidth="1.4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: '50% 50%', filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {!compact &&
          stats.map((s, i) => {
            const [x, y] = point(i, s.value)
            return <circle key={s.key} cx={x} cy={y} r="1.4" fill={color} />
          })}
      </svg>
      {!compact && (
        <div className="absolute inset-0 pointer-events-none">
          {stats.map((s, i) => {
            const a = angleFor(i)
            const lx = 50 + 47 * Math.cos(a)
            const ly = 50 + 47 * Math.sin(a)
            return (
              <div
                key={s.key}
                className="absolute text-[9px] font-head tracking-wide text-ink-mid -translate-x-1/2 -translate-y-1/2 text-center leading-tight w-16"
                style={{ left: `${lx}%`, top: `${ly}%` }}
              >
                {s.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
