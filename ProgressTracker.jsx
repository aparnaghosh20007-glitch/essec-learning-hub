/*
  PROGRESS TRACKER
  Shows the overall completion bar plus a step for each session.
*/
import { Link } from 'react-router-dom'
import { sessions } from '../data/sessions.js'
import { useProgress } from '../state/ProgressContext.jsx'

export default function ProgressTracker() {
  const { isComplete, completedCount, totalCount, progress, resetProgress } = useProgress()
  const percent = Math.round((completedCount / totalCount) * 100)

  function handleReset() {
    if (window.confirm('Reset all quiz scores, completed sessions and reflections? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <section className="progress-panel" id="progress" aria-labelledby="progress-title">
      <div className="progress-head">
        <div>
          <p className="eyebrow">Your progress</p>
          <h2 id="progress-title">
            {completedCount} of {totalCount} sessions completed
          </h2>
        </div>
        <span className="progress-percent">{percent}%</span>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall completion"
      >
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <ol className="progress-steps">
        {sessions.map((s) => {
          const done = isComplete(s.id)
          const result = progress.quizResults[s.id]
          let state = 'Not started'
          if (done && result) state = `Quiz best: ${result.best}/${result.total}`
          else if (done) state = 'Completed'
          else if (s.status === 'upcoming') state = 'Coming soon'
          else if (s.quiz) state = 'Quiz to do'

          return (
            <li key={s.id} className={`progress-step ${done ? 'is-done' : ''} ${s.status === 'upcoming' ? 'is-upcoming' : ''}`}>
              <Link to={`/session/${s.id}`}>
                <span className="step-marker" aria-hidden="true">{done ? '✓' : s.number}</span>
                <span className="step-text">
                  <strong>Session {s.number}</strong>
                  <span>{state}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      {completedCount > 0 && (
        <button type="button" className="link-button" onClick={handleReset}>
          Reset my progress
        </button>
      )}
    </section>
  )
}
