/*
  MISSION MAP
  The six sessions as connected levels of a game.
  • Desktop: a winding route with glowing nodes.
  • Phone: a vertical path.
  Click a mission to see its briefing below the map.
*/
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sessions } from './sessions.js'
import { useProgress } from './ProgressContext.jsx'
import { MISSION_XP, SECTIONS, missionMeta, missionProgress, missionStates, isLive } from './game.js'
import { Icon } from './GameUI.jsx'

// Node positions on the route (percent of the map), for up to 6 missions.
const SPOTS = [
  [8, 70],
  [24, 35],
  [41, 63],
  [58, 30],
  [74, 60],
  [90, 28],
]
const ROUTE =
  'M80 308 C 150 300, 170 160, 240 154 S 350 275, 410 277 S 520 140, 580 132 S 690 260, 740 264 S 850 130, 900 123'

const STATE_LABEL = { done: 'Completed', current: 'Current mission', open: 'Available', soon: 'Awaiting briefing' }

export default function MissionMap() {
  const { progress } = useProgress()
  const states = missionStates(progress.awards)
  const firstPick = sessions.find((s) => states[s.id] === 'current') ?? sessions[0]
  const [selectedId, setSelectedId] = useState(firstPick.id)
  const selected = sessions.find((s) => s.id === selectedId) ?? sessions[0]

  // How far the glowing "done" part of the route reaches.
  const doneUntil = sessions.slice(0, 6).filter((s) => states[s.id] === 'done').length
  const routeDone = doneUntil > 0 ? Math.min(1, doneUntil / 5) : 0

  return (
    <section id="map" className="map-section" aria-labelledby="map-title">
      <div className="section-head-row">
        <div>
          <p className="eyebrow">Semester campaign</p>
          <h2 id="map-title">Mission Map</h2>
        </div>
        <ul className="map-legend">
          <li><span className="legend-dot is-done" />Completed</li>
          <li><span className="legend-dot is-current" />Current</li>
          <li><span className="legend-dot is-soon" />Awaiting briefing</li>
        </ul>
      </div>

      <div className="map-board">
        <div className="map-canvas">
          <svg className="map-route" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="route-done" x1="0" x2="1">
                <stop offset="0" stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <path d={ROUTE} className="route-base" />
            <path d={ROUTE} className="route-dash" />
            {routeDone > 0 && (
              <path d={ROUTE} className="route-done" pathLength="1" strokeDasharray={`${routeDone} 1`} />
            )}
          </svg>

          {sessions.slice(0, 6).map((s, i) => {
            const meta = missionMeta(s)
            const state = states[s.id]
            const [x, y] = SPOTS[i]
            return (
              <button
                key={s.id}
                type="button"
                className={`map-node is-${state} ${selectedId === s.id ? 'is-selected' : ''}`}
                style={{ left: `${x}%`, top: `${y}%`, '--accent': meta.accent }}
                onClick={() => setSelectedId(s.id)}
                aria-pressed={selectedId === s.id}
                aria-label={`Mission ${s.number}: ${s.title} — ${STATE_LABEL[state]}`}
              >
                <span className="map-node-orb">
                  <Icon name={state === 'done' ? 'check' : meta.icon} size={state === 'current' ? 34 : 28} />
                </span>
                <span className="map-node-label">
                  <span className="map-node-num">Mission {String(s.number).padStart(2, '0')}</span>
                  <span className="map-node-name">{meta.short}</span>
                  <span className="map-node-state">{STATE_LABEL[state]}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Phone layout: a vertical path */}
        <ol className="map-path">
          {sessions.map((s) => {
            const meta = missionMeta(s)
            const state = states[s.id]
            const p = missionProgress(s, progress.awards)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`path-row is-${state} ${selectedId === s.id ? 'is-selected' : ''}`}
                  style={{ '--accent': meta.accent }}
                  onClick={() => setSelectedId(s.id)}
                  aria-pressed={selectedId === s.id}
                >
                  <span className="map-node-orb">
                    <Icon name={state === 'done' ? 'check' : meta.icon} size={22} />
                  </span>
                  <span className="path-text">
                    <span className="map-node-num">Mission {String(s.number).padStart(2, '0')} · {STATE_LABEL[state]}</span>
                    <span className="map-node-name">{isLive(s) ? s.title : meta.short}</span>
                    <span className="map-node-state">
                      {isLive(s) ? `${p.count} of ${p.total} sections · ${p.earned} XP` : 'Placeholder'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <MissionBriefing session={selected} state={states[selected.id]} />
    </section>
  )
}

function MissionBriefing({ session, state }) {
  const { progress } = useProgress()
  const meta = missionMeta(session)
  const p = missionProgress(session, progress.awards)
  const live = isLive(session)
  const cta = { done: 'Replay mission', current: 'Start mission', open: 'Start mission', soon: 'View placeholder' }[state]

  return (
    <div className={`briefing is-${state}`} style={{ '--accent': meta.accent }} aria-live="polite">
      <div className="briefing-main">
        <p className="briefing-kicker">
          Mission {String(session.number).padStart(2, '0')} · {STATE_LABEL[state]}
        </p>
        <h3>{session.title}</h3>
        <p className="briefing-topic">{session.topic}</p>
        <p className="briefing-speaker">
          {session.speaker}
          {session.organisation ? ` · ${session.organisation}` : ''}
          {session.date ? ` · ${session.date}` : ''}
        </p>
        <ul className="briefing-sections" aria-label="Mission sections">
          {SECTIONS.map((sec) => {
            const done = p.cleared.includes(sec.key)
            return (
              <li key={sec.key} className={done ? 'is-done' : live ? '' : 'is-soon'}>
                {done && <Icon name="check" size={14} stroke={3} />}
                {sec.label}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="briefing-side">
        <p className="briefing-xp">
          {live ? (
            <>
              <strong>{p.earned}</strong> / {MISSION_XP} XP earned
            </>
          ) : (
            'XP unlocks when content is added'
          )}
        </p>
        <Link to={`/session/${session.id}`} className={`button ${state === 'soon' ? 'button-ghost' : 'button-glow'}`}>
          {cta} <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  )
}
