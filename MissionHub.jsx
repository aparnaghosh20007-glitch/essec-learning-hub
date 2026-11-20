/*
  MISSION HUB (/mission/:id)
  The district's tower: five floors (Learn → Explore → Play → Challenge →
  Boss on the rooftop). Each floor opens when the one below is cleared.
  Also links to the Intel Archive (the original session page) and the
  classic quiz in its original format.
*/
import { Link, useParams } from 'react-router-dom'
import Scene from './Scene.jsx'
import NotFound from './NotFound.jsx'
import { getSession } from './sessions.js'
import { getMission } from './missions.js'
import { useProgress } from './ProgressContext.jsx'
import { SECTIONS, XP, MISSION_XP, missionMeta, missionProgress, sectionCleared } from './game.js'
import { Icon, FillBar } from './GameUI.jsx'
import { AriaSays } from './Characters.jsx'

export function floorStatus(sessionId, awards, key) {
  if (sectionCleared(awards, sessionId, key)) return 'done'
  const i = SECTIONS.findIndex((s) => s.key === key)
  const open = SECTIONS.slice(0, i).every((s) => sectionCleared(awards, sessionId, s.key))
  return open ? 'now' : 'locked'
}

const FLOOR_LABEL = { learn: '1', explore: '2', play: '3', challenge: '4', boss: 'R' }
const STATUS = { done: 'Cleared', now: 'Open', locked: 'Locked' }

export const isRealSpeaker = (s) => s.speaker && !/add name|to be confirmed/i.test(s.speaker)

export default function MissionHub() {
  const { sessionId } = useParams()
  const session = getSession(sessionId)
  const mission = getMission(sessionId)
  const { progress } = useProgress()
  if (!session) return <NotFound />
  const meta = missionMeta(session)
  const num = String(session.number).padStart(2, '0')

  // ---------- Offline district (placeholder session) ----------
  if (!mission) {
    return (
      <Scene theme="dim" lit={0.05} className="page-scene">
        <div className="container hub-offline">
          <p className="engine-kicker">District {num} · offline</p>
          <h1>{meta.district}</h1>
          <p className="hub-sub">Mission {num} · {session.title}</p>
          {session.organisation && <p className="muted">Organisation: {session.organisation}</p>}
          <AriaSays mood="worry" size={80} className="hub-aria">No signal from this district yet. It powers on once the verified session materials are added.</AriaSays>
          <div className="glass offline-panel">
            <p className="offline-signal" aria-hidden="true">
              <span /> <span /> <span />
            </p>
            <h2>Awaiting verified session content</h2>
            <p>
              This district powers on once the session’s verified materials (slides or official notes) are added. Nothing about this
              session or its speaker has been made up.
            </p>
            <div className="engine-actions">
              <Link to={`/session/${session.id}`} className="button button-ghost">Open the placeholder page</Link>
              <Link to="/city" className="button button-primary">Back to the city</Link>
            </div>
          </div>
        </div>
      </Scene>
    )
  }

  const mp = missionProgress(session, progress.awards)
  const pct = Math.round((mp.earned / MISSION_XP) * 100)
  const nextKey = SECTIONS.find((s) => floorStatus(session.id, progress.awards, s.key) === 'now')?.key

  return (
    <Scene theme={mission.theme} lit={0.25 + 0.15 * mp.count} className="page-scene">
      <div className="container hub" style={{ '--accent': meta.accent }}>
        <header className="hub-head">
          <Link to="/city" className="back-link">← Neo Metro</Link>
          <p className="engine-kicker">District {num} · {mp.complete ? 'signal restored' : 'mission'}</p>
          <h1>{meta.district}</h1>
          <p className="hub-sub">Mission {num} · {session.title}</p>
          {isRealSpeaker(session) && (
            <p className="muted">
              {session.speaker}
              {session.organisation ? ` · ${session.organisation}` : ''} · {session.date}
            </p>
          )}
          <p className="hub-note">{mission.sourceNote}</p>
        </header>

        <div className="hub-grid">
          <ol className="tower" aria-label="Mission floors">
            <li className="tower-spire" aria-hidden="true"><span className="tower-beacon" /></li>
            {[...SECTIONS].reverse().map((sec) => {
              const st = floorStatus(session.id, progress.awards, sec.key)
              const floor = mission.floors[sec.key]
              const inner = (
                <>
                  <span className="floor-num">
                    <span>{FLOOR_LABEL[sec.key]}</span>
                    <small>{sec.key === 'boss' ? 'ROOF' : 'FLOOR'}</small>
                  </span>
                  <span className="floor-body">
                    <span className="floor-kicker">
                      {sec.label} · {STATUS[st]} · {sec.key === 'boss' ? 'up to ' : ''}{XP[sec.key]} XP
                    </span>
                    <span className="floor-name">{floor.name}</span>
                    <span className="floor-desc">{floor.desc}</span>
                  </span>
                  <span className="floor-windows" aria-hidden="true">
                    {[0, 1, 2, 3].map((k) => <span key={k} />)}
                  </span>
                </>
              )
              return (
                <li key={sec.key} className={`floor is-${st} ${sec.key === nextKey ? 'is-next' : ''}`}>
                  {st === 'locked' ? (
                    <div className="floor-inner" aria-disabled="true">{inner}</div>
                  ) : (
                    <Link to={`/mission/${session.id}/${sec.key}`} className="floor-inner">{inner}</Link>
                  )}
                </li>
              )
            })}
            <li className="tower-base" aria-hidden="true" />
          </ol>

          <aside className="hub-side">
            <AriaSays mood={nextKey ? 'happy' : 'cheer'} size={80} className="hub-aria">
              {nextKey ? `${mission.floors[nextKey].name} is open. I'll meet you there.` : 'Every floor is cleared. Time for your debrief.'}
            </AriaSays>
            <section className="glass">
              <p className="hub-xp">
                <strong>Mission progress</strong>
                <span>{mp.earned} / {MISSION_XP} XP</span>
              </p>
              <FillBar pct={pct} label="Mission XP" />
              <p className="muted small">{mp.count} of 5 floors cleared · reflection +{XP.reflection} XP after the mission</p>
              {nextKey ? (
                <Link to={`/mission/${session.id}/${nextKey}`} className="button button-gold button-block">
                  {mp.count ? 'Continue' : 'Start'} · {mission.floors[nextKey].name} <Icon name="arrow" size={18} />
                </Link>
              ) : (
                <Link to={`/mission/${session.id}/complete`} className="button button-gold button-block">
                  Mission debrief and reflection <Icon name="arrow" size={18} />
                </Link>
              )}
            </section>

            {mission.intel && (
              <section className="glass intel">
                <h2>Client file</h2>
                {mission.intel.map((it) => (
                  <p key={it.label}>
                    <strong>{it.label}:</strong> {it.text} <span className="source-tag">({it.source})</span>
                  </p>
                ))}
              </section>
            )}

            <section className="glass">
              <h2>Original content</h2>
              <p className="muted small">Everything from the session, unchanged.</p>
              <div className="stack">
                <Link to={`/session/${session.id}`} className="button button-ghost button-block">
                  Intel Archive · notes, takeaways, reflection
                </Link>
                <Link to={`/session/${session.id}#game-title`} className="button button-ghost button-block">
                  Classic quiz · original format
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Scene>
  )
}
