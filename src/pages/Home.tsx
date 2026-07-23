import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { characters } from '../data/characters'
import CharacterCard from '../components/CharacterCard'
import FeaturedBattle from '../components/FeaturedBattle'
import PortalHero from '../components/PortalHero'
import type { Universe } from '../types/character'

const DISTRICTS: { key: Universe; color: string; desc: string }[] = [
  { key: 'Anime', color: '#F97316', desc: 'Shōnen legends & sworn rivalries' },
  { key: 'Marvel', color: '#DC2626', desc: "Earth's mightiest, reimagined weekly" },
  { key: 'DC', color: '#2563EB', desc: 'Gods, detectives, and the line between' },
  { key: 'Games', color: '#22D3EE', desc: 'Playable legends, boss-tier threats' },
  { key: 'Cartoons', color: '#FACC15', desc: 'Saturday-morning icons, still undefeated' },
  { key: 'Movies', color: '#38BDF8', desc: 'Myth, magic, and the silver screen' },
  { key: 'Mythology', color: '#A855F7', desc: 'The originals every hero borrows from' },
  { key: 'Comics', color: '#FB7185', desc: 'Decades of continuity, one archive' },
]

const FEATURED_MATCHUPS: [string, string][] = [
  ['monkey-d-luffy', 'naruto-uzumaki'],
  ['batman', 'iron-man'],
  ['superman', 'scarlet-witch'],
]

export default function Home() {
  const trending = [...characters].sort((a, b) => b.popularity - a.popularity)

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-nebula" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 70% 60%, white, transparent), radial-gradient(1px 1px at 40% 80%, white, transparent), radial-gradient(2px 2px at 85% 15%, white, transparent), radial-gradient(1px 1px at 60% 25%, white, transparent)',
            opacity: 0.4,
          }}
        />
        {/* portal centerpiece, sitting behind the title */}
        <div className="absolute inset-0 flex items-start justify-center pt-6 opacity-90">
          <PortalHero />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-head tracking-[0.2em] text-purple-bright mb-8"
          >
            EVERY UNIVERSE. ONE ARCHIVE.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-800 text-5xl md:text-7xl tracking-tight leading-[1.05] text-gradient"
          >
            THE CITADEL
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-head text-xl md:text-2xl text-ink-mid mt-4 tracking-wide"
          >
            Where Every Universe Meets.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-ink-mid max-w-xl mx-auto mt-6 leading-relaxed"
          >
            Canon feats, evidence-backed stats, and transparent AI battle analysis —
            for every legendary character, from every universe, in one archive.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/characters"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-purple to-blue font-head font-semibold text-sm tracking-wide text-void shadow-glow hover:scale-105 transition-transform"
            >
              EXPLORE DATABASE
            </Link>
            <Link
              to="/arena"
              className="px-7 py-3 rounded-full glass glass-border-purple font-head text-sm tracking-wide hover:glow-ring transition-all"
            >
              BATTLE ARENA
            </Link>
            <Link
              to="/rankings"
              className="px-7 py-3 rounded-full glass glass-border-purple font-head text-sm tracking-wide hover:glow-ring transition-all"
            >
              RANKINGS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* UNIVERSE DISTRICTS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-head text-sm tracking-[0.25em] text-ink-low text-center mb-10">EIGHT DISTRICTS. ONE FORTRESS.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {DISTRICTS.map((u, i) => (
            <motion.div
              key={u.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative aspect-[4/5] rounded-2xl glass overflow-hidden group cursor-default"
            >
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 30%, ${u.color}, transparent 70%)` }}
              />
              <div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-md group-hover:blur-lg transition-all"
                style={{ background: u.color, opacity: 0.35 }}
              />
              <div className="relative h-full flex flex-col items-center justify-end text-center p-5">
                <div className="font-display text-lg tracking-wide" style={{ color: u.color }}>
                  {u.key.toUpperCase()}
                </div>
                <p className="text-xs text-ink-mid mt-1.5 leading-snug">{u.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED BATTLES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-head text-2xl font-semibold text-ink-hi">Featured Battles</h2>
            <p className="text-ink-mid text-sm mt-1">Reasoned outlooks, not coin flips — see how they're built.</p>
          </div>
          <Link to="/arena" className="text-sm font-head text-purple-bright hover:text-purple-bright/80 whitespace-nowrap">
            Enter the Arena →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURED_MATCHUPS.map(([x, y]) => {
            const cx = characters.find((c) => c.id === x)!
            const cy = characters.find((c) => c.id === y)!
            return <FeaturedBattle key={x + y} a={cx} b={cy} />
          })}
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-head text-2xl font-semibold text-ink-hi">Trending Now</h2>
            <p className="text-ink-mid text-sm mt-1">The archive's most-viewed legends this week.</p>
          </div>
          <Link to="/characters" className="text-sm font-head text-purple-bright hover:text-purple-bright/80 whitespace-nowrap">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.slice(0, 4).map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
