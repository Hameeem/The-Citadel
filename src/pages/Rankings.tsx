import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, Brain, Shield, Heart, ArrowRight, Swords } from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import Emblem from '../components/Emblem'
import { sound } from '../lib/soundFx'

const CATEGORIES = [
  { key: 'popularity', label: 'Most Popular', statKey: null, icon: Trophy },
  { key: 'strength', label: 'Highest Strength', statKey: 'strength', icon: Flame },
  { key: 'attack_potency', label: 'Attack Potency', statKey: 'attack_potency', icon: Zap },
  { key: 'speed', label: 'Fastest Speed', statKey: 'speed', icon: Zap },
  { key: 'durability', label: 'Toughest Durability', statKey: 'durability', icon: Shield },
  { key: 'intelligence', label: 'Master Strategists', statKey: 'intelligence', icon: Brain },
  { key: 'willpower', label: 'Indomitable Will', statKey: 'willpower', icon: Heart },
] as const

export default function Rankings() {
  const { characters } = useAllCharacters()
  const [active, setActive] = useState<(typeof CATEGORIES)[number]['key']>('popularity')
  const cat = CATEGORIES.find((c) => c.key === active)!

  const ranked = [...characters]
    .map((c) => ({
      c,
      value: cat.statKey ? c.stats.find((s) => s.key === cat.statKey)?.value ?? 0 : c.popularity,
    }))
    .sort((a, b) => b.value - a.value)

  const top3 = ranked.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-head font-bold tracking-[0.25em] text-purple-bright uppercase">
          MULTIVERSE LEADERBOARD
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient mt-1">GLOBAL RANKINGS</h1>
        <p className="text-ink-mid text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Calculated dynamically across verified canon stats and community popularity indexes.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-2 flex-wrap justify-center mb-12">
        {CATEGORIES.map((c) => {
          const Icon = c.icon
          const isActive = active === c.key
          return (
            <button
              key={c.key}
              onClick={() => {
                sound.playClick()
                setActive(c.key)
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-head font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-purple to-blue text-void shadow-glow font-extrabold'
                  : 'glass text-ink-mid hover:text-ink-hi'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* TOP 3 HOLOGRAPHIC PODIUM */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto items-end mb-14">
          {/* 2nd Place (Silver) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-xs font-head font-bold text-ink-low uppercase mb-2">#2 SILVER</span>
            <Link
              to={`/character/${top3[1].c.id}`}
              className="group glass-card rounded-3xl p-4 w-full flex flex-col items-center border border-white/10 hover:border-blue/50 transition-all"
            >
              <Emblem character={top3[1].c} size={70} />
              <h4 className="font-head font-bold text-sm text-ink-hi mt-2 truncate w-full group-hover:text-blue-bright">
                {top3[1].c.name}
              </h4>
              <span className="font-mono text-xs font-bold text-blue-bright mt-1">★ {top3[1].value}</span>
            </Link>
            <div className="w-full h-16 glass rounded-t-2xl mt-2 flex items-center justify-center font-display text-xl text-ink-low font-bold">
              2
            </div>
          </motion.div>

          {/* 1st Place (Gold Champion) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center -translate-y-4"
          >
            <div className="flex items-center gap-1 text-xs font-head font-bold text-amber-400 uppercase mb-2">
              <Trophy className="w-4 h-4 text-amber-400" /> #1 CHAMPION
            </div>
            <Link
              to={`/character/${top3[0].c.id}`}
              className="group glass-card rounded-3xl p-5 w-full flex flex-col items-center border border-amber-400/40 shadow-glow hover:scale-105 transition-all"
            >
              <Emblem character={top3[0].c} size={88} />
              <h4 className="font-head font-bold text-base text-ink-hi mt-2 truncate w-full group-hover:text-amber-400">
                {top3[0].c.name}
              </h4>
              <span className="font-mono text-sm font-bold text-amber-400 mt-1">★ {top3[0].value}</span>
            </Link>
            <div className="w-full h-24 bg-gradient-to-t from-amber-500/20 to-purple/30 glass rounded-t-2xl mt-2 flex items-center justify-center font-display text-3xl text-amber-400 font-black">
              1
            </div>
          </motion.div>

          {/* 3rd Place (Bronze) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-xs font-head font-bold text-ink-low uppercase mb-2">#3 BRONZE</span>
            <Link
              to={`/character/${top3[2].c.id}`}
              className="group glass-card rounded-3xl p-4 w-full flex flex-col items-center border border-white/10 hover:border-amber-700/50 transition-all"
            >
              <Emblem character={top3[2].c} size={70} />
              <h4 className="font-head font-bold text-sm text-ink-hi mt-2 truncate w-full group-hover:text-amber-500">
                {top3[2].c.name}
              </h4>
              <span className="font-mono text-xs font-bold text-amber-600 mt-1">★ {top3[2].value}</span>
            </Link>
            <div className="w-full h-12 glass rounded-t-2xl mt-2 flex items-center justify-center font-display text-lg text-ink-low font-bold">
              3
            </div>
          </motion.div>
        </div>
      )}

      {/* FULL LEADERBOARD LIST */}
      <div className="glass rounded-3xl overflow-hidden border border-white/10 divide-y divide-white/5">
        {ranked.map(({ c, value }, i) => {
          const tier = c.tier || 'S'
          return (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-all group"
            >
              <Link to={`/character/${c.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <span className="font-display text-lg w-8 text-center text-ink-low font-bold">
                  {i + 1}
                </span>
                <Emblem character={c} size={48} />
                <div className="min-w-0">
                  <div className="font-head text-base font-bold text-ink-hi group-hover:text-purple-bright transition-colors truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-ink-low truncate">
                    {c.universe} · {c.series}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`font-display text-[10px] px-2 py-0.5 rounded tier-badge-${tier} text-void font-bold`}>
                  {tier}-TIER
                </span>
                <div className="font-mono font-bold text-purple-bright text-base min-w-[50px] text-right">
                  {value}
                </div>
                <Link
                  to={`/arena?a=${c.id}`}
                  onClick={() => sound.playClash()}
                  className="p-2 rounded-xl glass hover:bg-purple/20 text-ink-mid hover:text-purple-bright transition-colors"
                  title="Fight in Arena"
                >
                  <Swords className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
