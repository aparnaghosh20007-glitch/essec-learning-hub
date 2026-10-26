/*
  NAVBAR
  Top row: site name, main links and a small progress counter.
  Second row: one tab per session (built automatically from sessions.js).
*/
import { NavLink, Link } from 'react-router-dom'
import { sessions } from '../data/sessions.js'
import { useProgress } from '../state/ProgressContext.jsx'

export default function Navbar() {
  const { isComplete, completedCount, totalCount } = useProgress()

  return (
    <header className="navbar">
      <div className="navbar-top container">
        <Link to="/" className="brand" aria-label="Session Lab home">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <span className="brand-text">
            Session Lab
            <small>Digital Platforms · ESSEC</small>
          </span>
        </Link>

        <nav className="main-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/reflections">Reflections</NavLink>
        </nav>

        <Link to="/#progress" className="nav-progress" title="Sessions completed">
          <span className="nav-progress-count">{completedCount}/{totalCount}</span>
          <span className="nav-progress-label">done</span>
        </Link>
      </div>

      <nav className="session-tabs" aria-label="Sessions">
        <div className="session-tabs-inner container">
          {sessions.map((s) => (
            <NavLink key={s.id} to={`/session/${s.id}`} className="session-tab">
              <span
                className={`tab-dot ${isComplete(s.id) ? 'is-done' : s.status === 'upcoming' ? 'is-upcoming' : ''}`}
                aria-hidden="true"
              />
              Session {s.number}
              {isComplete(s.id) && <span className="sr-only"> (completed)</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
