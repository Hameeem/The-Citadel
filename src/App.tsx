import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import ParticleCanvas from './components/ParticleCanvas'
import SearchModal from './components/SearchModal'
import Home from './pages/Home'
import Characters from './pages/Characters'
import CharacterProfile from './pages/CharacterProfile'
import Rankings from './pages/Rankings'
import Arena from './pages/Arena'
import Research from './pages/Research'
import { sound } from './lib/soundFx'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-purple/40">
      {/* Interactive Cosmic Background Particles */}
      <ParticleCanvas />

      {/* Global Command Palette Omni-Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Futuristic Navigation Bar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Routed Content */}
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/character/:id" element={<CharacterProfile />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </main>

      {/* Futuristic Command Footer */}
      <footer className="border-t border-white/10 glass relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-display font-bold text-base tracking-widest text-gradient block">
              THE CITADEL
            </span>
            <p className="text-xs text-ink-low mt-1 font-head tracking-wider">
              Multiverse Character Archive & Tactical Battle Arena · Powered by MyAnimeList & AI
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-head font-semibold text-ink-mid">
            <Link to="/" onClick={() => sound.playClick()} className="hover:text-purple-bright transition-colors">
              HOME
            </Link>
            <Link to="/characters" onClick={() => sound.playClick()} className="hover:text-purple-bright transition-colors">
              DATABASE
            </Link>
            <Link to="/arena" onClick={() => sound.playClash()} className="hover:text-purple-bright transition-colors">
              ARENA
            </Link>
            <Link to="/rankings" onClick={() => sound.playClick()} className="hover:text-purple-bright transition-colors">
              RANKINGS
            </Link>
            <Link to="/research" onClick={() => sound.playClick()} className="hover:text-blue-bright transition-colors">
              MAL EXPLORER
            </Link>
          </div>

          <div className="text-[11px] font-mono text-ink-low">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  )
}
