import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swords } from 'lucide-react'
import Emblem from './Emblem'
import { analyzeBattle } from '../lib/battleAnalysis'
import type { Character } from '../types/character'
import { sound } from '../lib/soundFx'

export default function FeaturedBattle({ a, b }: { a: Character; b: Character }) {
  const analysis = analyzeBattle(a, b)
  const aProb = analysis.winProbabilityA
  const bProb = 100 - aProb

  return (
    <Link
      to={`/arena?a=${a.id}&b=${b.id}`}
      onClick={() => sound.playClash()}
      onMouseEnter={() => sound.playHover()}
      className="group block glass-card rounded-3xl p-5 hover:glow-ring transition-all duration-300 relative overflow-hidden border border-white/10 hover:border-purple/40"
    >
      {/* Background ambient dual glow */}
      <div
        className="absolute -top-10 -left-10 w-28 h-28 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
        style={{ background: a.emblemColor }}
      />
      <div
        className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
        style={{ background: b.emblemColor }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between text-[10px] font-head tracking-[0.2em] text-ink-low mb-4 relative z-10">
        <span>FEATURED CLASH</span>
        <span className="text-purple-bright font-bold">{analysis.difficulty.toUpperCase()}</span>
      </div>

      {/* Fighters Lineup */}
      <div className="flex items-center justify-between relative z-10 gap-2">
        {/* Fighter A */}
        <div className="flex flex-col items-center text-center flex-1 min-w-0">
          <Emblem character={a} size={58} />
          <h4 className="font-head text-sm font-bold text-ink-hi mt-2 truncate w-full group-hover:text-purple-bright transition-colors">
            {a.name}
          </h4>
          <span className="text-[10px] text-ink-low truncate">{a.universe}</span>
        </div>

        {/* Center VS icon */}
        <div className="flex flex-col items-center justify-center px-2">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-8 h-8 rounded-full glass border border-purple/40 flex items-center justify-center shadow-glow"
          >
            <Swords className="w-4 h-4 text-purple-bright" />
          </motion.div>
        </div>

        {/* Fighter B */}
        <div className="flex flex-col items-center text-center flex-1 min-w-0">
          <Emblem character={b} size={58} />
          <h4 className="font-head text-sm font-bold text-ink-hi mt-2 truncate w-full group-hover:text-blue-bright transition-colors">
            {b.name}
          </h4>
          <span className="text-[10px] text-ink-low truncate">{b.universe}</span>
        </div>
      </div>

      {/* Win Probability Bar */}
      <div className="mt-5 pt-3 border-t border-white/5 relative z-10">
        <div className="flex justify-between text-[11px] font-mono mb-1.5 font-bold">
          <span className="text-purple-bright">{aProb}%</span>
          <span className="text-[10px] font-head tracking-wider text-ink-low">PROJECTED WIN RATE</span>
          <span className="text-blue-bright">{bProb}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-white/5 p-0.5">
          <div
            className="h-full rounded-l-full bg-gradient-to-r from-purple-deep to-purple transition-all duration-500"
            style={{ width: `${aProb}%` }}
          />
          <div
            className="h-full rounded-r-full bg-gradient-to-r from-blue to-blue-bright transition-all duration-500"
            style={{ width: `${bProb}%` }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-3 text-center text-xs font-head text-purple-bright opacity-80 group-hover:opacity-100 flex items-center justify-center gap-1">
        <span>Simulate Battle in Arena</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  )
}
