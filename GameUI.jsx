/*
  GAME UI PIECES
  Small reusable building blocks for the game look:
    MissionIcon  — the icon for each mission
    Medal        — badge medal (locked / unlocked)
    useCountUp   — makes a number roll up when it changes
    FillBar      — a progress bar that visibly fills
    Confetti     — a short, light confetti burst (CSS only)
*/
import { useEffect, useRef, useState } from 'react'

const PATHS = {
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m14 4-4 16" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M12 7.5v4M12 11.5 6.5 16M12 11.5l5.5 4.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  rocket: (
    <>
      <path d="M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2" />
      <path d="M9 15l-3-3c1.5-4 5-8.5 12-9-.5 7-5 10.5-9 12z" />
      <circle cx="15" cy="9" r="1.6" />
    </>
  ),
  crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  medal: (
    <>
      <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
      <path d="M8.2 13.9 7 22l5-3 5 3-1.2-8.1" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  edit: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  sword: <path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />,
}

export function Icon({ name, size = 24, stroke = 2, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.compass}
    </svg>
  )
}

export const MissionIcon = (props) => <Icon {...props} />

export function Medal({ unlocked, size = 'md' }) {
  return (
    <span className={`medal medal-${size} ${unlocked ? 'is-unlocked' : ''}`}>
      <Icon name="medal" size={size === 'lg' ? 34 : size === 'sm' ? 18 : 26} />
    </span>
  )
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Rolls a number from its previous value to the new one.
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = from.current
    if (start === target || reduceMotion()) {
      from.current = target
      setValue(target)
      return
    }
    let frame
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(start + (target - start) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
      else from.current = target
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

// A bar that fills from 0 on first view, then glides to new values.
export function FillBar({ pct, label, className = '', color }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(pct))
    return () => cancelAnimationFrame(id)
  }, [pct])
  return (
    <div
      className={`fillbar ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="fillbar-fill" style={{ width: `${shown}%`, ...(color ? { background: color } : {}) }} />
    </div>
  )
}

const CONFETTI_COLORS = ['#8B5CF6', '#3B82F6', '#2DD4BF', '#FCD34D', '#A78BFA', '#F9A8D4']

export function Confetti({ pieces = 70 }) {
  const [items] = useState(() =>
    Array.from({ length: pieces }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.6 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 160,
      rotate: Math.random() * 720,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      wide: Math.random() > 0.5,
    })),
  )
  if (reduceMotion()) return null
  return (
    <div className="confetti" aria-hidden="true">
      {items.map((c, i) => (
        <span
          key={i}
          style={{
            left: `${c.left}%`,
            background: c.color,
            width: c.wide ? 10 : 6,
            height: c.wide ? 6 : 12,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            '--drift': `${c.drift}px`,
            '--spin': `${c.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
