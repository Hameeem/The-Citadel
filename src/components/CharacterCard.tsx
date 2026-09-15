import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import Emblem from './Emblem'
import PowerSignature from './PowerSignature'
import type { Character } from '../types/character'
import { sound } from '../lib/soundFx'

const UNIVERSE_THEME: Record<Character['universe'], { label: string; color: string }> = {
  Anime: { label: 'ANIME', color: '#F97316' },
  Marvel: { label: 'MARVEL', color: '#DC2626' },
  DC: { label: 'DC COMICS', color: '#2563EB' },
  Games: { label: 'GAMES', color: '#06B6D4' },
  Cartoons: { label: 'CARTOONS', color: '#FACC15' },
  Movies: { label: 'MOVIES', color: '#38BDF8' },
  Mythology: { label: 'MYTHOLOGY', color: '#A855F7' },
  Comics: { label: 'COMICS', color: '#FB7185' },
}

export default function CharacterCard({ character, index = 0 }: { character: Character; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotateX(-y * 0.05)
    setRotateY(x * 0.05)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const u = UNIVERSE_THEME[character.universe] || { label: character.universe, color: '#8B5CF6' }
  const tier = character.tier || 'S'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <Link
          to={`/character/${character.id}`}
          onClick={() => sound.playClick()}
          onMouseEnter={() => sound.playHover()}
          className="group block glass-card rounded-2xl p-5 hover:glow-ring transition-all duration-300 relative overflow-hidden"
          style={{
            border: `1px solid ${character.emblemColor}33`,
          }}
        >
          {/* Ambient Corner Glow */}
          <div
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-25 blur-2xl group-hover:opacity-50 transition-opacity duration-300"
            style={{ background: character.emblemColor }}
          />

          {/* Header row: Portrait + Badges */}
          <div className="flex items-start justify-between relative z-10 gap-3">
            <Emblem character={character} size={72} />

            <div className="text-right flex flex-col items-end gap-1.5">
              <span
                className="text-[10px] font-head font-bold tracking-[0.18em] px-2.5 py-0.5 rounded-full glass border"
                style={{ borderColor: `${u.color}55`, color: u.color }}
              >
                {u.label}
              </span>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-display font-extrabold px-2 py-0.5 rounded text-void tier-badge-${tier}`}
                >
                  {tier}-TIER
                </span>
                <span className="font-mono text-xs text-purple-bright bg-white/5 px-2 py-0.5 rounded">
                  ★ {character.popularity}
                </span>
              </div>

              {character.isUnrevealedApex && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 shadow-glow">
                  <Flame className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> UNREVEALED APEX
                </span>
              )}
            </div>
          </div>

          {/* Character Identity */}
          <div className="mt-4 relative z-10">
            <div className="flex items-baseline justify-between">
              <h3 className="font-head text-lg font-bold text-ink-hi group-hover:text-purple-bright transition-colors line-clamp-1">
                {character.name}
              </h3>
              {character.japaneseName && (
                <span className="text-[10px] font-body text-ink-low font-medium ml-2 shrink-0">
                  {character.japaneseName}
                </span>
              )}
            </div>
            <p className="text-xs text-ink-mid line-clamp-1 mt-0.5">{character.series}</p>
          </div>

          {/* Mini Power Signature Radar Chart */}
          <div className="flex justify-center mt-3 -mb-3 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
            <PowerSignature stats={character.stats} color={character.emblemColor} size={115} compact />
          </div>

          {/* Bottom stats ribbon */}
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-ink-low">
            <span>Power Signature</span>
            <span className="text-purple-bright group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Inspect Dossier →
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
