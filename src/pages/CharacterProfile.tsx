import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swords, ExternalLink, Shield, Zap, Sparkles, Volume2, Trophy, ArrowLeft, Image as ImageIcon, BookOpen, Film } from 'lucide-react'
import { useAllCharacters } from '../lib/citadelStore'
import Emblem from '../components/Emblem'
import PowerSignature from '../components/PowerSignature'
import ImagePickerModal from '../components/ImagePickerModal'
import { getPinterestSearchUrl } from '../lib/imageLibrary'
import { sound } from '../lib/soundFx'

const OUTCOME_COLOR: Record<string, string> = {
  Win: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Loss: 'text-crimson-bright bg-crimson/10 border-crimson/30',
  Draw: 'text-ink-mid bg-white/5 border-white/10',
}

export default function CharacterProfile() {
  const { id } = useParams()
  const { characters, updateCharacterImage } = useAllCharacters()
  const character = characters.find((c) => c.id === id)

  const [compareId, setCompareId] = useState<string>('')
  const [imageModalOpen, setImageModalOpen] = useState(false)

  if (!character) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink-hi mb-3">Dossier not found</h1>
        <p className="text-ink-mid mb-6">This legendary fighter has not yet been indexed in The Citadel archives.</p>
        <Link
          to="/characters"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple text-void font-head font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Database
        </Link>
      </div>
    )
  }

  const c = character
  const tier = c.tier || 'S'
  const compareChar = characters.find((x) => x.id === compareId)
  const pinterestUrl = getPinterestSearchUrl(c.name, c.universe)

  const wins = c.battleHistory.filter((b) => b.outcome === 'Win').length
  const losses = c.battleHistory.filter((b) => b.outcome === 'Loss').length
  const draws = c.battleHistory.filter((b) => b.outcome === 'Draw').length

  const handleSaveImage = (newUrl: string) => {
    updateCharacterImage(c.id, newUrl)
  }

  return (
    <div className="relative z-10 pb-24">
      {/* Image Picker Modal */}
      <ImagePickerModal
        character={c}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSaveImage={handleSaveImage}
      />

      {/* CINEMATIC HERO BANNER */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          {c.bannerUrl ? (
            <img src={c.bannerUrl} alt={c.name} className="w-full h-full object-cover opacity-25 filter blur-sm" />
          ) : (
            <div className="w-full h-full bg-nebula opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(circle at 20% 20%, ${c.emblemColor}, transparent 65%)` }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* High-res Avatar Portrait with Hover Image Changer */}
          <div className="relative group cursor-pointer" onClick={() => setImageModalOpen(true)}>
            <Emblem character={c} size={160} />
            <div className="absolute inset-0 rounded-2xl bg-void/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-head font-bold gap-1 border border-purple/60 shadow-glow">
              <ImageIcon className="w-5 h-5 text-purple-bright" />
              <span>Change Art (Pinterest)</span>
            </div>
          </div>

          {/* Core Identity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-head font-bold tracking-[0.2em] text-ink-low uppercase">
                {c.universe} · {c.series}
              </span>
              <span className={`font-display text-[10px] px-2.5 py-0.5 rounded tier-badge-${tier} text-void font-extrabold`}>
                {tier}-TIER
              </span>
              {c.sourceUrl && (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-head tracking-wider text-blue-bright hover:underline flex items-center gap-1 glass px-2 py-0.5 rounded-full"
                >
                  <ExternalLink className="w-3 h-3" /> Canon Source
                </a>
              )}
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-head tracking-wider text-red-400 hover:underline flex items-center gap-1 glass px-2.5 py-0.5 rounded-full border border-red-500/30"
              >
                <Sparkles className="w-3 h-3 text-red-400" /> Search Pinterest
              </a>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink-hi tracking-tight">{c.name}</h1>
              {c.japaneseName && (
                <span className="text-lg font-body text-purple-bright font-semibold">{c.japaneseName}</span>
              )}
            </div>

            {c.quote && (
              <p className="font-head text-lg text-purple-bright mt-1 italic font-medium">"{c.quote}"</p>
            )}

            <p className="text-ink-mid mt-3 max-w-3xl leading-relaxed text-sm sm:text-base">{c.bio}</p>

            {/* Aliases & Voice Actor */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {c.voiceActor && (
                <span className="text-xs px-3 py-1 rounded-full glass border border-purple/30 text-purple-bright font-head font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3" /> VA: {c.voiceActor}
                </span>
              )}
              {c.aliases.map((a) => (
                <span key={a} className="text-xs px-3 py-1 rounded-full glass text-ink-mid">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <Link
              to={`/arena?a=${c.id}`}
              onClick={() => sound.playClash()}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple via-blue to-crimson font-head font-bold text-sm tracking-wider text-void shadow-glow hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" /> TEST IN ARENA
            </Link>
            <button
              onClick={() => {
                sound.playClick()
                setImageModalOpen(true)
              }}
              className="px-6 py-2.5 rounded-full glass border border-purple/40 font-head font-bold text-xs tracking-wider text-ink-hi hover:glow-ring transition-all flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-bright" /> CHOOSE ART (PINTEREST)
            </button>
          </div>
        </div>
      </section>

      {/* DUAL-CANON SOURCE TRACKER */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Source Canon (Manga / Comics) */}
          <div className="glass-card rounded-3xl p-6 border border-purple/30 relative overflow-hidden">
            <div className="flex items-center gap-2 text-purple-bright text-xs font-head font-bold tracking-wider uppercase mb-3">
              <BookOpen className="w-4 h-4" /> 📖 ORIGINAL SOURCE CANON (MANGA / COMICS)
            </div>
            <h3 className="font-head text-lg font-bold text-ink-hi">
              {c.primarySource?.title || `${c.series} (Original Canon)`}
            </h3>
            <p className="text-xs text-ink-mid mt-1">
              {c.primarySource?.publisherOrCreator || 'Official Original Publisher / Author'}
              {c.primarySource?.eraOrDebut && ` · Debut: ${c.primarySource.eraOrDebut}`}
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-purple/10 border border-purple/20">
              <span className="text-[10px] font-head font-bold text-purple-bright uppercase block mb-1">
                PEAK SOURCE CANON FEAT
              </span>
              <p className="text-xs text-ink-hi leading-relaxed">
                {c.primarySource?.peakMangaOrComicFeat ||
                  `${c.name}'s peak unconstrained feats and power scaling in the original publication.`}
              </p>
            </div>
          </div>

          {/* Media Adaptation (Anime / Movie) */}
          <div className="glass-card rounded-3xl p-6 border border-blue/30 relative overflow-hidden">
            <div className="flex items-center gap-2 text-blue-bright text-xs font-head font-bold tracking-wider uppercase mb-3">
              <Film className="w-4 h-4" /> 🎬 MEDIA ADAPTATION (ANIME / MOVIE)
            </div>
            <h3 className="font-head text-lg font-bold text-ink-hi">
              {c.adaptationMedia?.title || `${c.series} (Screen Adaptation)`}
            </h3>
            <p className="text-xs text-ink-mid mt-1">
              {c.adaptationMedia?.studioOrDistributor || 'Official Studio / Production House'}
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-blue/10 border border-blue/20">
              <span className="text-[10px] font-head font-bold text-blue-bright uppercase block mb-1">
                ON-SCREEN ADAPTATION NUANCE
              </span>
              <p className="text-xs text-ink-hi leading-relaxed">
                {c.adaptationMedia?.adaptationFeat ||
                  `Visual spectacle, cinematic animation pacing, and on-screen combat depiction.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT GRID */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* IDENTITY DOSSIER METADATA */}
        <section>
          <SectionLabel>Character Profile Dossier</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <Field label="Alignment" value={c.alignment} />
            <Field label="Species" value={c.species} />
            <Field label="Occupation" value={c.occupation} />
            <Field label="Status" value={c.status} />
            <Field label="Debut" value={c.debut} />
            <Field label="Affiliations" value={c.affiliations.join(', ')} />
            <Field label="Popularity Score" value={`★ ${c.popularity}/100`} />
            <Field label="Power Tier" value={`${tier}-Tier Rank`} />
          </div>
        </section>

        {/* POWER SIGNATURE & RADAR CHART */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SectionLabel>Power Signature Radar</SectionLabel>
            <div className="flex items-center gap-2">
              <span className="text-xs font-head text-ink-low uppercase">Compare with:</span>
              <select
                value={compareId}
                onChange={(e) => {
                  sound.playScan()
                  setCompareId(e.target.value)
                }}
                className="px-3 py-1.5 rounded-xl glass text-xs text-ink-hi focus:outline-none focus:glow-ring bg-panel"
              >
                <option value="">None (Solo Signature)</option>
                {characters
                  .filter((x) => x.id !== c.id)
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name} ({x.universe})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-6 glass-card rounded-3xl p-8 grid md:grid-cols-2 gap-8 items-center border border-white/10">
            {/* Interactive Radar */}
            <div className="flex flex-col items-center justify-center">
              <PowerSignature
                stats={c.stats}
                color={c.emblemColor}
                size={340}
                compareStats={compareChar?.stats}
                compareColor={compareChar?.emblemColor || '#3B82F6'}
              />
              {compareChar && (
                <div className="flex items-center gap-4 mt-4 text-xs font-head font-semibold">
                  <span className="flex items-center gap-1.5" style={{ color: c.emblemColor }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.emblemColor }} /> {c.name}
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: compareChar.emblemColor }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: compareChar.emblemColor }} />{' '}
                    {compareChar.name}
                  </span>
                </div>
              )}
            </div>

            {/* Stat Bars with Evidence Citations */}
            <div className="space-y-4">
              {c.stats.map((s) => (
                <div key={s.key} className="group relative">
                  <div className="flex justify-between text-xs sm:text-sm mb-1 font-head">
                    <span className="text-ink-hi font-bold">{s.label}</span>
                    <span className="font-mono text-purple-bright font-bold">{s.value} / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${c.emblemColor}, #A78BFA)` }}
                    />
                  </div>
                  <p className="text-[11px] text-ink-low mt-1 leading-snug">{s.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABILITY & POWER SYSTEM */}
        <section>
          <SectionLabel>Power System & Signature Abilities</SectionLabel>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {c.abilities.map((a) => (
              <div
                key={a.id}
                className="glass-card rounded-3xl p-6 hover:glow-ring transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-bright" />
                  <h3 className="font-head text-lg font-bold text-ink-hi">{a.name}</h3>
                </div>
                <p className="text-sm text-ink-mid mt-2 leading-relaxed">{a.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="glass rounded-xl p-3 border border-emerald-500/20">
                    <div className="text-[10px] font-head tracking-wider text-emerald-400 font-bold mb-1.5 uppercase">
                      STRENGTHS
                    </div>
                    <ul className="text-xs text-ink-mid space-y-1">
                      {a.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass rounded-xl p-3 border border-crimson/20">
                    <div className="text-[10px] font-head tracking-wider text-crimson-bright font-bold mb-1.5 uppercase">
                      WEAKNESSES
                    </div>
                    <ul className="text-xs text-ink-mid space-y-1">
                      {a.weaknesses.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-[11px] text-ink-low mt-4 pt-3 border-t border-white/5 font-mono">
                  CANON CITATION — {a.evidence}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* POWER GROWTH TIMELINE */}
        <section>
          <SectionLabel>Canonical Power Growth Timeline</SectionLabel>
          <div className="mt-6 relative pl-6 space-y-6 border-l border-purple/30">
            {c.growth.map((g) => (
              <div key={g.id} className="relative">
                <div
                  className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-void"
                  style={{ background: c.emblemColor, boxShadow: `0 0 14px ${c.emblemColor}` }}
                />
                <h4 className="font-head text-base font-bold text-ink-hi">{g.label}</h4>
                <p className="text-sm text-ink-mid mt-0.5">{g.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* THE ARCHIVE: FEATS & CANON ARTIFACTS */}
        <section>
          <SectionLabel>The Canon Archive</SectionLabel>
          <p className="text-sm text-ink-mid mt-1 mb-6">
            Paraphrased citations and verified feats from official source material.
          </p>
          <div className="space-y-3">
            {c.archive.map((entry) => (
              <div key={entry.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4 border border-white/5">
                <span className="text-[10px] font-head font-bold tracking-wider px-3 py-1 rounded-full glass h-fit text-purple-bright shrink-0 border border-purple/30">
                  {entry.category.toUpperCase()}
                </span>
                <div className="flex-1">
                  <h4 className="font-head font-bold text-ink-hi text-base">{entry.title}</h4>
                  <p className="text-sm text-ink-mid mt-1 leading-relaxed">{entry.description}</p>
                  <p className="text-[11px] text-ink-low mt-2 font-mono">SOURCE — {entry.source}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BATTLE HISTORY */}
        <section>
          <SectionLabel>Historical Battle Log</SectionLabel>
          <div className="flex gap-6 mt-4 mb-6">
            <StatPill label="Wins" value={wins} color="#34D399" />
            <StatPill label="Losses" value={losses} color="#FB7185" />
            <StatPill label="Draws" value={draws} color="#A79FC9" />
          </div>
          <div className="glass rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/5">
            {c.battleHistory.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <span className="font-head font-bold text-ink-hi text-base">{b.opponent}</span>
                  <span className="text-ink-low ml-3 text-xs">{b.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-ink-mid font-mono">{b.difficulty}</span>
                  <span className={`font-head text-xs font-bold px-2.5 py-0.5 rounded-full border ${OUTCOME_COLOR[b.outcome]}`}>
                    {b.outcome.toUpperCase()}
                  </span>
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
      <h2 className="font-display text-xs tracking-[0.25em] text-purple-bright font-bold">{children.toUpperCase()}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-purple/40 to-transparent" />
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4 border border-white/5">
      <div className="text-[10px] font-head font-bold tracking-wider text-ink-low mb-1 uppercase">{label}</div>
      <div className="text-sm font-semibold text-ink-hi">{value || 'Unknown'}</div>
    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-2xl px-5 py-3 border border-white/5 text-center min-w-[80px]">
      <div className="font-display text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] font-head tracking-wider text-ink-low uppercase">{label}</div>
    </div>
  )
}
