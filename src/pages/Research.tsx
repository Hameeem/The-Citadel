import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { researchCharacter } from '../lib/researchCache'
import type { ResearchResult } from '../types/research'

export default function Research() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setResult(null)
    researchCharacter(query).then((r) => {
      setResult(r)
      setLoading(false)
    })
  }, [query])

  if (!query) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink-hi mb-3">Research a character</h1>
        <p className="text-ink-mid">Search the Database for someone not in the curated archive, and you'll get an option to research them live here.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs font-head tracking-[0.2em] text-ink-low mb-2">LIVE RESEARCH</div>
      <h1 className="font-display text-2xl md:text-3xl text-gradient mb-8">"{query}"</h1>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <motion.div
            className="w-14 h-14 rounded-full border-2 border-purple/30 border-t-purple"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="font-head text-sm tracking-[0.2em] text-ink-mid">RESEARCHING CANON SOURCES…</p>
          <p className="text-xs text-ink-low max-w-sm text-center">
            This calls the Gemini API live — it isn't instant, and it needs GEMINI_API_KEY configured on your deployment.
          </p>
        </div>
      )}

      {!loading && result?.status === 'error' && (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-crimson-bright font-head mb-2">Research failed</p>
          <p className="text-sm text-ink-mid">{result.message}</p>
          <p className="text-xs text-ink-low mt-4">
            Most likely cause: this needs a live deploy with GEMINI_API_KEY set — it won't work under plain `npm run dev`. See ARENA.md / DEPLOYMENT.md.
          </p>
        </div>
      )}

      {!loading && result?.status === 'not_found' && (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="font-head text-ink-hi mb-2">Character not found</p>
          <p className="text-sm text-ink-mid">No reliable source information was found for "{query}" — double-check the spelling, or it may not be a real fictional character.</p>
        </div>
      )}

      {!loading && result?.status === 'ambiguous' && (
        <div className="glass rounded-2xl p-6">
          <p className="font-head text-ink-hi mb-4">That name is ambiguous — which one did you mean?</p>
          <div className="space-y-2">
            {result.options.map((opt) => (
              <Link
                key={opt}
                to={`/research?q=${encodeURIComponent(opt)}`}
                className="block px-4 py-3 rounded-xl glass hover:glow-ring transition-all text-sm text-ink-hi"
              >
                {opt}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && result?.status === 'found' && <ProfileView profile={result.profile} />}
    </div>
  )
}

function ProfileView({ profile }: { profile: import('../types/research').ResearchProfile }) {
  const p = profile
  return (
    <div className="space-y-10">
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-mid mb-3">
          <span>{p.universe}</span><span>·</span><span>{p.series}</span>
        </div>
        <h2 className="font-display text-2xl text-ink-hi">{p.name}</h2>
        {p.aliases.length > 0 && <p className="text-sm text-ink-low mt-1">{p.aliases.join(', ')}</p>}
        <p className="text-sm text-ink-mid mt-4 leading-relaxed">{p.description || 'No description available.'}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <Field label="Race" value={p.race} />
          <Field label="Occupation" value={p.occupation} />
          <Field label="Alignment" value={p.alignment} />
        </div>
      </div>

      <div>
        <SectionLabel>Combat Profile (qualitative — not scored)</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <Field label="Strength" value={p.strength} />
          <Field label="Speed" value={p.speed} />
          <Field label="Durability" value={p.durability} />
          <Field label="Stamina" value={p.stamina} />
          <Field label="Intelligence" value={p.intelligence} />
          <Field label="Battle IQ" value={p.battleIQ} />
        </div>
      </div>

      <TagSection label="Powers" items={p.powers} />
      <TagSection label="Abilities" items={p.abilities} />
      <TagSection label="Weapons & Equipment" items={[...p.weapons, ...p.equipment]} />
      <TagSection label="Transformations" items={p.transformations} />
      <TagSection label="Weaknesses" items={p.weaknesses} />
      <ListSection label="Major Feats" items={p.majorFeats} />
      <ListSection label="Known Battles" items={p.knownBattles} />
      <TagSection label="Allies" items={p.allies} />
      <TagSection label="Enemies" items={p.enemies} />

      {p.disputedNotes && p.disputedNotes.length > 0 && (
        <div className="glass rounded-2xl p-6 glass-border-purple">
          <h3 className="font-head font-semibold text-crimson-bright mb-2">Disputed / Uncertain</h3>
          <ul className="space-y-1.5">
            {p.disputedNotes.map((d, i) => (
              <li key={i} className="text-sm text-ink-mid">• {d}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-ink-low border-t border-white/5 pt-4">
        <span className="font-head tracking-wide">SOURCES — </span>
        {p.sources.length > 0 ? p.sources.join(' · ') : 'Not specified by the model.'}
        <p className="mt-2 italic">
          This profile was generated live by an AI research pass, not hand-verified like the curated archive. Treat it as a starting point, not ground truth.
        </p>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[9px] font-head tracking-wide text-ink-low mb-1">{label.toUpperCase()}</div>
      <div className="text-xs text-ink-hi">{value || 'Unknown'}</div>
    </div>
  )
}

function TagSection({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-2 mt-4">
        {items.map((it, i) => (
          <span key={i} className="text-xs px-3 py-1.5 rounded-full glass text-ink-mid">{it}</span>
        ))}
      </div>
    </div>
  )
}

function ListSection({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="space-y-2 mt-4">
        {items.map((it, i) => (
          <div key={i} className="glass rounded-xl px-4 py-2.5 text-sm text-ink-mid">{it}</div>
        ))}
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
