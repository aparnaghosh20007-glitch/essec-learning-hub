/*
  CITY MAP (/city)
  Neo Metro at night: one district per guest-speaker session, each with its own
  buildings, linked to your HQ by light roads across a wet plaza.
  Districts are dark until their session has content, flicker when live,
  pulse when they are your current mission and glow once completed.
  On phones the map becomes a vertical route.
*/
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import { sessions } from './sessions.js'
import { useProgress } from './ProgressContext.jsx'
import { missionMeta, missionStates, missionProgress, liveSessions, SECTIONS } from './game.js'
import { DailyChallenge, CourseProgress } from './HomeWidgets.jsx'
import SessionCard from './SessionCard.jsx'
import { AriaSays } from './Characters.jsx'

// Where each district stands on the plaza (x %, y % of the map; y is the building's base).
const SPOTS = [
  [15, 72],
  [20, 34],
  [50, 24],
  [80, 34],
  [85, 72],
  [50, 88],
]
const HQ_SPOT = [50, 58]

const STATE_TEXT = {
  done: 'Signal restored',
  current: 'Current mission',
  open: 'Online',
  soon: 'Offline · awaiting verified content',
}

// The skyline of each district (index = session order). Purely decorative.
export function DistrictBuilding({ kind, lit }) {
  const win = (c) => (lit ? c : 'rgba(255,255,255,.07)')
  switch (kind) {
    case 0:
      return (
        <svg viewBox="0 0 200 150" className="district-art" aria-hidden="true">
          <rect x="22" y="70" width="34" height="70" fill="#14306E" />
          <rect x="146" y="58" width="36" height="82" fill="#14306E" />
          <rect x="28" y="78" width="22" height="56" fill={win('rgba(147,197,253,.55)')} className="district-win" />
          <rect x="152" y="66" width="24" height="68" fill={win('rgba(147,197,253,.55)')} className="district-win" />
          <path d="M52 140 Q 52 60 100 60 Q 148 60 148 140 Z" fill="url(#domeFill)" stroke="var(--accent)" strokeWidth="2.5" />
          <path d="M100 60 V 30" stroke="#BFDBFE" strokeWidth="3" />
          <circle cx="100" cy="28" r="4" fill="#BFDBFE" className="district-beacon" />
          <path d="M70 140 Q 70 82 100 76 M130 140 Q 130 82 100 76" stroke="rgba(191,219,254,.45)" strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 1:
      return (
        <svg viewBox="0 0 200 150" className="district-art" aria-hidden="true">
          <rect x="40" y="70" width="30" height="70" fill="#2A1E6E" />
          <rect x="130" y="56" width="32" height="84" fill="#2A1E6E" />
          <path d="M78 140 L 84 22 L 116 22 L 122 140 Z" fill="url(#towerFill)" stroke="var(--accent)" strokeWidth="2" />
          {[34, 50, 66, 82, 98, 114].map((y) => (
            <rect key={y} x="88" y={y} width="24" height="6" fill={win('rgba(240,171,252,.75)')} className="district-win" />
          ))}
          <rect x="46" y="80" width="18" height="52" fill={win('rgba(196,181,253,.4)')} className="district-win" />
          <rect x="136" y="66" width="20" height="66" fill={win('rgba(196,181,253,.4)')} className="district-win" />
          <path d="M100 22 V 0" stroke="#F0ABFC" strokeWidth="3" />
          <circle cx="100" cy="2" r="4" fill="#F43F5E" className="district-beacon" />
        </svg>
      )
    case 2:
      return (
        <svg viewBox="0 0 200 150" className="district-art" aria-hidden="true">
          <rect x="30" y="60" width="34" height="80" fill="#0E3B40" />
          <rect x="84" y="40" width="36" height="100" fill="#0E3B40" />
          <rect x="140" y="70" width="30" height="70" fill="#0E3B40" />
          <path d="M64 80 H 84 M120 64 H 140" stroke={lit ? '#5EEAD4' : 'rgba(94,234,212,.35)'} strokeWidth="3" />
          <rect x="36" y="68" width="22" height="64" fill={win('rgba(94,234,212,.45)')} className="district-win" />
          <rect x="90" y="48" width="24" height="84" fill={win('rgba(94,234,212,.45)')} className="district-win" />
          <rect x="146" y="78" width="18" height="54" fill={win('rgba(94,234,212,.45)')} className="district-win" />
        </svg>
      )
    case 5:
      return (
        <svg viewBox="0 0 200 150" className="district-art" aria-hidden="true">
          <rect x="44" y="84" width="28" height="56" fill="#1A1C40" />
          <rect x="128" y="76" width="28" height="64" fill="#1A1C40" />
          <path d="M84 140 L 92 40 L 100 18 L 108 40 L 116 140 Z" fill="#221E44" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity=".5" />
          <rect x="94" y="56" width="12" height="76" fill={win('rgba(252,211,77,.5)')} className="district-win" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 200 150" className="district-art" aria-hidden="true">
          <rect x="36" y="74" width="34" height="66" fill="#191C40" />
          <rect x="80" y="46" width="42" height="94" fill="#1D2150" />
          <rect x="132" y="84" width="32" height="56" fill="#191C40" />
          <rect x="88" y="54" width="26" height="80" fill={win('rgba(165,180,252,.4)')} className="district-win" />
        </svg>
      )
  }
}

export default function City() {
  const { progress, missionsComplete } = useProgress()
  const states = missionStates(progress.awards)
  const live = liveSessions()
  const lit = live.length ? 0.2 + (0.8 * missionsComplete) / live.length : 0.2
  const spots = sessions.map((_, i) => SPOTS[i % SPOTS.length])
  const current = sessions.find((s) => states[s.id] === 'current') ?? sessions.find((s) => states[s.id] === 'open')
  const allDone = live.length > 0 && live.every((s) => states[s.id] === 'done')

  return (
    <Scene theme="city" lit={lit} className="page-scene">
      <div className="container city-page">
        <header className="page-head">
          <p className="engine-kicker">Neo Metro · city map</p>
          <h1>Restore the city</h1>
          <p className="muted">Each district is one guest-speaker session. Clear its five floors to bring it back online.</p>
        </header>

        <div className="city-map">
          <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
            <defs>
              <radialGradient id="domeFill" cx="50%" cy="100%" r="90%">
                <stop offset="0" stopColor="#93C5FD" stopOpacity=".85" />
                <stop offset="1" stopColor="#1D4ED8" stopOpacity=".15" />
              </radialGradient>
              <linearGradient id="towerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7C4DEB" />
                <stop offset="1" stopColor="#24195F" />
              </linearGradient>
            </defs>
          </svg>
          <div className="city-ground" aria-hidden="true" />
          <svg className="city-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {spots.map(([x, y], i) => {
              const state = states[sessions[i].id]
              const mx = (HQ_SPOT[0] + x) / 2 + (i % 2 ? 6 : -6)
              const my = (HQ_SPOT[1] + y) / 2
              const cls = state === 'done' ? 'route-on' : state === 'current' ? 'route-now' : 'route-off'
              return <path key={i} d={`M${HQ_SPOT[0]} ${HQ_SPOT[1]} Q ${mx} ${my} ${x} ${y - 2}`} className={cls} vectorEffect="non-scaling-stroke" fill="none" />
            })}
          </svg>

          <Link to="/hq" className="city-hq" style={{ '--x': `${HQ_SPOT[0]}%`, '--y': `${HQ_SPOT[1]}%` }}>
            <span className="city-hq-tower" aria-hidden="true">
              <svg viewBox="0 0 100 150">
                <rect x="4" y="80" width="22" height="70" fill="#2A2370" />
                <rect x="74" y="66" width="22" height="84" fill="#2A2370" />
                <path d="M30 150 L 30 30 L 50 14 L 70 30 L 70 150 Z" fill="#3A2E99" stroke="#FCD34D" strokeWidth="2" />
                <rect x="38" y="40" width="24" height="100" fill="rgba(252,211,77,.45)" className="district-win" />
                <path d="M50 14 V 0" stroke="#FCD34D" strokeWidth="3" />
              </svg>
            </span>
            <span className="city-hq-label">Your HQ</span>
          </Link>

          <ol className="district-list">
            {sessions.map((s, i) => {
              const meta = missionMeta(s)
              const state = states[s.id]
              const mp = missionProgress(s, progress.awards)
              const [x, y] = spots[i]
              return (
                <li key={s.id} className={`district is-${state}`} style={{ '--x': `${x}%`, '--y': `${y}%`, '--accent': meta.accent }}>
                  <Link to={`/mission/${s.id}`} className="district-link" aria-label={`District ${s.number}: ${meta.district}, ${meta.short}. ${STATE_TEXT[state]}`}>
                    <span className="district-orb">
                      <span className="district-ring" aria-hidden="true" />
                      <span className="district-pad" aria-hidden="true" />
                      <DistrictBuilding kind={i % 6} lit={state !== 'soon'} />
                    </span>
                    <span className="district-card">
                      <span className="district-num">District {String(s.number).padStart(2, '0')}</span>
                      <span className="district-name">{meta.district}</span>
                      <span className="district-mission">Mission {String(s.number).padStart(2, '0')} · {meta.short}</span>
                      <span className="district-state">{STATE_TEXT[state]}</span>
                      {state !== 'soon' && (
                        <span className="district-pips" aria-hidden="true">
                          {SECTIONS.map((sec) => (
                            <span key={sec.key} className={mp.cleared.includes(sec.key) ? 'is-on' : ''} />
                          ))}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        <AriaSays mood={allDone ? 'cheer' : 'happy'} size={84} className="city-aria">
          {allDone
            ? 'Every live district is back online. New districts open when their sessions are added.'
            : current
              ? `${missionMeta(current).district} is waiting. That's your next mission.`
              : 'Pick a district to start bringing Neo Metro back online.'}
        </AriaSays>

        <div className="city-panels">
          <section className="glass">
            <CourseProgress />
          </section>
          <section className="glass">
            <DailyChallenge />
          </section>
        </div>

        <section className="mission-files" aria-labelledby="files-title">
          <div className="section-head-row">
            <div>
              <p className="engine-kicker">Mission files</p>
              <h2 id="files-title">Guest speaker sessions</h2>
            </div>
            <p className="muted">Sessions 3 to 6 stay offline until their verified materials are added.</p>
          </div>
          <div className="card-grid">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      </div>
    </Scene>
  )
}
