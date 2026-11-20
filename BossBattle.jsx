/*
  BOSS BATTLE (rooftop floor)
  Uses the session's ORIGINAL quiz from sessions.js / session2.js, word for
  word: same questions, options, correct answers and explanations.
  Every correct answer is a hit on the boss. The score is saved through
  saveQuizResult — the same record the classic quiz uses — so the best
  score and attempts are shared between both formats.
  Optional timed mode: 20 seconds per question (time out = no answer).
*/
import { useEffect, useMemo, useState } from 'react'
import { useProgress } from './ProgressContext.jsx'
import { SlotBoard, shuffled } from './SlotPuzzle.jsx'
import { Icon, Confetti } from './GameUI.jsx'
import { Aria, Static } from './Characters.jsx'
import { playSound } from './sound.js'

const SECONDS = 20

export default function BossBattle({ session, bossName, onComplete }) {
  const { progress, saveQuizResult } = useProgress()
  const quiz = session.quiz
  const questions = quiz.questions
  const total = questions.length
  const previous = progress.quizResults[session.id]

  const [stage, setStage] = useState('intro')
  const [timed, setTimed] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [placed, setPlaced] = useState({})
  const [time, setTime] = useState(SECONDS)
  const [hit, setHit] = useState(null)
  const [round, setRound] = useState(0)

  const q = questions[index]
  const answered = answers.length > index
  const score = answers.filter((a) => a.correct).length
  const bossHp = Math.round(((total - score) / total) * 100)
  const misses = answers.filter((a) => !a.correct).length

  const orderSetup = useMemo(() => {
    if (q?.type !== 'order') return null
    return {
      slots: q.items.map((_, i) => ({ key: `s${i}`, label: `Step ${i + 1}` })),
      items: shuffled(q.items.map((text, i) => ({ id: `i${i}`, text }))),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, round])

  // Countdown in timed mode.
  useEffect(() => {
    if (stage !== 'playing' || !timed || answered) return
    if (time <= 0) {
      record(false, null, true)
      return
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timed, time, answered])

  function start(isTimed) {
    setTimed(isTimed)
    setStage('playing')
    setIndex(0)
    setAnswers([])
    setPlaced({})
    setTime(SECONDS)
    setRound((r) => r + 1)
  }

  function record(correct, chosen, timeout = false) {
    if (answered) return
    setAnswers((a) => [...a, { correct, chosen, timeout }])
    setHit(correct ? 'boss' : 'player')
    playSound(correct ? 'good' : 'bad')
    setTimeout(() => setHit(null), 600)
  }

  function checkOrder() {
    const correct = q.items.every((_, i) => placed[`s${i}`] === `i${i}`)
    record(correct, q.items.map((_, i) => orderSetup.items.find((it) => it.id === placed[`s${i}`])?.text))
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1)
      setPlaced({})
      setTime(SECONDS)
    } else {
      const finalScore = answers.filter((a) => a.correct).length
      saveQuizResult(session.id, finalScore, total)
      setStage('results')
    }
  }

  if (stage === 'intro') {
    return (
      <div className="boss-intro">
        <Static size={190} className="boss-static boss-static-intro" />
        <p className="engine-kicker">Boss battle · original quiz</p>
        <p className="boss-villain">STATIC · the signal jammer <span>(fictional)</span></p>
        <h2>{bossName}</h2>
        <p className="boss-quiz-title">{quiz.title}</p>
        <p>{quiz.intro}</p>
        <ul className="boss-facts">
          <li><strong>{total}</strong> original questions</li>
          <li><strong>1 hit</strong> per correct answer</li>
          <li><strong>{previous ? `${previous.best}/${previous.total}` : '—'}</strong> best score</li>
        </ul>
        <p className="muted small">Your score is saved in the same record as the classic quiz. XP: up to 200, paid once; a better score later pays only the difference.</p>
        <div className="engine-actions">
          <button type="button" className="button button-primary button-large" onClick={() => start(false)} autoFocus>
            <Icon name="sword" size={18} /> Start the battle
          </button>
          <button type="button" className="button button-ghost" onClick={() => start(true)}>
            Timed mode · {SECONDS}s per question
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'results') {
    const pct = Math.round((score / total) * 100)
    const won = pct >= 50
    return (
      <div className="boss-results">
        {won && <Confetti pieces={70} />}
        <div className="boss-results-cast" aria-hidden="true">
          <Static size={120} className={`boss-static ${won ? 'is-defeated' : ''}`} />
          <Aria mood={won ? 'cheer' : 'worry'} size={96} />
        </div>
        <p className="engine-kicker">{won ? 'Boss defeated' : 'The boss retreats… for now'}</p>
        <div className="score-ring" style={{ '--pct': pct }} aria-hidden="true">
          <span>{pct}%</span>
        </div>
        <h2>
          {score} / {total}
        </h2>
        <p>{pct === 100 ? 'Flawless victory. Every original question answered.' : won ? 'A clear win. Retry any time to push your best score up.' : 'Review the answers below, then challenge the boss again.'}</p>
        <details className="review">
          <summary>Review every question</summary>
          <ol>
            {questions.map((qq, i) => (
              <li key={i} className={answers[i]?.correct ? 'is-correct' : 'is-wrong'}>
                <span className="review-icon" aria-hidden="true">{answers[i]?.correct ? '✓' : '✗'}</span>
                <span>
                  <strong>{qq.question}</strong>
                  <br />
                  Correct answer: {qq.type === 'order' ? qq.items.join(' → ') : qq.options[qq.answer]}
                  <br />
                  <span className="muted">{qq.explanation}</span>
                </span>
              </li>
            ))}
          </ol>
        </details>
        <div className="engine-actions">
          <button type="button" className="button button-gold" onClick={() => onComplete({ score, total })} autoFocus>
            Claim the rooftop <Icon name="arrow" size={18} />
          </button>
          <button type="button" className="button button-ghost" onClick={() => start(timed)}>
            Battle again
          </button>
        </div>
      </div>
    )
  }

  const last = answers[index]
  return (
    <div className={`boss ${hit ? `hit-${hit}` : ''}`}>
      <div className="boss-arena" aria-hidden="true">
        <Static size={150} hurt={hit === 'boss'} className="boss-static" />
      </div>
      <div className="boss-hud">
        <div className="hp hp-boss">
          <span>{bossName}</span>
          <div className="hp-bar">
            <div style={{ width: `${bossHp}%` }} />
          </div>
        </div>
        <div className="boss-meta">
          <span>
            Question {index + 1} / {total}
          </span>
          <span>Hits {score}</span>
          <span>Misses {misses}</span>
          {timed && !answered && <span className={`timer ${time <= 5 ? 'is-low' : ''}`}>{time}s</span>}
        </div>
      </div>

      <h2 className="boss-question">{q.question}</h2>

      {q.type === 'choice' && (
        <div className="options" role="group" aria-label="Answer choices">
          {q.options.map((option, i) => {
            let state = ''
            if (answered && i === q.answer) state = 'is-correct'
            else if (answered && i === last?.chosen) state = 'is-wrong'
            return (
              <button key={i} type="button" className={`option ${state}`} onClick={() => record(i === q.answer, i)} disabled={answered}>
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      )}

      {q.type === 'order' && (
        <>
          <SlotBoard
            key={`${index}-${round}`}
            slots={orderSetup.slots}
            items={orderSetup.items}
            placed={placed}
            onPlace={(id, key) =>
              setPlaced((p) => {
                const n = { ...p }
                const from = Object.keys(n).find((k) => n[k] === id)
                const swap = n[key]
                if (from) delete n[from]
                if (swap && from) n[from] = swap
                n[key] = id
                return n
              })
            }
            onRemove={(key) =>
              setPlaced((p) => {
                const n = { ...p }
                delete n[key]
                return n
              })
            }
            results={answered ? Object.fromEntries(q.items.map((_, i) => [`s${i}`, placed[`s${i}`] === `i${i}`])) : null}
            disabled={answered}
            layout="order"
            poolLabel="Steps"
          />
          {!answered && (
            <div className="engine-actions">
              <button type="button" className="button button-primary" onClick={checkOrder} disabled={Object.keys(placed).length !== q.items.length}>
                Strike with this order
              </button>
            </div>
          )}
        </>
      )}

      {answered && (
        <div className={`feedback ${last.correct ? 'is-correct' : 'is-wrong'}`} role="status">
          <Aria mood={last.correct ? 'cheer' : 'worry'} size={56} float={false} className="consequence-aria" />
          <p className="feedback-title">{last.correct ? '✓ Direct hit!' : last.timeout ? '⏱ Time’s up.' : '✗ The boss blocks it.'}</p>
          {!last.correct && q.type === 'order' && (
            <p>
              <strong>Correct order:</strong> {q.items.join(' → ')}
            </p>
          )}
          {!last.correct && q.type === 'choice' && (
            <p>
              <strong>Correct answer:</strong> {q.options[q.answer]}
            </p>
          )}
          <p>{q.explanation}</p>
          <button type="button" className="button button-primary" onClick={next} autoFocus>
            {index + 1 < total ? 'Next question →' : 'See the result →'}
          </button>
        </div>
      )}
    </div>
  )
}
