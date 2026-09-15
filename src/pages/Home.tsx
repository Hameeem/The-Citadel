import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swords, Compass, Trophy, Sparkles, Shield, Flame, Zap, ArrowRight, Star, RefreshCw, Eye } from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import CharacterCard from '../components/CharacterCard'
import FeaturedBattle from '../components/FeaturedBattle'
import PortalHero from '../components/PortalHero'
import { searchMyAnimeList, convertMalToCitadelCharacter, type MalCharacterResult } from '../lib/apiServices'
import type { Universe } from '../types/character'
import { sound } from '../lib/soundFx'

const DISTRICTS: { key: Universe; color: string; desc: string; icon: string; bgImage: string }[] = [
  {
    key: 'Anime',
    color: '#F97316',
    desc: 'Shōnen awakenings & transcendent wills',
    icon: '⚡',
    bgImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Marvel',
    color: '#DC2626',
    desc: "Earth's mightiest & cosmic conquerors",
    icon: '🛡️',
    bgImage: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'DC',
    color: '#2563EB',
    desc: 'Gods, vigilantes, and detective tacticians',
    icon: '🦇',
    bgImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Games',
    color: '#06B6D4',
    desc: 'God slayers, legendary bosses & spartans',
    icon: '⚔️',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Cartoons',
    color: '#FACC15',
    desc: 'Toon-force physics & Saturday icons',
    icon: '⭐',
    bgImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Movies',
    color: '#38BDF8',
    desc: 'Silver-screen myth & elemental spirits',
    icon: '❄️',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Mythology',
    color: '#A855F7',
    desc: 'The primordial gods & immortal sages',
    icon: '👑',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
  },
  {
    key: 'Comics',
    color: '#FB7185',
    desc: 'Centuries of canon across infinite timelines',
    icon: '📖',
    bgImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
  },
]

const FEATURED_MATCHUPS: [string, string][] = [
  ['son-goku', 'superman'],
  ['shanks', 'roronoa-zoro'],
  ['gojo-satoru', 'scarlet-witch'],
]

