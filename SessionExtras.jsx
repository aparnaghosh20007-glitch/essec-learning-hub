/*
  SESSION EXTRAS
  Optional learning sections for a session page. Each one only appears
  if the session has that field in its data (see session2.js):
    objectives → LearningObjectives
    concepts   → ConceptCards (tap a card to reveal the definition)
    workflow   → WorkflowStepper (step through the process one step at a time)
    topics     → TopicSections (expandable lecture notes)
*/
import { useState } from 'react'

export function LearningObjectives({ items }) {
  return (
    <ol className="objectives">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  )
}

export function ConceptCards({ concepts }) {
  const [open, setOpen] = useState({}) // which cards are flipped

  function toggle(term) {
    setOpen((o) => ({ ...o, [term]: !o[term] }))
  }

  const allOpen = concepts.every((c) => open[c.term])

  return (
    <>
      <div className="concept-toolbar">
        <p className="muted">Tap a card to reveal its definition. Try to explain it yourself first!</p>
        <button
          type="button"
          className="button button-ghost button-small"
          onClick={() => setOpen(allOpen ? {} : Object.fromEntries(concepts.map((c) => [c.term, true])))}
        >
          {allOpen ? 'Hide all' : 'Reveal all'}
        </button>
      </div>
      <div className="concept-grid">
        {concepts.map((c) => (
          <button
            key={c.term}
            type="button"
            className={`concept-card ${open[c.term] ? 'is-open' : ''}`}
            onClick={() => toggle(c.term)}
            aria-expanded={Boolean(open[c.term])}
          >
            <span className="concept-term">{c.term}</span>
            {open[c.term] ? (
              <span className="concept-definition">{c.definition}</span>
            ) : (
              <span className="concept-hint">Tap to reveal</span>
            )}
          </button>
        ))}
      </div>
    </>
  )
}

export function WorkflowStepper({ workflow }) {
  const [active, setActive] = useState(0)
  const steps = workflow.steps
  const step = steps[active]

  return (
    <div className="workflow">
      {workflow.intro && <p>{workflow.intro}</p>}

      <ol className="workflow-track" aria-label="Workflow steps">
        {steps.map((s, i) => (
          <li key={s.who}>
            <button
              type="button"
              className={`workflow-dot ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''} ${s.team === 'Human approval' ? 'is-human' : ''}`}
              onClick={() => setActive(i)}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="workflow-num">{i + 1}</span>
              <span className="workflow-name">{s.who}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={`workflow-card ${step.team === 'Human approval' ? 'is-human' : ''}`} aria-live="polite">
        <p className="eyebrow">
          Step {active + 1} of {steps.length} · {step.team}
        </p>
        <h3>{step.who}</h3>
        <p className="workflow-does">{step.does}</p>
        <p>{step.detail}</p>
        <p className="workflow-output">
          <span>Output</span> {step.output}
        </p>
      </div>

      <div className="workflow-nav">
        <button type="button" className="button button-ghost" onClick={() => setActive(active - 1)} disabled={active === 0}>
          ← Previous
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => setActive(active + 1)}
          disabled={active === steps.length - 1}
        >
          Next step →
        </button>
      </div>
    </div>
  )
}

export function TopicSections({ topics }) {
  return (
    <div className="topics">
      {topics.map((t, i) => (
        <details key={t.title} className={`topic ${t.highlight ? 'is-highlight' : ''}`} open={i === 0}>
          <summary>
            <span className="topic-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="topic-title">{t.title}</span>
            <span className="topic-chevron" aria-hidden="true">⌄</span>
          </summary>
          <div className="topic-body">
            {t.intro && <p>{t.intro}</p>}
            {t.quote && <blockquote className="topic-quote">{t.quote}</blockquote>}

            {t.cards && (
              <div className="role-grid">
                {t.cards.map((c) => (
                  <div key={c.title} className="role-card">
                    <h4>{c.title}</h4>
                    <ul>
                      {c.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {c.output && (
                      <p className="role-output">
                        <span>Output</span> {c.output}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {t.rows && (
              <dl className="topic-rows">
                {t.rows.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.text}</dd>
                  </div>
                ))}
              </dl>
            )}

            {t.points && (
              <ul className="topic-points">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}

            {t.note && <p className="topic-note">{t.note}</p>}
          </div>
        </details>
      ))}
    </div>
  )
}
