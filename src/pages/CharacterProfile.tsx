import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCharacter } from '../data/characters'
import Emblem from '../components/Emblem'
import PowerSignature from '../components/PowerSignature'

const OUTCOME_COLOR: Record<string, string> = {
  Win: 'text-emerald-400',
  Loss: 'text-crimson-bright',
  Draw: 'text-ink-mid',
}

export default function CharacterProfile() {
  const { id } = useParams()
  const character = id ? getCharacter(id) : undefined

  if (!character) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink-hi mb-3">This archive entry doesn't exist yet.</h1>
        <p className="text-ink-mid mb-6">The character you're looking for hasn't been added to The Citadel.</p>
        <Link to="/characters" className="text-purple-bright font-head">← Back to the Archive</Link>
      </div>
    )
  }

  const c = character
  const wins = c.battleHistory.filter((b) => b.outcome === 'Win').length
  const losses = c.battleHistory.filter((b) => b.outcome === 'Loss').length
  const draws = c.battleHistory.filter((b) => b.outcome === 'Draw').length

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: `radial-gradient(circle at 20% 0%, ${c.emblemColor}, transparent 55%)` }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row gap-8 items-start">
          <Emblem character={c} size={140} />
          <div className="flex-1">
            <div className="text-xs font-head tracking-[0.2em] text-ink-low mb-2">{c.universe.toUpperCase()} · {c.series.toUpperCase()}</div>
            <h1 className="font-display text-3xl md:text-4xl text-ink-hi">{c.name}</h1>
            <p className="font-head text-lg text-purple-bright mt-1 italic">"{c.tagline}"</p>
            <p className="text-ink-mid mt-4 max-w-2xl leading-relaxed">{c.bio}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {c.aliases.map((a) => (
                <span key={a} className="text-xs px-3 py-1 rounded-full glass text-ink-mid">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* IDENTITY GRID */}
        <section>
          <SectionLabel>Profile</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Field label="Alignment" value={c.alignment} />
            <Field label="Species" value={c.species} />
            <Field label="Occupation" value={c.occupation} />
            <Field label="Status" value={c.status} />
            <Field label="Debut" value={c.debut} />
            <Field label="Affiliations" value={c.affiliations.join(', ')} />
            <Field label="Popularity" value={`${c.popularity}/100`} />
            <Field label="Universe Rank" value="—" hint="Calculated once the full rankings dataset is populated" />
          </div>
        </section>

        {/* POWER SIGNATURE / STAT CARD */}
        <section>
          <SectionLabel>Power Signature</SectionLabel>
          <div className="mt-6 glass rounded-3xl p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <PowerSignature stats={c.stats} color={c.emblemColor} size={320} />
            </div>
            <div className="space-y-3">
              {c.stats.map((s) => (
                <div key={s.key} className="group relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-head text-ink-hi">{s.label}</span>
                    <span className="font-mono text-ink-mid">{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${c.emblemColor}, #A78BFA)` }}
                    />
                  </div>
                  <p className="text-xs text-ink-low mt-1 leading-snug">{s.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABILITIES */}
        <section>
          <SectionLabel>Power System</SectionLabel>
          <div className="grid md:grid-cols-2 gap-5 mt-6">
            {c.abilities.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-6 hover:glow-ring transition-all">
                <h3 className="font-head text-lg font-semibold text-ink-hi">{a.name}</h3>
                <p className="text-sm text-ink-mid mt-2 leading-relaxed">{a.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-[10px] font-head tracking-wide text-emerald-400/80 mb-1">STRENGTHS</div>
                    <ul className="text-xs text-ink-mid space-y-1">
                      {a.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-head tracking-wide text-crimson-bright/80 mb-1">WEAKNESSES</div>
                    <ul className="text-xs text-ink-mid space-y-1">
                      {a.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="text-[11px] text-ink-low mt-4 pt-3 border-t border-white/5 font-mono">EVIDENCE — {a.evidence}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GROWTH TIMELINE */}
        <section>
          <SectionLabel>Power Growth</SectionLabel>
          <div className="mt-6 relative pl-6 space-y-6 border-l border-white/10">
            {c.growth.map((g) => (
              <div key={g.id} className="relative">
                <div
                  className="absolute -left-[29px] top-1 w-3 h-3 rounded-full"
                  style={{ background: c.emblemColor, boxShadow: `0 0 12px ${c.emblemColor}` }}
                />
                <h4 className="font-head font-semibold text-ink-hi">{g.label}</h4>
                <p className="text-sm text-ink-mid mt-0.5">{g.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHIVE */}
        <section>
          <SectionLabel>The Archive</SectionLabel>
          <p className="text-sm text-ink-mid mt-2 mb-6 max-w-2xl">Where the evidence lives — every entry cites the source it's drawn from, paraphrased rather than quoted.</p>
          <div className="space-y-3">
            {c.archive.map((entry) => (
              <div key={entry.id} className="glass rounded-xl p-5 flex gap-4">
                <span className="text-[10px] font-head tracking-wide px-2.5 py-1 rounded-full glass h-fit text-ink-mid shrink-0">
                  {entry.category.toUpperCase()}
                </span>
                <div>
                  <h4 className="font-head font-semibold text-ink-hi text-sm">{entry.title}</h4>
                  <p className="text-sm text-ink-mid mt-1 leading-relaxed">{entry.description}</p>
                  <p className="text-[11px] text-ink-low mt-2 font-mono">SOURCE — {entry.source}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BATTLE HISTORY */}
        <section>
          <SectionLabel>Battle History</SectionLabel>
          <div className="flex gap-6 mt-4 mb-6">
            <StatPill label="Wins" value={wins} color="#34D399" />
            <StatPill label="Losses" value={losses} color="#FB7185" />
            <StatPill label="Draws" value={draws} color="#A79FC9" />
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            {c.battleHistory.map((b, i) => (
              <div key={b.id} className={`flex items-center justify-between px-5 py-4 text-sm ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                <div>
                  <span className="font-head text-ink-hi">{b.opponent}</span>
                  <span className="text-ink-low ml-3 text-xs">{b.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-ink-mid">{b.difficulty}</span>
                  <span className={`font-head text-xs font-semibold ${OUTCOME_COLOR[b.outcome]}`}>{b.outcome.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-display text-xs tracking-[0.25em] text-purple-bright">{children.toUpperCase()}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-purple/40 to-transparent" />
    </div>
  )
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] font-head tracking-wide text-ink-low mb-1">{label.toUpperCase()}</div>
      <div className="text-sm text-ink-hi">{value}</div>
      {hint && <div className="text-[10px] text-ink-low mt-1 italic">{hint}</div>}
    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl" style={{ color }}>{value}</div>
      <div className="text-[10px] font-head tracking-wide text-ink-low">{label.toUpperCase()}</div>
    </div>
  )
}
