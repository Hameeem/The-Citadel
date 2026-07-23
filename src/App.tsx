import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Characters from './pages/Characters'
import CharacterProfile from './pages/CharacterProfile'
import Rankings from './pages/Rankings'
import Arena from './pages/Arena'
import Research from './pages/Research'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/character/:id" element={<CharacterProfile />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-ink-low font-head tracking-wide">
        THE CITADEL — WHERE EVERY UNIVERSE MEETS
      </footer>
    </div>
  )
}
