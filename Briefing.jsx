/*
  BRIEFING (Learn floor)
  A cinematic chapter card → ARIA's dialogue → a branching choice with
  consequences → an interactive walkthrough of the workflow.
  Calls onComplete({ openingCall }) where openingCall is the verdict of
  the FIRST answer picked ('best' | 'ok' | 'bad').
*/
import { useEffect, useState } from 'react'
import { Icon } from './GameUI.jsx'
import { playSound } from './sound.js'
import { Aria } from './Characters.jsx'

const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Reveals text letter by letter; click to show it all at once.
function useTypewriter(text, speed = 18) {
  const [n, setN] = useState(reduce() ? text.length : 0)
  useEffect(() => {
    if (reduce()) {
      setN(text.length)
      return
    }
    setN(0)
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), speed)
    return () => clearInterval(id)
  }, [text, speed])
  return [text.slice(0, n), n >= text.length, () => setN(text.length)]
}

// ARIA hovering over the briefing room's holo-table.
export function Hologram({ label = 'ARIA · CITY AI', mood = 'happy' }) {
  return (
    <figure className="holo" aria-hidden="true">
      <span className="holo-base" />
      <span className="holo-beam" />
      <Aria mood={mood} size={200} className="holo-figure" />
      <figcaption>{label}</figcaption>
    </figure>
  )
}

export default function Briefing({ content, chapter, onComplete }) {
  const [stage, setStage] = useState('title') // title → dialog → choice → result → walk
  const [line, setLine] = useState(0)
  const [pick, setPick] = useState(null)
  const [firstVerdict, setFirstVerdict] = useState(null)
  const [step, setStep] = useState(0)
  const [lit, setLit] = useState([])

  const current = content.lines[line]
  const [typed, typedDone, skipTyping] = useTypewriter(stage === 'dialog' ? current.text : '')

  function advanceDialog() {
    if (!typedDone) return skipTyping()
    if (line + 1 < content.lines.length) setLine(line + 1)
    else setStage('choice')
  }

  function choose(i) {
    setPick(i)
    playSound('place')
    if (firstVerdict === null) setFirstVerdict(content.choice.options[i].verdict)
    setStage('result')
  }

  const steps = content.walkthrough.steps
  function powerUp() {
    playSound('power')
    setLit((l) => (l.includes(step) ? l : [...l, step]))
    if (step + 1 < steps.length) setStep(step + 1)
  }
  const allLit = lit.length === steps.length

  if (stage === 'title') {
    return (
      <button type="button" className="chapter-card" onClick={() => setStage('dialog')} autoFocus>
        <span className="chapter-kicker">CHAPTER {chapter.number}</span>
        <span className="chapter-title">{chapter.title}</span>
        <span className="chapter-sub">{chapter.subtitle}</span>
        <span className="chapter-hint">Tap or press Enter to begin</span>
      </button>
    )
  }

  if (stage === 'walk') {
    const s = steps[step]
    return (
      <div className="walk">
        <header className="engine-head">
          <p className="engine-kicker">{content.walkthrough.source}</p>
          <h2>{content.walkthrough.title}</h2>
          <p className="muted">{content.walkthrough.intro}</p>
        </header>
        <ol className="walk-path" aria-label="Workflow stations">
          {steps.map((st, i) => (
            <li key={i} className={`walk-node ${lit.includes(i) ? 'is-lit' : ''} ${i === step ? 'is-current' : ''}`}>
              <button type="button" onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}>
                <span className="walk-dot">{lit.includes(i) ? <Icon name="check" size={16} stroke={3} /> : i + 1}</span>
                <span className="walk-name">{st.who}</span>
              </button>
            </li>
          ))}
        </ol>
        <article className="walk-card" key={step}>
          <p className="walk-team">{s.team}</p>
          <h3>{s.who}</h3>
          <p className="walk-does">{s.does}</p>
          <p>{s.detail}</p>
          <p className="walk-output">
            <span>Output</span> {s.output}
          </p>
          <p className="source-tag">Source: {s.source}</p>
          <div className="engine-actions">
            {!lit.includes(step) && (
              <button type="button" className="button button-primary" onClick={powerUp}>
                <Icon name="bolt" size={18} /> Power up this station
              </button>
            )}
            {allLit && (
              <button type="button" className="button button-gold" onClick={() => onComplete({ openingCall: firstVerdict })}>
                Clear this floor <Icon name="arrow" size={18} />
              </button>
            )}
          </div>
          <p className="muted small">{lit.length} of {steps.length} stations powered</p>
        </article>
      </div>
    )
  }

  return (
    <div className="briefing">
      <Hologram mood={stage === 'result' ? { best: 'cheer', ok: 'think', bad: 'worry' }[content.choice.options[pick].verdict] ?? 'happy' : 'happy'} />
      <section className="dialog" aria-live="polite">
        <p className="engine-kicker">{content.location}</p>
        {stage === 'dialog' && (
          <button type="button" className="dialog-line" onClick={advanceDialog}>
            <span className="dialog-who">{current.who}</span>
            <span className="dialog-text">
              {typed}
              {!typedDone && <span className="caret" />}
            </span>
            {current.source && typedDone && <span className="source-tag">Source: {current.source}</span>}
            <span className="dialog-next">{typedDone ? (line + 1 < content.lines.length ? 'Next ▸' : 'Your call ▸') : 'Skip ▸'}</span>
          </button>
        )}

        {stage === 'choice' && (
          <>
            <p className="dialog-text dialog-static">{content.lines[content.lines.length - 1].text}</p>
            <div className="choice-list" role="group" aria-label={content.choice.prompt}>
              {content.choice.options.map((o, i) => (
                <button key={i} type="button" className="choice" onClick={() => choose(i)}>
                  <span className="choice-key">{'ABC'[i]}</span>
                  <span>{o.text}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'result' && (
          <>
            <div className={`consequence is-${content.choice.options[pick].verdict}`} role="status">
              <p className="consequence-title">{content.choice.options[pick].title}</p>
              <p>{content.choice.options[pick].feedback}</p>
              <p className="source-tag">Source: {content.choice.options[pick].source}</p>
              {firstVerdict === 'bad' && (
                <p className="consequence-effect">Consequence: your first call costs 1 trust point when you reach the Play floor.</p>
              )}
            </div>
            <div className="engine-actions">
              <button type="button" className="button button-primary" onClick={() => setStage('walk')}>
                Continue <Icon name="arrow" size={18} />
              </button>
              <button type="button" className="button button-ghost" onClick={() => setStage('choice')}>
                Try another answer
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
