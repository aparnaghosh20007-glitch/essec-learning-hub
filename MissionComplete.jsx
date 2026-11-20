/*
  MISSION COMPLETE (/mission/:id/complete)
  The debrief after all five floors: XP tally, current rank, unlocked
  rewards, and the reflection ("captain's log") that earns +50 XP at
  30 words. The reflection is the same one saved on the session page
  and in the learning journal.
*/
import Avatar from './Avatar.jsx'
import { Aria } from './Characters.jsx'
import { Link, Navigate, useParams } from 'react-router-dom'
import Scene from './Scene.jsx'
import NotFound from './NotFound.jsx'
import ReflectionBox from './ReflectionBox.jsx'
import { getSession } from './sessions.js'
import { getMission } from './missions.js'
import { useProgress } from './ProgressContext.jsx'
import { SECTIONS, XP, AVATAR, BADGES, missionMeta, missionProgress, isItemUnlocked } from './game.js'
import { Confetti, FillBar, Icon, Medal } from './GameUI.jsx'

export default function MissionComplete() {
  const { sessionId } = useParams()
  const session = getSession(sessionId)
  const mission = getMission(sessionId)
  const { progress, level, xp, badges, unlockCtx, avatar, displayName } = useProgress()
  if (!session) return <NotFound />
  if (!mission) return <Navigate to={`/mission/${sessionId}`} replace />
  const mp = missionProgress(session, progress.awards)
  if (!mp.complete) return <Navigate to={`/mission/${sessionId}`} replace />

  const meta = missionMeta(session)
  const num = String(session.number).padStart(2, '0')
  const tally = SECTIONS.map((s) => ({ label: `${mission.floors[s.key].name} · ${s.label}`, xp: progress.awards[`${s.key}:${session.id}`] ?? 0, max: XP[s.key] }))
  const reflectionXp = progress.awards[`reflection:${session.id}`]
  const wardrobe = [...AVATAR.outfits, ...AVATAR.accessories, ...AVATAR.frames].filter((it) => it.test && isItemUnlocked(it, unlockCtx))
  const myBadges = BADGES.filter((b) => badges.includes(b.id))

  return (
    <Scene theme={mission.theme} lit={1} className="page-scene scene-reward">
      <Confetti pieces={90} />
      <div className="container complete-page" style={{ '--accent': meta.accent }}>
        <header className="complete-head">
          <p className="engine-kicker">District {num} · signal restored</p>
          <h1 className="complete-title">MISSION COMPLETE</h1>
          <p className="hub-sub">{session.title} · {meta.district} is back online</p>
          <div className="complete-cast" aria-hidden="true">
            <span className="complete-beam" />
            <span className="complete-pad" />
            <Avatar look={avatar} size={220} variant="bust" className="complete-avatar" />
            <div className="complete-aria">
              <p className="complete-bubble">Brilliant work, {displayName.split(' ')[0]}. The district is shining again.</p>
              <Aria mood="cheer" size={96} />
            </div>
          </div>
        </header>

        <div className="complete-grid">
          <section className="glass">
            <h2 className="panel-kicker gold">XP earned</h2>
            <ul className="tally">
              {tally.map((t) => (
                <li key={t.label}>
                  <span>{t.label}</span>
                  <strong>+{t.xp}{t.xp < t.max ? ` / ${t.max}` : ''}</strong>
                </li>
              ))}
              <li>
                <span>Captain’s log · reflection</span>
                <strong className={reflectionXp ? '' : 'muted'}>{reflectionXp ? `+${reflectionXp}` : 'pending'}</strong>
              </li>
            </ul>
            <p className="tally-total">
              <span>Mission total</span>
              <strong>{mp.earned} XP</strong>
            </p>
          </section>

          <section className="glass rank-card">
            <h2 className="panel-kicker">Your rank</h2>
            <span className="rank-badge">{level.level}</span>
            <p className="rank-name">{level.name}</p>
            <p className="muted small">{xp} XP{level.nextName ? ` · ${level.toNext} XP to ${level.nextName}` : ' · top rank'}</p>
            <FillBar pct={level.pct} label="XP towards next rank" className="fillbar-xp" />
            <p className="muted small">HQ floor {level.level} is yours.</p>
          </section>

          <section className="glass">
            <h2 className="panel-kicker teal">Unlocked so far</h2>
            <ul className="unlock-list">
              {wardrobe.map((it) => (
                <li key={it.id}>
                  <span className="unlock-icon" aria-hidden="true"><Icon name="check" size={14} stroke={3} /></span>
                  <span>
                    <strong>{it.name}</strong>
                    <small>{it.unlock}</small>
                  </span>
                </li>
              ))}
              {myBadges.map((b) => (
                <li key={b.id}>
                  <Medal unlocked size="sm" />
                  <span>
                    <strong>Badge: {b.name}</strong>
                    <small>{b.desc}</small>
                  </span>
                </li>
              ))}
              {!wardrobe.length && !myBadges.length && <li className="muted">Keep climbing to unlock outfits and badges.</li>}
            </ul>
          </section>
        </div>

        <section className="glass captains-log">
          <ReflectionBox
            storageKey={session.id}
            label="Captain’s log · your reflection (+50 XP at 30 words, paid once)"
            placeholder="Write your thoughts here…"
            prompts={[mission.reflection.prompt]}
          />
        </section>

        <div className="engine-actions centered">
          <Link to="/city" className="button button-gold button-large">Return to Neo Metro <Icon name="arrow" size={18} /></Link>
          <Link to="/hq" className="button button-ghost">Equip rewards at HQ</Link>
          <Link to={`/session/${session.id}`} className="button button-ghost">Intel Archive</Link>
        </div>
      </div>
    </Scene>
  )
}
