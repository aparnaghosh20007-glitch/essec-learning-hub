/*
  REWARD LAYER
  Shows the pop-ups the game sends: "+XP" toasts, badge unlocks and
  level-up celebrations. Lives once in App.jsx, above every page.
*/
import { useEffect, useRef } from 'react'
import { useProgress } from './ProgressContext.jsx'
import { Confetti, Icon, Medal } from './GameUI.jsx'
import { playSound } from './sound.js'

// Calls onDone after `ms`, even if the parent re-renders meanwhile.
function useAutoClose(onDone, ms) {
  const ref = useRef(onDone)
  useEffect(() => {
    ref.current = onDone
  })
  useEffect(() => {
    const t = setTimeout(() => ref.current(), ms)
    return () => clearTimeout(t)
  }, [ms])
}

function XpToast({ event, onDone }) {
  useAutoClose(onDone, 2800)
  useEffect(() => playSound('xp'), [])
  return (
    <div className="toast toast-xp" role="status">
      <span className="toast-xp-amount">+{event.amount} XP</span>
      <span className="toast-xp-label">{event.label}</span>
    </div>
  )
}

function BadgeToast({ event, onDone }) {
  useAutoClose(onDone, 5200)
  useEffect(() => playSound('badge'), [])
  return (
    <div className="toast toast-badge" role="status">
      <Confetti pieces={40} />
      <Medal unlocked size="lg" />
      <div>
        <p className="toast-kicker">Badge unlocked</p>
        <p className="toast-title">{event.badge.name}</p>
        <p className="toast-text">{event.badge.desc}</p>
      </div>
      <button type="button" className="toast-close" onClick={onDone} aria-label="Close">×</button>
    </div>
  )
}

function LevelUp({ event, onDone }) {
  const ref = useRef(onDone)
  useEffect(() => {
    ref.current = onDone
  })
  useEffect(() => playSound('level'), [])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && ref.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <div className="levelup-backdrop" onClick={onDone}>
      <Confetti pieces={110} />
      <div
        className="levelup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="levelup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="toast-kicker">Level up</p>
        <div className="levelup-number">{event.level}</div>
        <h2 id="levelup-title">{event.name}</h2>
        <p className="muted">You reached level {event.level}. Keep the quest going!</p>
        <button type="button" className="button button-primary button-large" onClick={onDone} autoFocus>
          Keep going <Icon name="arrow" size={18} />
        </button>
      </div>
    </div>
  )
}

export default function RewardLayer() {
  const { events, dismissEvent } = useProgress()
  const toasts = events.filter((e) => e.type !== 'level')
  const level = events.find((e) => e.type === 'level')

  return (
    <>
      <div className="toast-stack" aria-live="polite">
        {toasts.slice(-4).map((e) =>
          e.type === 'badge' ? (
            <BadgeToast key={e.id} event={e} onDone={() => dismissEvent(e.id)} />
          ) : (
            <XpToast key={e.id} event={e} onDone={() => dismissEvent(e.id)} />
          ),
        )}
      </div>
      {level && <LevelUp key={level.id} event={level} onDone={() => dismissEvent(level.id)} />}
    </>
  )
}