export default function Home() {
  const navigate = useNavigate()
  const { characters, addCharacter } = useAllCharacters()
  const [malSpotlight, setMalSpotlight] = useState<MalCharacterResult[]>([])
  const [loadingMal, setLoadingMal] = useState(false)

  // Fetch live trending MAL characters for the spotlight
  useEffect(() => {
    let mounted = true
    setLoadingMal(true)
    searchMyAnimeList('Gojo')
      .then((res) => {
        if (mounted && res.length > 0) {
          setMalSpotlight(res.slice(0, 4))
        }
        setLoadingMal(false)
      })
      .catch(() => setLoadingMal(false))
    return () => {
      mounted = false
    }
  }, [])

  const trending = [...characters].sort((a, b) => b.popularity - a.popularity)
  const unrevealedApexList = characters.filter((c) => c.isUnrevealedApex)

  const handleImportSpotlight = (malChar: MalCharacterResult) => {
    sound.playVictory()
    const converted = convertMalToCitadelCharacter(malChar)
    addCharacter(converted)
    navigate(`/character/${converted.id}`)
  }

  return (
    <div className="relative z-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Portal graphic background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none -translate-y-12">
          <PortalHero />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple/40 text-xs font-head font-bold tracking-[0.2em] text-purple-bright mb-6 shadow-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            EVERY UNIVERSE. ONE FORTRESS ARCHIVE.
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.02] text-gradient drop-shadow-2xl"
          >
            THE CITADEL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-head text-xl sm:text-3xl text-ink-hi mt-4 tracking-wide font-semibold"
          >
            Where Every Universe Meets & Battles.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-ink-mid max-w-2xl mx-auto mt-5 text-sm sm:text-base leading-relaxed"
          >
            Canon evidence, interactive Power Signatures, live MyAnimeList data syncing, and transparent
            tactical Battle Arena simulations across Anime, Marvel, DC, Gaming, and Mythic icons.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link
              to="/characters"
              onClick={() => sound.playClick()}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple via-blue to-crimson font-head font-bold text-sm tracking-widest text-void shadow-glow hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              EXPLORE ARCHIVE
            </Link>
            <Link
              to="/arena"
              onClick={() => sound.playClash()}
              className="px-8 py-3.5 rounded-full glass border border-purple/50 font-head font-bold text-sm tracking-widest text-ink-hi hover:glow-ring hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Swords className="w-4 h-4 text-purple-bright" />
              BATTLE ARENA
            </Link>
            <Link
              to="/research"
              onClick={() => sound.playClick()}
              className="px-8 py-3.5 rounded-full glass border border-blue/50 font-head font-bold text-sm tracking-widest text-ink-hi hover:glow-ring-blue hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-bright" />
              LIVE MAL EXPLORER
            </Link>
          </motion.div>

          {/* Real-time Ticker Stat Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 glass rounded-2xl p-4 border border-white/10"
          >
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-gradient font-bold">{characters.length}</div>
              <div className="text-[10px] font-head tracking-[0.2em] text-ink-low uppercase mt-0.5">Legends Indexed</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-purple-bright font-bold">8</div>
              <div className="text-[10px] font-head tracking-[0.2em] text-ink-low uppercase mt-0.5">Multiverse Districts</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-amber-300 font-bold">{unrevealedApexList.length}</div>
              <div className="text-[10px] font-head tracking-[0.2em] text-ink-low uppercase mt-0.5">Unrevealed Apex Titans</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-crimson-bright font-bold">MAL + AI</div>
              <div className="text-[10px] font-head tracking-[0.2em] text-ink-low uppercase mt-0.5">Live Sync Engines</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SPECIAL FEATURE: ENIGMATIC TITANS (UNREVEALED APEX POWER) */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="glass-card rounded-3xl p-8 border border-amber-500/40 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-void to-purple/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-head tracking-[0.25em] font-bold">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" /> ENIGMATIC TITANS ARCHIVE
              </div>
              <h2 className="font-display text-3xl font-bold text-ink-hi mt-1">
                Unrevealed Apex Power Legends
              </h2>
              <p className="text-ink-mid text-sm mt-1 max-w-2xl">
                Icons whose true full potential, supreme feats, or complete backstories remain shrouded in canonical mystery—like Shanks, Minato, The Beyonder, and Lucifer.
              </p>
            </div>
            <Link
              to="/characters?filter=apex"
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-head text-xs font-bold transition-all shrink-0 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Filter Apex Titans ({unrevealedApexList.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unrevealedApexList.slice(0, 3).map((c, i) => (
              <CharacterCard key={c.id} character={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARENA BATTLES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-bright text-xs font-head tracking-[0.25em] mb-1 font-bold">
              <Swords className="w-4 h-4" /> SIMULATED CLASHES
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-hi">Featured Multiverse Battles</h2>
            <p className="text-ink-mid text-sm mt-1">
              Evidence-backed calculations and 5-beat tactical fight simulations.
            </p>
          </div>
          <Link
            to="/arena"
            onClick={() => sound.playClick()}
            className="text-sm font-head font-bold text-purple-bright hover:text-purple-bright/80 flex items-center gap-1 group"
          >
            <span>Launch Custom Arena</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_MATCHUPS.map(([x, y]) => {
            const cx = characters.find((c) => c.id === x)
            const cy = characters.find((c) => c.id === y)
            if (!cx || !cy) return null
            return <FeaturedBattle key={x + y} a={cx} b={cy} />
          })}
        </div>
      </section>

      {/* UNIVERSE DISTRICTS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-[11px] font-head tracking-[0.3em] text-purple-bright uppercase font-bold">
            EIGHT DISTRICTS. INFINITE TIMELINES.
          </span>
          <h2 className="font-display text-3xl font-bold text-ink-hi mt-1">Explore Multiverse Sectors</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DISTRICTS.map((u, i) => {
            const count = characters.filter((c) => c.universe === u.key).length
            return (
              <motion.div
                key={u.key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/characters?universe=${u.key}`}
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="group relative aspect-[3/4] rounded-3xl glass-card overflow-hidden block p-5 border border-white/10 hover:border-purple/50 transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                >
                  {/* Photo background with dark overlay */}
                  <img
                    src={u.bgImage}
                    alt={u.key}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ background: `radial-gradient(circle at 50% 30%, ${u.color}88, transparent 75%)` }}
                  />

                  {/* District Content */}
                  <div className="relative h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-2xl">{u.icon}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded glass border border-white/10 text-ink-hi">
                        {count} {count === 1 ? 'Hero' : 'Heroes'}
                      </span>
                    </div>

                    <div>
                      <div className="font-display text-xl font-bold tracking-wider" style={{ color: u.color }}>
                        {u.key.toUpperCase()}
                      </div>
                      <p className="text-xs text-ink-mid mt-1 line-clamp-2 leading-relaxed">{u.desc}</p>
                      <div className="mt-3 text-[11px] font-head font-bold text-ink-hi flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Enter Sector</span> →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* TRENDING LEGENDS GALLERY */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-bright text-xs font-head tracking-[0.25em] mb-1 font-bold">
              <Trophy className="w-4 h-4" /> HIGHEST POWER & POPULARITY
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-hi">Trending Multiverse Legends</h2>
            <p className="text-ink-mid text-sm mt-1">The most consulted dossiers in the archive this cycle.</p>
          </div>
          <Link
            to="/characters"
            onClick={() => sound.playClick()}
            className="text-sm font-head font-bold text-purple-bright hover:text-purple-bright/80 flex items-center gap-1 group"
          >
            <span>View All {characters.length} Legends</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.slice(0, 8).map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
