// The Citadel Web Audio Synthesizer
// Provides synthesized sci-fi UI sound effects with 0 external asset latency and zero broken links.

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('citadel_sound_enabled')
      this.enabled = stored !== 'false'
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(value: boolean): void {
    this.enabled = value
    if (typeof window !== 'undefined') {
      localStorage.setItem('citadel_sound_enabled', value ? 'true' : 'false')
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled)
    if (this.enabled) {
      this.playBeep(660, 0.08, 'triangle')
    }
    return this.enabled
  }

  /** Subtle futuristic UI hover tone */
  public playHover(): void {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /** Modern holographic button click */
  public playClick(): void {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(520, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.06)
    } catch {
      // Ignore
    }
  }

  /** Arena battle clash / energy strike */
  public playClash(): void {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime

      // Low impact sub-boom
      const osc1 = this.ctx.createOscillator()
      const gain1 = this.ctx.createGain()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(150, now)
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.35)
      gain1.gain.setValueAtTime(0.09, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc1.connect(gain1)
      gain1.connect(this.ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.35)

      // Laser energy zap
      const osc2 = this.ctx.createOscillator()
      const gain2 = this.ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1200, now)
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.2)
      gain2.gain.setValueAtTime(0.05, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc2.connect(gain2)
      gain2.connect(this.ctx.destination)
      osc2.start(now)
      osc2.stop(now + 0.2)
    } catch {
      // Ignore
    }
  }

  /** Victory chime for arena winner */
  public playVictory(): void {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)

        gain.gain.setValueAtTime(0.05, now + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.35)
      })
    } catch {
      // Ignore
    }
  }

  /** Power signature scanner sound */
  public playScan(): void {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.linearRampToValueAtTime(900, now + 0.15)
      osc.frequency.linearRampToValueAtTime(600, now + 0.3)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {
      // Ignore
    }
  }

  private playBeep(freq: number, duration: number, type: OscillatorType = 'sine'): void {
    this.initCtx()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine()
