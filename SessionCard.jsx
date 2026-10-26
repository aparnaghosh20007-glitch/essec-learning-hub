/*
  SESSION CARD
  The card shown on the homepage for each session.
*/
import { Link } from 'react-router-dom'
import { useProgress } from '../state/ProgressContext.jsx'

export default function SessionCard({ session }) {
  const { isComplete } = useProgress()
  const done = isComplete(session.id)
  const upcoming = session.status === 'upcoming'

  let badge = { label: 'Ready to play', className: 'badge-ready' }
  if (done) badge = { label: 'Completed', className: 'badge-done' }
  else if (upcoming) badge = { label: 'Placeholder', className: 'badge-upcoming' }

  return (
    <article className={`session-card ${upcoming ? 'is-upcoming' : ''}`}>
      <div className="session-card-top">
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

      <Link to={`/session/${session.id}`} className={`button ${upcoming ? 'button-ghost' : 'button-primary'}`}>
        {upcoming ? 'View placeholder' : done ? 'Review session' : 'Start session'}
        <span aria-hidden="true"> →</span>
      </Link>
    </article>
  )
}
