import { motion } from 'framer-motion'

/**
 * The Citadel's Blackhole Wormhole Portal.
 * Features an event horizon singularity, multi-layered counter-rotating accretion disks,
 * gravitational light distortion, and continuous 360-degree rotation.
 */
export default function PortalHero() {
  return (
    <div className="relative w-full flex items-center justify-center pointer-events-none select-none my-4">
      <div className="relative" style={{ width: 640, height: 640 }}>
        {/* Outer Gravitational Lensing Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.15) 45%, rgba(234,179,8,0.05) 65%, transparent 80%)',
            filter: 'blur(35px)',
          }}
          animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Counter-Rotating Accretion Spiral Ring 1 (Outer Cosmic Fire) */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 580,
            height: 580,
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(234,179,8,0.7) 20%, rgba(225,29,72,0.8) 45%, rgba(139,92,246,0.9) 70%, transparent 100%)',
            filter: 'blur(16px)',
            opacity: 0.65,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />

        {/* Counter-Rotating Accretion Spiral Ring 2 (Inner High-Energy Plasma) */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 480,
            height: 480,
            background:
              'conic-gradient(from 180deg, transparent 0%, rgba(56,189,248,0.9) 25%, rgba(139,92,246,0.9) 60%, rgba(244,63,94,0.8) 85%, transparent 100%)',
            filter: 'blur(12px)',
            opacity: 0.75,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />

        {/* Gravitational Distortion Arc Lines (Rotating SVG Orbitals) */}
        {[
          { size: 540, color: '#F59E0B', duration: 32, dash: '8 16 3 12', strokeWidth: 1.5 },
          { size: 440, color: '#8B5CF6', duration: 20, dash: '12 8 4 20', reverse: true, strokeWidth: 2 },
          { size: 340, color: '#38BDF8', duration: 14, dash: '4 12 18 6', strokeWidth: 2.5 },
          { size: 260, color: '#EC4899', duration: 10, dash: '2 8 2 8', reverse: true, strokeWidth: 3 },
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
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.strokeWidth}
              strokeDasharray={ring.dash}
              opacity={0.65}
            />
          </motion.svg>
        ))}

        {/* Dense Event Horizon Inner Photon Sphere Glow */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 240,
            height: 240,
            background: 'conic-gradient(from 45deg, #FFFFFF, #F59E0B, #8B5CF6, #38BDF8, #FFFFFF)',
            filter: 'blur(20px)',
          }}
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        />

        {/* PURE BLACK HOLE SINGULARITY CORE */}
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 170,
            height: 170,
            background: '#000000',
            boxShadow:
              '0 0 90px 30px rgba(139,92,246,0.6), inset 0 0 50px rgba(0,0,0,1), 0 0 140px 45px rgba(245,158,11,0.4)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Internal Swirling Blackhole Void Core Texture */}
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(139,92,246,0.4) 0%, rgba(0,0,0,0.95) 45%, #000000 100%)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Gravitational Swirling Light Sparks (Spiraling into Singularity) */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 210
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: i % 2 === 0 ? '#F59E0B' : '#38BDF8',
                boxShadow: `0 0 12px 3px ${i % 2 === 0 ? '#F59E0B' : '#38BDF8'}`,
              }}
              animate={{
                x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI) * 40, 0],
                y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI) * 40, 0],
                scale: [1, 0.4, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                ease: 'easeIn',
                delay: i * 0.4,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
