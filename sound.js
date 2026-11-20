/*
  SOUND EFFECTS
  Short synthesised cues (no audio files to download):
    good, bad, place, power, xp, badge, level, start
  Sound is ON by default and can be muted from the speaker button in the
  top bar (and on the title screen). The choice is remembered in this
  browser only; it is separate from game progress.
  Browsers only allow sound after the player has clicked or tapped,
  which is always the case for these cues.
*/
const KEY = 'session-lab-sound'
let ctx = null
const listeners = new Set()

function readMuted() {
  try {
    return localStorage.getItem(KEY) === 'off'
  } catch {
    return false
  }
}
let muted = readMuted()

export function isMuted() {
  return muted
}

export function setMuted(value) {
  muted = value
  try {
    localStorage.setItem(KEY, value ? 'off' : 'on')
  } catch {
    /* storage unavailable: the choice lasts until the page closes */
  }
  listeners.forEach((fn) => fn(muted))
}

export function onMuteChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function audio() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// One note: frequency (Hz), start offset and length (seconds), wave shape, loudness.
function tone(ac, freq, at, len, type = 'sine', vol = 0.06, slideTo = null) {
  const t = ac.currentTime + at
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + len)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + len)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + len + 0.02)
}

const CUES = {
  good: (ac) => {
    tone(ac, 660, 0, 0.12, 'triangle')
    tone(ac, 990, 0.08, 0.18, 'triangle')
  },
  bad: (ac) => {
    tone(ac, 220, 0, 0.22, 'sawtooth', 0.035, 140)
  },
  place: (ac) => tone(ac, 520, 0, 0.07, 'square', 0.025),
  power: (ac) => tone(ac, 300, 0, 0.25, 'sine', 0.05, 900),
  start: (ac) => {
    tone(ac, 392, 0, 0.14, 'triangle')
    tone(ac, 523, 0.1, 0.14, 'triangle')
    tone(ac, 784, 0.2, 0.24, 'triangle')
  },
  xp: (ac) => {
    tone(ac, 880, 0, 0.08, 'square', 0.025)
    tone(ac, 1320, 0.06, 0.12, 'square', 0.025)
  },
  badge: (ac) => [523, 659, 784, 1047].forEach((f, i) => tone(ac, f, i * 0.09, 0.3, 'triangle', 0.05)),
  level: (ac) => [392, 523, 659, 784, 1047].forEach((f, i) => tone(ac, f, i * 0.11, 0.4, 'triangle', 0.06)),
}

export function playSound(name) {
  if (muted || !CUES[name]) return
  try {
    const ac = audio()
    if (ac) CUES[name](ac)
  } catch {
    /* sound is optional: ignore any audio error */
  }
}
