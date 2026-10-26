/*
  HOMEPAGE
  Welcome message, how the platform works, progress, and all session cards.
*/
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { sessions } from '../data/sessions.js'
import SessionCard from '../components/SessionCard.jsx'
import ProgressTracker from '../components/ProgressTracker.jsx'
import { useProgress } from '../state/ProgressContext.jsx'

export default function Home() {
  const { hash } = useLocation()
  const { completedCount } = useProgress()
  const nextSession = sessions.find((s) => s.status === 'completed' && s.quiz) ?? sessions[0]

  // Support links like /#progress and /#sessions
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Digital Platforms · ESSEC Business School</p>
            <h1>
              Every guest speaker,
              <br />
              <em>one place to learn it.</em>
            </h1>
            <p className="hero-lead">
              Session Lab collects each guest speaker session of the semester. Every session has its own tab
              with a short summary, an interactive game to test what stuck, the key takeaways, and space for
              your own reflections.
            </p>
            <div className="hero-actions">
              <Link to={`/session/${nextSession.id}`} className="button button-accent button-large">
                {completedCount ? 'Continue learning' : `Start Session ${nextSession.number}`} →
              </Link>
              <Link to="/#sessions" className="button button-on-dark">Browse sessions</Link>
            </div>
          </div>

          <ol className="hero-steps" aria-label="How it works">
            <li><span>01</span><div><strong>Attend</strong><p>Join the guest speaker session in class.</p></div></li>
            <li><span>02</span><div><strong>Play</strong><p>Take the session's quiz or game with instant feedback.</p></div></li>
            <li><span>03</span><div><strong>Review</strong><p>Read the key takeaways to lock in the ideas.</p></div></li>
            <li><span>04</span><div><strong>Reflect</strong><p>Write down what you learned and how you'd use it.</p></div></li>
          </ol>
        </div>
      </section>

      <div className="container home-body">
        <ProgressTracker />

        <section id="sessions" aria-labelledby="sessions-title">
          <div className="section-head">
            <p className="eyebrow">This semester</p>
            <h2 id="sessions-title">Guest speaker sessions</h2>
            <p className="muted">
              New sessions are added after each class. Placeholder cards will be filled in as the semester progresses.
            </p>
          </div>
          <div className="card-grid">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>

        <section className="reflect-cta">
          <div>
            <h2>Keep a learning journal</h2>
            <p>Write your reflections for each session and your biggest lessons of the semester — all in one place.</p>
          </div>
          <Link to="/reflections" className="button button-primary">Open my reflections →</Link>
        </section>
      </div>
    </>
  )
}
