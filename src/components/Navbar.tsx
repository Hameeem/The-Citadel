import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Compass, Trophy, Search, Volume2, VolumeX, Menu, X, Sparkles, ShieldAlert } from 'lucide-react'
import { sound } from '../lib/soundFx'
import { useAllCharacters } from '../lib/citadelStore'

interface NavbarProps {
  onOpenSearch: () => void
}

const NAV_LINKS = [
  { to: '/', label: 'HOME', icon: Compass },
  { to: '/characters', label: 'DATABASE', icon: ShieldAlert },
  { to: '/arena', label: 'ARENA', icon: Swords },
  { to: '/rankings', label: 'RANKINGS', icon: Trophy },
  { to: '/research', label: 'LIVE EXPLORER', icon: Sparkles },
]

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const location = useLocation()
  const { characters } = useAllCharacters()
  const [soundOn, setSoundOn] = useState(sound.isEnabled())
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSound = () => {
    const newState = sound.toggle()
    setSoundOn(newState)
  }

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onOpenSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpenSearch])

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => sound.playClick()}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple via-blue to-crimson p-0.5 shadow-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center">
              <Swords className="w-5 h-5 text-purple-bright group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-widest text-gradient block leading-none">
              THE CITADEL
            </span>
            <span className="text-[9px] font-head tracking-[0.25em] text-ink-low uppercase">
              Multiverse Archive · {characters.length} Legends
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-white/10">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-4 py-1.5 rounded-full text-xs font-head font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive ? 'text-void font-bold shadow-glow' : 'text-ink-mid hover:text-ink-hi'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple to-blue rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Tools: Omni Search Trigger + Sound Toggle + Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Omni Search Button */}
          <button
            onClick={() => {
              sound.playClick()
              onOpenSearch()
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass hover:border-purple/50 transition-all text-xs text-ink-mid hover:text-ink-hi group"
            aria-label="Open Multiverse Search"
          >
            <Search className="w-4 h-4 text-purple-bright group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-head">Search Multiverse</span>
            <kbd className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-ink-low border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full glass transition-all ${
              soundOn ? 'text-purple-bright hover:bg-purple/20' : 'text-ink-low hover:text-ink-hi'
            }`}
            title={soundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
            aria-label="Toggle Audio Synthesizer"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl glass text-ink-hi hover:text-purple-bright"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 glass px-6 py-4 space-y-2 overflow-hidden"
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    sound.playClick()
                    setMobileOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-head text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple to-blue text-void font-bold'
                      : 'text-ink-mid hover:text-ink-hi hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
