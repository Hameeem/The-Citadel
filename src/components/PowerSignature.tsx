import { useState } from 'react'
import type { Stat } from '../types/character'
import { sound } from '../lib/soundFx'

interface PowerSignatureProps {
  stats: Stat[]
  color?: string
  size?: number
  compact?: boolean
  compareStats?: Stat[]
  compareColor?: string
}

export default function PowerSignature({
  stats,
  color = '#8B5CF6',
  size = 280,
  compact = false,
  compareStats,
  compareColor = '#3B82F6',
}: PowerSignatureProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const center = size / 2
  const maxRadius = compact ? size * 0.44 : size * 0.38
  const count = stats.length

  const getCoordinates = (index: number, value: number, radius: number = maxRadius) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2
    const distance = (value / 100) * radius
    const x = center + distance * Math.cos(angle)
    const y = center + distance * Math.sin(angle)
    return { x, y, angle }
  }

  // Calculate polygon points
  const points = stats
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.value)
      return `${x},${y}`
    })
    .join(' ')

  const comparePoints = compareStats
    ? compareStats
        .map((s, i) => {
          const { x, y } = getCoordinates(i, s.value)
          return `${x},${y}`
        })
        .join(' ')
    : null

  // Radial web background rings
  const rings = [0.25, 0.5, 0.75, 1.0]

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id={`radGrad-${color.replace('#', '')}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
          <filter id="glow-poly" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Web Rings */}
        {rings.map((factor, rIdx) => {
          const ringPoints = stats
            .map((_, i) => {
              const { x, y } = getCoordinates(i, 100, maxRadius * factor)
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polygon
              key={rIdx}
              points={ringPoints}
              fill="none"
              stroke="rgba(167, 159, 201, 0.12)"
              strokeWidth={factor === 1 ? '1.5' : '1'}
              strokeDasharray={factor < 1 ? '3 3' : undefined}
            />
          )
        })}

        {/* Axis Lines */}
        {stats.map((_, i) => {
          const { x, y } = getCoordinates(i, 100, maxRadius)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(167, 159, 201, 0.15)"
              strokeWidth="1"
            />
          )
        })}

        {/* Compare Polygon if available */}
        {comparePoints && (
          <polygon
            points={comparePoints}
            fill={compareColor}
            fillOpacity="0.2"
            stroke={compareColor}
            strokeWidth="2"
            strokeDasharray="4 4"
            className="transition-all duration-500"
          />
        )}

        {/* Primary Character Polygon */}
        <polygon
          points={points}
          fill={`url(#radGrad-${color.replace('#', '')})`}
          stroke={color}
          strokeWidth={compact ? '2' : '2.5'}
          filter="url(#glow-poly)"
          className="transition-all duration-500 ease-out"
        />

        {/* Interactive Vertex Nodes */}
        {stats.map((s, i) => {
          const { x, y } = getCoordinates(i, s.value)
          const isHovered = hoveredIdx === i
          return (
            <g key={s.key} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : compact ? 2.5 : 4}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                onMouseEnter={() => {
                  setHoveredIdx(i)
                  sound.playScan()
                }}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          )
        })}

        {/* Stat Labels (Full Mode Only) */}
        {!compact &&
          stats.map((s, i) => {
            const { x, y } = getCoordinates(i, 100, maxRadius + 22)
            const isHovered = hoveredIdx === i
            return (
              <text
                key={s.key}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className={`font-head text-[11px] font-semibold tracking-wider transition-colors duration-200 cursor-pointer ${
                  isHovered ? 'fill-ink-hi text-shadow' : 'fill-ink-mid'
                }`}
                onMouseEnter={() => {
                  setHoveredIdx(i)
                  sound.playScan()
                }}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {s.label.toUpperCase()}
              </text>
            )
          })}
      </svg>

      {/* Floating Hover Node Detail Tooltip */}
      {!compact && hoveredIdx !== null && (
        <div
          className="absolute -bottom-8 px-4 py-1.5 rounded-xl glass border border-purple/40 text-center pointer-events-none z-20 shadow-glow"
        >
          <span className="font-head text-xs font-bold text-ink-hi mr-2">
            {stats[hoveredIdx].label}:
          </span>
          <span className="font-mono text-xs font-semibold text-purple-bright">
            {stats[hoveredIdx].value} / 100
          </span>
        </div>
      )}
    </div>
  )
}
