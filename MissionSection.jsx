/*
  MISSION FLOOR (/mission/:id/:section)
  Runs the right game engine for the floor and pays its XP ONCE.
  Replaying a cleared floor is allowed (practice) but pays nothing.
*/
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Scene from './Scene.jsx'
import NotFound from './NotFound.jsx'
import Briefing from './Briefing.jsx'
import SlotPuzzle from './SlotPuzzle.jsx'
import CardTactics from './CardTactics.jsx'
import Scenario from './Scenario.jsx'
import BossBattle from './BossBattle.jsx'
import { getSession } from './sessions.js'
import { getMission } from './missions.js'
import { useProgress } from './ProgressContext.jsx'
import { SECTIONS, XP, BOSS_CLEAR, missionMeta, missionProgress } from './game.js'
import { floorStatus } from './MissionHub.jsx'
import { Icon, Confetti } from './GameUI.jsx'
import { Aria, AriaSays, Static } from './Characters.jsx'

const FLOOR_NO = { learn: 'Floor 1', explore: 'Floor 2', play: 'Floor 3', challenge: 'Floor 4', boss: 'Rooftop' }

export default function MissionSection() {
  const { sessionId, section } = useParams()
  const session = getSession(sessionId)
  const mission = getMission(sessionId)
  const { progress, award, setFlag } = useProgress()
  const navigate = useNavigate()
  const [cleared, setCleared] = useState(null) // { gained, replay }
  const [run, setRun] = useState(0)

  if (!session) return <NotFound />
  if (!mission) return <Navigate to={`/mission/${sessionId}`} replace />
  const sec = SECTIONS.find((s) => s.key === section)
  if (!sec) return <NotFound />
  const status = floorStatus(session.id, progress.awards, sec.key)
  if (status === 'locked' && !cleared) return <Navigate to={`/mission/${sessionId}`} replace />

  const meta = missionMeta(session)
  const floor = mission.floors[sec.key]
  const wasCleared = status === 'done'
  const flags = progress.flags[session.id] ?? {}
  const idx = SECTIONS.findIndex((s) => s.key === sec.key)
  const next = SECTIONS[idx + 1]

  function finish(result = {}) {
    let gained = 0
    if (sec.key === 'boss') {
      gained = null // paid by saveQuizResult inside the battle
      // The rooftop is only claimed with at least half the original questions right.
      if (result.total && result.score / result.total < BOSS_CLEAR && !wasCleared) {
        setCleared({ gained, replay: wasCleared, result, failed: true })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    } else {
      gained = award(`${sec.key}:${session.id}`, XP[sec.key], `${floor.name} cleared`)
    }
    if (sec.key === 'learn' && result.openingCall && !flags.openingCall) setFlag(session.id, 'openingCall', result.openingCall)
    if (sec.key === 'play' && result.perfect) setFlag(session.id, 'playPerfect')
    if (sec.key === 'challenge' && result.perfect) setFlag(session.id, 'challengePerfect')
    setCleared({ gained, replay: wasCleared, result })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let engine = null
  if (sec.key === 'learn') engine = <Briefing content={mission.learn} chapter={mission.chapter} onComplete={finish} />
  if (sec.key === 'explore') engine = <SlotPuzzle content={mission.explore} onComplete={finish} />
  if (sec.key === 'play')
    engine = <CardTactics content={mission.play} startPenalty={!wasCleared && flags.openingCall === 'bad' ? 1 : 0} onComplete={finish} />
  if (sec.key === 'challenge') engine = <Scenario content={mission.challenge} onComplete={finish} />
  if (sec.key === 'boss') engine = <BossBattle session={session} bossName={floor.name === 'The Rooftop' ? 'The Rooftop Boss' : `${floor.name} Guardian`} onComplete={finish} />

  const allDone = missionProgress(session, progress.awards).complete
  const bossXp = progress.awards[`boss:${session.id}`]

  return (
    <Scene
      theme={sec.key === 'boss' ? 'boss' : mission.theme}
      room={sec.key === 'boss' ? 'rooftop' : sec.key === 'learn' ? 'window' : mission.theme === 'lab' ? 'dome' : null}
      lit={0.5}
      className="page-scene"
    >
      <div className="container floor-page" style={{ '--accent': meta.accent }}>
        <nav className="floor-nav" aria-label="Floor navigation">
          <Link to={`/mission/${session.id}`} className="back-link">← {meta.district}</Link>
          <span className="floor-tag">
            {FLOOR_NO[sec.key]} · {sec.label} · {floor.name}
          </span>
          {wasCleared && !cleared && <span className="replay-tag">Replay · practice only, no XP</span>}
        </nav>

        {cleared?.failed ? (
          <section className="clear-panel is-failed" role="status">
            <Static size={110} className="clear-static" title="STATIC still holds the rooftop" />
            <p className="engine-kicker">The boss holds the rooftop</p>
            <h1>{floor.name}</h1>
            <p className="clear-xp is-replay">
              {cleared.result.score} / {cleared.result.total} · you need at least {Math.ceil(cleared.result.total * BOSS_CLEAR)} correct to claim the rooftop
            </p>
            <p className="clear-note">Your score and any XP it earned are saved. Review the answers, then battle again.</p>
            <AriaSays mood="worry" size={64} className="clear-aria">We'll get it next time. The Intel Archive has every answer explained.</AriaSays>
            <div className="engine-actions">
              <button type="button" className="button button-gold button-large" onClick={() => { setCleared(null); setRun((r) => r + 1) }} autoFocus>
                Battle again
              </button>
              <Link to={`/session/${session.id}`} className="button button-ghost">Study the Intel Archive</Link>
              <Link to={`/mission/${session.id}`} className="button button-ghost">Back to the tower</Link>
            </div>
          </section>
        ) : cleared ? (
          <section className="clear-panel" role="status">
            <Confetti pieces={60} />
            <Aria mood="cheer" size={96} className="clear-aria-bot" />
            <p className="engine-kicker">{FLOOR_NO[sec.key]} cleared</p>
            <h1>{floor.name}</h1>
            {sec.key === 'boss' ? (
              <p className="clear-xp">
                Best score saved · boss XP {bossXp ?? 0} / {XP.boss}
              </p>
            ) : cleared.gained > 0 ? (
              <p className="clear-xp">+{cleared.gained} XP</p>
            ) : (
              <p className="clear-xp is-replay">Already cleared · replays are practice, no extra XP</p>
            )}
            {cleared.result?.perfect && sec.key === 'challenge' && <p className="clear-note">Perfect run: best call every time.</p>}
            <div className="engine-actions">
              {allDone ? (
                <button type="button" className="button button-gold button-large" onClick={() => navigate(`/mission/${session.id}/complete`)} autoFocus>
                  Mission complete <Icon name="arrow" size={18} />
                </button>
              ) : next ? (
                <button type="button" className="button button-gold button-large" onClick={() => { setCleared(null); setRun((r) => r + 1); navigate(`/mission/${session.id}/${next.key}`) }} autoFocus>
                  Up to {mission.floors[next.key].name} <Icon name="arrow" size={18} />
                </button>
              ) : null}
              <Link to={`/mission/${session.id}`} className="button button-ghost">Back to the tower</Link>
              <button type="button" className="button button-ghost" onClick={() => { setCleared(null); setRun((r) => r + 1) }}>
                Replay this floor
              </button>
            </div>
          </section>
        ) : (
          <div className="engine" key={`${sec.key}-${run}`}>
            {engine}
          </div>
        )}
      </div>
    </Scene>
  )
}
