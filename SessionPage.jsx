/*
  SESSION PAGE
  One page per session: overview, game, takeaways and reflection.
  Upcoming sessions show clearly labelled placeholders.
*/
import { Link, useParams } from 'react-router-dom'
import { getSession, sessions } from '../data/sessions.js'
import Quiz from '../components/Quiz.jsx'
import ReflectionBox from '../components/ReflectionBox.jsx'
import NotFound from './NotFound.jsx'
import { useProgress } from '../state/ProgressContext.jsx'

export default function SessionPage() {
  const { sessionId } = useParams()
  const session = getSession(sessionId)
  const { isComplete, progress, setManualComplete } = useProgress()

  if (!session) return <NotFound />

  const upcoming = session.status === 'upcoming'
  const done = isComplete(session.id)
  const position = sessions.indexOf(session)
  const prev = sessions[position - 1]
  const next = sessions[position + 1]

  return (
    <>
      <section className={`session-hero ${upcoming ? 'is-upcoming' : ''}`}>
        <div className="container">
          <Link to="/#sessions" className="back-link">← All sessions</Link>
          <div className="session-hero-row">
            <span className="session-hero-number">{String(session.number).padStart(2, '0')}</span>
            <div>
              <div className="badge-row">
                {upcoming && <span className="badge badge-upcoming">Placeholder — content to be added</span>}
                {done && <span className="badge badge-done">✓ Completed</span>}
              </div>
              <h1>{session.title}</h1>
              <p className="session-hero-topic">{session.topic}</p>
              <dl className="session-meta">
                <div><dt>Speaker</dt><dd>{session.speaker}</dd></div>
                <div><dt>Date</dt><dd>{session.date}</dd></div>
                {session.tools.length > 0 && (
                  <div><dt>Tools</dt><dd>{session.tools.join(' · ')}</dd></div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="container session-body">
        <section className="panel">
          <h2>Session overview</h2>
          <p>{session.summary}</p>
          <p className="mini-label">Learning activities</p>
          <ul className="pill-list">
            {session.activities.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </section>

        <section className="panel panel-game" aria-labelledby="game-title">
          <h2 id="game-title">Test yourself</h2>
          {session.quiz ? (
            <Quiz key={session.id} sessionId={session.id} quiz={session.quiz} />
          ) : upcoming ? (
            <div className="placeholder-box">
              <p className="placeholder-icon" aria-hidden="true">🎲</p>
              <p><strong>Interactive game — to be added after this session.</strong></p>
              <p className="muted">
                Add a quiz for this session in <code>src/data/sessions.js</code> (copy the format used in Session 1).
              </p>
            </div>
          ) : (
            <div className="placeholder-box">
              <p>There's no game for this session. Mark it complete once you've reviewed the takeaways.</p>
              <button
                type="button"
                className={`button ${done ? 'button-ghost' : 'button-primary'}`}
                onClick={() => setManualComplete(session.id, !done)}
              >
                {done ? 'Mark as not complete' : 'Mark session as complete'}
              </button>
            </div>
          )}
        </section>

        <section className="panel" id="takeaways" aria-labelledby="takeaways-title">
          <h2 id="takeaways-title">Key takeaways</h2>
          {session.takeaways.length ? (
            <ol className="takeaways">
              {session.takeaways.map((t) => <li key={t}>{t}</li>)}
            </ol>
          ) : (
            <div className="placeholder-box">
              <p><strong>Key takeaways — to be added after this session.</strong></p>
              <p className="muted">Add them to the <code>takeaways</code> list for this session in <code>src/data/sessions.js</code>.</p>
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="reflect-title">
          <h2 id="reflect-title">My reflection</h2>
          {upcoming && !progress.reflections[session.id] ? (
            <p className="muted">You can write notes here before or after the session — they're saved automatically.</p>
          ) : null}
          <ReflectionBox
            storageKey={session.id}
            label={`Reflection on Session ${session.number}`}
            placeholder="What surprised you? What will you use in your own projects?"
            prompts={[
              'What was the most valuable idea from this session?',
              'How could you apply it in a future project or job?',
            ]}
          />
        </section>

        <nav className="pager" aria-label="Session navigation">
          {prev ? <Link to={`/session/${prev.id}`} className="button button-ghost">← Session {prev.number}</Link> : <span />}
          {next ? <Link to={`/session/${next.id}`} className="button button-ghost">Session {next.number} →</Link> : <Link to="/reflections" className="button button-ghost">My reflections →</Link>}
        </nav>
      </div>
    </>
  )
}
