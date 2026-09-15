import { useState } from 'react'
import type { Character } from '../types/character'
import { getMangaPeakProfile } from '../lib/mangaPowerScaling'

interface EmblemProps {
  character: Character
  size?: number
  showImage?: boolean
}

export default function Emblem({ character, size = 96, showImage = true }: EmblemProps) {
  const [imgError, setImgError] = useState(false)
  const c = character.emblemColor || '#8B5CF6'

  // Attempt to resolve image URL from profile or peak registry fallback if primary fails
  const peakProfile = getMangaPeakProfile(character.name)
  const resolvedImageUrl =
    !imgError && character.imageUrl
      ? character.imageUrl
      : !imgError && peakProfile?.imageUrl
      ? peakProfile.imageUrl
      : undefined

  const glyphs: Record<string, JSX.Element> = {
    flame: <path d="M50 15 C35 35 30 50 40 65 C35 60 33 52 38 45 C38 60 45 72 58 75 C70 78 78 68 76 55 C74 44 66 40 66 30 C66 30 78 40 78 58 C78 76 64 88 48 85 C30 81 20 65 24 48 C28 32 42 25 50 15 Z" />,
    bolt: <path d="M55 10 L28 55 H46 L40 90 L74 42 H54 L55 10 Z" />,
    shield: <path d="M50 8 L84 22 V50 C84 72 68 86 50 92 C32 86 16 72 16 50 V22 Z" />,
    star: <path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" />,
    snowflake: <path d="M50 6 V94 M15 25 L85 75 M15 75 L85 25 M50 6 L40 20 M50 6 L60 20 M50 94 L40 80 M50 94 L60 80" strokeWidth="5" stroke={c} fill="none" strokeLinecap="round" />,
    atom: <g fill="none" stroke={c} strokeWidth="4"><ellipse cx="50" cy="50" rx="42" ry="16" /><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)" /><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)" /><circle cx="50" cy="50" r="7" fill={c} stroke="none" /></g>,
    moon: <path d="M62 12 A40 40 0 1 0 62 88 A32 32 0 0 1 62 12 Z" />,
    sword: <path d="M50 10 L56 22 L54 68 L64 72 V78 L54 78 V88 H46 V78 L36 78 V72 L46 68 L44 22 Z" />,
    eye: <g fill="none" stroke={c} strokeWidth="4"><path d="M15 50 C28 25 72 25 85 50 C72 75 28 75 15 50 Z" /><circle cx="50" cy="50" r="14" fill={c} /></g>,
    dragon: <path d="M25 75 C35 55 25 40 40 25 C50 15 70 20 80 35 C70 40 65 50 75 60 C80 65 75 75 65 75 C55 75 50 65 40 70 Z" />,
  }

  const selectedGlyph = glyphs[character.emblemGlyph] || glyphs.flame
  const hasImage = showImage && Boolean(resolvedImageUrl)

  return (
    <div
      className="relative rounded-2xl overflow-hidden glass flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 25px ${c}44, inset 0 0 20px ${c}22`,
        border: `1px solid ${c}66`,
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70"
        style={{ background: `radial-gradient(circle at 50% 30%, ${c}88, transparent 75%)` }}
      />

      {hasImage ? (
        <img
          src={resolvedImageUrl}
          alt={character.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top relative z-10 filter contrast-105 brightness-100 transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          width={size * 0.55}
          height={size * 0.55}
          fill={c}
          className="relative drop-shadow-[0_0_12px_rgba(0,0,0,0.8)] z-10"
        >
          {selectedGlyph}
        </svg>
      )}
    </div>
  )
}
