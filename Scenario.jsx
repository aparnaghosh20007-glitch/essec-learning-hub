/*
  SCENARIO (Challenge floor)
  A run of decisions. Each has one best call. Wrong calls show their
  consequence, cost a point of the meter and let you try again.
  "Duel" steps are objections from a persona: each best answer lowers
  her scepticism. Lose the whole meter and the run restarts.
  Calls onComplete({ perfect }) — perfect = best call first time, every time.
*/
import { Aria } from './Characters.jsx'
import { useMemo, useState } from 'react'
import { Icon } from './GameUI.jsx'
import { playSound } from './sound.js'

const MAX = 3

export default function Scenario({ content, onComplete }) {
  const [i, setI] = useState(0)
  const [lives, setLives] = useState(MAX)
  const [tried, setTried] = useState([])
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [firstTry, setFirstTry] = useState(true)
  const [run, setRun] = useState(0)
  const [failedRun, setFailedRun] = useState(false)

  const step = content.steps[i]
  const duelSteps = useMemo(() => content.steps.map((s, k) => (s.duel ? k : null)).filter((k) => k !== null), [content])
  const duelIndex = duelSteps.indexOf(i)
  const decisionsTotal = content.steps.length - duelSteps.length
  const scepticism = step?.duel ? Math.round(100 * (1 - (duelIndex + (solved ? 1 : 0)) / duelSteps.length)) : 100
  const lost = lives <= 0

  function choose(k) {
    if (solved || lost || tried.includes(k)) return
    const o = step.options[k]
    if (o.best) {
      setSolved(true)
      playSound('good')
      setFeedback({ ok: true, text: o.feedback })
    } else {
      setTried((t) => [...t, k])
      setLives((l) => l - 1)
      setFirstTry(false)
      setFailedRun(true)
      playSound('bad')
      setFeedback({ ok: false, text: o.feedback })
    }
  }

  function next() {
    if (i + 1 < content.steps.length) {
      setI(i + 1)
      setTried([])
      setSolved(false)
      setFeedback(null)
    } else onComplete({ perfect: firstTry })
  }

  function restart() {
    setRun((r) => r + 1)
    setI(0)
    setLives(MAX)
    setTried([])
    setSolved(false)
    setFeedback(null)
  }

  const last = i + 1 === content.steps.length
  const label = step.duel ? `Objection ${duelIndex + 1} of ${duelSteps.length}` : `Call ${i + 1} of ${decisionsTotal}`

  return (
    <div className={`scenario ${step.duel ? 'is-duel' : ''}`} key={run}>
      <header className="engine-head">
        <p className="engine-kicker">{step.duel ? 'Face-to-face' : 'Decision room'} · {label}</p>
        <h2>{step.duel ? 'Win over the consumer' : content.title}</h2>
        {i === 0 && !step.duel && <p>{content.intro}</p>}
      </header>

      <div className="tactics-hud">
        <span className="meter" aria-label={`${content.meter}: ${Math.max(0, lives)} of ${MAX}`}>
          {content.meter}
          {Array.from({ length: MAX }, (_, k) => (
            <span key={k} className={`meter-pip ${k < lives ? 'is-on' : ''}`} />
          ))}
        </span>
        <span className="steps-pips" aria-hidden="true">
          {content.steps.map((s, k) => (
            <span key={k} className={`${k < i || (k === i && solved) ? 'is-done' : k === i ? 'is-now' : ''} ${s.duel ? 'is-duel' : ''}`} />
          ))}
        </span>
      </div>

      {step.duel ? (
        <div className="duel">
          <div className="duel-persona">
            <span className="duel-face" aria-hidden="true">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="30" r="16" fill="#F9A8D4" opacity=".9" />
                <path d="M14 80c0-18 12-30 26-30s26 12 26 30z" fill="#F472B6" opacity=".8" />
                <path d="M24 28c0-12 7-18 16-18s16 6 16 18c-4-6-9-8-16-8s-12 2-16 8z" fill="#3B0A2A" />
              </svg>
            </span>
            <div>
              <p className="duel-name">{step.speaker}</p>
              <p className="muted small">{step.speakerNote}</p>
              <div className="hp" aria-label={`Scepticism ${scepticism}%`}>
                <span>Scepticism</span>
                <div className="hp-bar">
                  <div style={{ width: `${scepticism}%` }} />
                </div>
              </div>
            </div>
          </div>
          <p className="duel-quote">{step.situation}</p>
        </div>
      ) : (
        <div className="situation">
          <p className="situation-text">{step.situation}</p>
          <p className="situation-prompt">{step.prompt}</p>
        </div>
      )}

      <div className={`decision-list ${step.duel ? 'decision-cards' : ''}`} role="group" aria-label={step.prompt}>
        {step.options.map((o, k) => {
          const state = tried.includes(k) ? 'is-tried' : solved && o.best ? 'is-best' : ''
          return (
            <button key={k} type="button" className={`decision ${state}`} onClick={() => choose(k)} disabled={solved || lost || tried.includes(k)}>
              <span className="choice-key">{'ABC'[k]}</span>
              <span>{o.text}</span>
            </button>
          )
        })}
      </div>

      {feedback && !lost && (
        <div className={`consequence ${feedback.ok ? 'is-best' : 'is-bad'}`} role="status">
          <Aria mood={feedback.ok ? 'cheer' : 'worry'} size={56} float={false} className="consequence-aria" />
          <p className="consequence-title">
            {feedback.ok ? (step.duel ? 'Critical hit · scepticism down' : 'Best call') : `Consequence · −1 ${content.meter.toLowerCase()}`}
          </p>
          <p>{feedback.text}</p>
          <p className="source-tag">Source: {step.source}</p>
          {!feedback.ok && <p className="muted small">Pick again.</p>}
        </div>
      )}

      {solved && (
        <div className="engine-actions">
          <button type="button" className={`button ${last ? 'button-gold' : 'button-primary'}`} onClick={next} autoFocus>
            {last ? 'Clear this floor' : 'Next call'} <Icon name="arrow" size={18} />
          </button>
          {last && <span className="muted small">{firstTry && !failedRun ? 'Perfect run: best call every time.' : 'Cleared. A perfect run (no wrong calls) earns the Creative Thinker badge.'}</span>}
        </div>
      )}

      {lost && (
        <div className="fail-panel" role="alert">
          <p className="fail-title">{content.meter} lost</p>
          <p>{feedback?.text}</p>
          <p>The run is over. Replay it from the first call. You now know where the traps are.</p>
          <button type="button" className="button button-primary" onClick={restart} autoFocus>
            Replay the room
          </button>
        </div>
      )}
    </div>
  )
}
