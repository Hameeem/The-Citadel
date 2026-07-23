import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Emblem from './Emblem'
import PowerSignature from './PowerSignature'
import type { Character } from '../types/character'

const UNIVERSE_LABEL: Record<Character['universe'], string> = {
  Anime: 'ANIME',
  Marvel: 'MARVEL',
  DC: 'DC',
  Games: 'GAMES',
  Cartoons: 'CARTOONS',
  Movies: 'MOVIES',
  Mythology: 'MYTHOLOGY',
  Comics: 'COMICS',
}

export default function CharacterCard({ character, index = 0 }: { character: Character; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <Link
        to={`/character/${character.id}`}
        className="group block glass rounded-2xl p-5 hover:glow-ring transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      >
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
          style={{ background: character.emblemColor }}
        />
        <div className="flex items-start justify-between relative">
          <Emblem character={character} size={64} />
          <div className="text-right">
            <div className="text-[10px] font-head tracking-[0.15em] text-ink-low">{UNIVERSE_LABEL[character.universe]}</div>
            <div className="font-mono text-xs text-purple-bright mt-1">POP {character.popularity}</div>
          </div>
        </div>
        <h3 className="font-head text-lg font-semibold mt-4 text-ink-hi group-hover:text-purple-bright transition-colors">
          {character.name}
        </h3>
        <p className="text-xs text-ink-mid mt-0.5">{character.series}</p>
        <div className="flex justify-center mt-2 -mb-4 opacity-90">
          <PowerSignature stats={character.stats} color={character.emblemColor} size={110} compact />
        </div>
      </Link>
    </motion.div>
  )
}
