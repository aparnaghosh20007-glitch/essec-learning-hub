/*
  SESSION CARD ("mission file")
  The card shown on the homepage for each session:
  title, topic, learning activities and mission progress.
*/
import { Link } from 'react-router-dom'
import { useProgress } from './ProgressContext.jsx'
import { missionMeta, missionProgress, missionStates } from './game.js'
import { FillBar, Icon } from './GameUI.jsx'

export default function SessionCard({ session }) {
  const { progress } = useProgress()
  const meta = missionMeta(session)
  const state = missionStates(progress.awards)[session.id]
  const p = missionProgress(session, progress.awards)
  const upcoming = state === 'soon'

  const badge = {
    done: { label: 'Completed', className: 'badge-done' },
    current: { label: 'Current mission', className: 'badge-ready' },
    open: { label: 'Ready to play', className: 'badge-ready' },
    soon: { label: 'Placeholder', className: 'badge-upcoming' },
  }[state]

  return (
    <article className={`session-card is-${state}`} style={{ '--accent': meta.accent }}>
      <div className="session-card-top">
        <span className="session-card-icon">
          <Icon name={state === 'done' ? 'check' : meta.icon} size={22} />
        </span>
        <span className="session-number">{String(session.number).padStart(2, '0')}</span>
        <span className={`badge ${badge.className}`}>{badge.label}</span>
      </div>

      <h3>{session.title}</h3>
      <p className="session-topic">{session.topic}</p>

      <div className="session-activities">
        <p className="mini-label">Learning activities</p>
        <ul>
          {session.activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      {!upcoming && (
        <div className="session-card-progress">
          <FillBar pct={Math.round((p.count / p.total) * 100)} label={`Mission ${session.number} sections cleared`} />
          <span>
            {p.count}/{p.total} sections · {p.earned} XP
          </span>
        </div>
      )}

      <Link to={`/mission/${session.id}`} className={`button ${upcoming ? 'button-ghost' : 'button-primary'}`}>
        {upcoming ? 'View district' : state === 'done' ? 'Replay mission' : 'Enter mission'}
        <span aria-hidden="true"> →</span>
      </Link>
    </article>
  )
}
