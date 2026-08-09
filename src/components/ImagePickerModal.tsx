import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, X, ExternalLink, Check, Sparkles, Plus, Link2 } from 'lucide-react'
import type { Character } from '../types/character'
import { getCharacterImageOptions, getPinterestSearchUrl } from '../lib/imageLibrary'
import { sound } from '../lib/soundFx'

interface ImagePickerModalProps {
  character: Character
  isOpen: boolean
  onClose: () => void
  onSaveImage: (newImageUrl: string) => void
}

export default function ImagePickerModal({ character, isOpen, onClose, onSaveImage }: ImagePickerModalProps) {
  const options = getCharacterImageOptions(character.id, character.name)
  const [selectedUrl, setSelectedUrl] = useState(character.imageUrl || options[0]?.url || '')
  const [customInputUrl, setCustomInputUrl] = useState('')
  const [previewError, setPreviewError] = useState(false)

  if (!isOpen) return null

  const pinterestUrl = getPinterestSearchUrl(character.name, character.universe)

  const handleSelect = (url: string) => {
    sound.playClick()
    setSelectedUrl(url)
    setPreviewError(false)
  }

  const handleApplyCustom = () => {
    if (!customInputUrl.trim()) return
    sound.playVictory()
    onSaveImage(customInputUrl.trim())
    onClose()
  }

  const handleConfirm = () => {
    sound.playVictory()
    onSaveImage(selectedUrl)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-void/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple/40 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple/20 border border-purple/40 flex items-center justify-center text-purple-bright">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-hi">CHOOSE CHARACTER ART</h3>
                <p className="text-xs text-ink-low font-head tracking-wider">
                  Select a Pinterest render or paste any custom image URL for {character.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass hover:text-crimson-bright transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pinterest Direct Search Banner */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-red-600/20 via-purple/20 to-transparent border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-head font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Direct Pinterest Search
              </span>
              <p className="text-xs text-ink-mid mt-0.5">
                Browse thousands of HD aesthetic pins & fan art for {character.name} on Pinterest.
              </p>
            </div>
            <a
              href={pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-head font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              <span>Search on Pinterest</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Preset HD Render Options */}
          <div className="mt-6">
            <label className="text-xs font-head font-bold tracking-wider text-ink-low uppercase block mb-3">
              PRESET HIGH-DEFINITION ART OPTIONS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {options.map((opt, i) => {
                const isSelected = selectedUrl === opt.url
                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(opt.url)}
                    className={`group relative rounded-2xl overflow-hidden glass border cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-purple ring-2 ring-purple shadow-glow'
                        : 'border-white/10 hover:border-purple/50'
                    }`}
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={opt.url}
                        alt={opt.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple text-void flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-void/80 backdrop-blur-md text-[9px] font-head font-bold text-purple-bright border border-white/10">
                        {opt.source}
                      </div>
                    </div>
                    <div className="p-2 text-[11px] font-head font-bold text-ink-hi truncate">{opt.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom Pinterest / Direct URL Input */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <label className="text-xs font-head font-bold tracking-wider text-ink-low uppercase block mb-2">
              PASTE CUSTOM PINTEREST / WEB IMAGE URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mid" />
                <input
                  value={customInputUrl}
                  onChange={(e) => setCustomInputUrl(e.target.value)}
                  placeholder="Paste direct Pinterest image URL (e.g. https://i.pinimg.com/...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-xs text-ink-hi placeholder:text-ink-low focus:outline-none focus:glow-ring font-mono"
                />
              </div>
              <button
                onClick={handleApplyCustom}
                disabled={!customInputUrl.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple text-void font-head font-bold text-xs hover:scale-105 transition-transform disabled:opacity-40"
              >
                APPLY URL
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl glass text-ink-mid hover:text-ink-hi font-head font-bold text-xs"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple via-blue to-crimson text-void font-head font-bold text-xs hover:scale-105 transition-transform shadow-glow"
            >
              SET ACTIVE ARTWORK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
