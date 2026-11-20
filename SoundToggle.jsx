/*
  SOUND TOGGLE
  Speaker button that mutes / unmutes all game sound effects.
  Shown in the top bar and on the title screen.
*/
import { useEffect, useState } from 'react'
import { isMuted, setMuted, onMuteChange, playSound } from './sound.js'

export default function SoundToggle({ withLabel = false }) {
  const [muted, setLocal] = useState(isMuted())
  useEffect(() => onMuteChange(setLocal), [])
  function toggle() {
    const next = !muted
    setMuted(next)
    if (!next) playSound('place')
  }
  const label = muted ? 'Sound off. Turn sound on' : 'Sound on. Mute sound'
  return (
    <button type="button" className={`sound-toggle${muted ? ' is-muted' : ''}`} onClick={toggle} aria-pressed={muted} aria-label={label} title={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" />
        {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />}
      </svg>
      {withLabel && <span>{muted ? 'Sound off' : 'Sound on'}</span>}
    </button>
  )
}
