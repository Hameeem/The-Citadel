import { motion } from 'framer-motion'

/**
 * The Citadel's portal — an animated wormhole built entirely from CSS/SVG
 * gradients and rotation, no imagery. This is the centerpiece the districts
 * "open out of" on the landing page.
 */
export default function PortalHero() {
  return (
    <div className="relative w-full flex items-center justify-center pointer-events-none select-none">
      <div className="relative" style={{ width: 560, height: 560 }}>
        {/* outer drifting glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 65%)' }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* rotating ring layers */}
        {[
          { size: 560, color: '#8B5CF6', duration: 40, opacity: 0.35, dash: '2 14' },
          { size: 460, color: '#3B82F6', duration: 30, opacity: 0.45, dash: '1 10', reverse: true },
          { size: 360, color: '#E11D48', duration: 22, opacity: 0.4, dash: '3 8' },
        ].map((ring, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 100 100"
            className="absolute inset-0 m-auto"
            style={{ width: ring.size, height: ring.size }}
            animate={{ rotate: ring.reverse ? -360 : 360 }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke={ring.color}
              strokeWidth="0.6"
              strokeDasharray={ring.dash}
              opacity={ring.opacity}
            />
          </motion.svg>
        ))}

        {/* accretion glow band */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 260,
            height: 260,
            background: 'conic-gradient(from 0deg, #8B5CF6, #3B82F6, #E11D48, #8B5CF6)',
            filter: 'blur(30px)',
            opacity: 0.55,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* event horizon core */}
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 190,
            height: 190,
            background: 'radial-gradient(circle at 50% 50%, #0A0714 0%, #05040A 55%, #05040A 100%)',
            boxShadow: '0 0 80px 20px rgba(139,92,246,0.35), inset 0 0 40px rgba(0,0,0,0.9)',
          }}
        />

        {/* orbiting sparks */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white"
            style={{ top: '50%', left: '50%', boxShadow: '0 0 8px 2px rgba(255,255,255,0.8)' }}
            animate={{
              x: [0, Math.cos((i / 5) * Math.PI * 2) * 220],
              y: [0, Math.sin((i / 5) * Math.PI * 2) * 220],
              rotate: 360,
              opacity: [0.9, 0.2, 0.9],
            }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>
    </div>
  )
}
