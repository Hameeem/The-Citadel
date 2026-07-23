import type { Character } from '../types/character'

/**
 * Renders an abstract, generated glyph-emblem for a character instead of
 * likeness artwork. Swap in real/licensed art via Character.image once you
 * have rights to it — this keeps the app safe to ship without needing
 * hundreds of licensed illustrations up front.
 */
export default function Emblem({ character, size = 96 }: { character: Character; size?: number }) {
  const c = character.emblemColor
  const glyphs: Record<Character['emblemGlyph'], JSX.Element> = {
    flame: <path d="M50 15 C35 35 30 50 40 65 C35 60 33 52 38 45 C38 60 45 72 58 75 C70 78 78 68 76 55 C74 44 66 40 66 30 C66 30 78 40 78 58 C78 76 64 88 48 85 C30 81 20 65 24 48 C28 32 42 25 50 15 Z" />,
    bolt: <path d="M55 10 L28 55 H46 L40 90 L74 42 H54 L55 10 Z" />,
    shield: <path d="M50 8 L84 22 V50 C84 72 68 86 50 92 C32 86 16 72 16 50 V22 Z" />,
    star: <path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" />,
    snowflake: <path d="M50 6 V94 M15 25 L85 75 M15 75 L85 25 M50 6 L40 20 M50 6 L60 20 M50 94 L40 80 M50 94 L60 80" strokeWidth="5" stroke={c} fill="none" strokeLinecap="round" />,
    atom: <g fill="none" stroke={c} strokeWidth="4"><ellipse cx="50" cy="50" rx="42" ry="16" /><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)" /><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)" /><circle cx="50" cy="50" r="7" fill={c} stroke="none" /></g>,
    moon: <path d="M62 12 A40 40 0 1 0 62 88 A32 32 0 0 1 62 12 Z" />,
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden glass glow-ring flex items-center justify-center shrink-0"
      style={{ width: size, height: size, boxShadow: `0 0 30px ${c}55, inset 0 0 30px ${c}22` }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(circle at 50% 30%, ${c}66, transparent 70%)` }}
      />
      <svg viewBox="0 0 100 100" width={size * 0.55} height={size * 0.55} fill={c} className="relative drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        {glyphs[character.emblemGlyph]}
      </svg>
    </div>
  )
}
