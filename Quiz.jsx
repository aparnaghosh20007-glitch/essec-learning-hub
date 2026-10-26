/*
  QUIZ GAME
  Works with any quiz written in sessions.js.
  Stages: intro screen → one question at a time (instant feedback) → results.
  Supports two question types: 'choice' (multiple choice) and 'order'.
*/
import { useMemo, useState } from 'react'
import { useProgress } from '../state/ProgressContext.jsx'

// Returns a shuffled copy of a list (that is never in the original order).
function shuffle(list) {
  if (list.length < 2) return [...list]
  let copy
  do {
    copy = [...list].sort(() => Math.random() - 0.5)
  } while (copy.every((item, i) => item === list[i]))
  return copy
}

function resultMessage(percent) {
  if (percent === 100) return { title: 'Perfect score!', text: 'You have mastered this session. Ready to deploy!' }
  if (percent >= 80) return { title: 'Excellent work!', text: 'You clearly understood the key ideas from this session.' }
  if (percent >= 50) return { title: 'Good effort!', text: 'You have the basics. Review the takeaways below and try again to push your score up.' }
  return { title: 'Keep going!', text: 'Re-read the key takeaways below, then have another go — every attempt helps it stick.' }
}

export default function Quiz({ sessionId, quiz }) {
  const { progress, saveQuizResult } = useProgress()
  const previous = progress.quizResults[sessionId]
  const questions = quiz.questions
  const total = questions.length

  const [stage, setStage] = useState('intro') // 'intro' | 'playing' | 'results'
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([]) // one entry per answered question
  const [attempt, setAttempt] = useState(0) // changes on every restart → new shuffle

  // Multiple-choice state
  const [selected, setSelected] = useState(null)
  // Ordering state
  const [picked, setPicked] = useState([])

  const question = questions[index]
  const answered = answers.length > index // has the current question been checked?
  const score = answers.filter((a) => a.correct).length

  const shuffledItems = useMemo(
    () => (question?.type === 'order' ? shuffle(question.items) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, attempt],
  )

  function start() {
    setStage('playing')
    setIndex(0)
    setAnswers([])
    setSelected(null)
    setPicked([])
    setAttempt((n) => n + 1)
  }

  function chooseOption(optionIndex) {
    if (answered) return
    setSelected(optionIndex)
    setAnswers([...answers, { correct: optionIndex === question.answer, chosen: optionIndex }])
  }

  function pickItem(item) {
    if (answered || picked.includes(item)) return
    setPicked([...picked, item])
  }

  function checkOrder() {
    const correct = picked.every((item, i) => item === question.items[i])
    setAnswers([...answers, { correct, chosen: picked }])
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1)
      setSelected(null)
      setPicked([])
    } else {
      saveQuizResult(sessionId, score, total)
      setStage('results')
    }
  }

  // ---------- INTRO ----------
  if (stage === 'intro') {
    return (
      <div className="quiz-card quiz-intro">
        <p className="eyebrow">Interactive game</p>
        <h3>{quiz.title}</h3>
        <p>{quiz.intro}</p>
        <ul className="quiz-facts">
          <li><strong>{total}</strong> questions</li>
          <li><strong>Instant</strong> feedback</li>
          <li><strong>{previous ? `${previous.best}/${previous.total}` : '—'}</strong> best score</li>
        </ul>
        <button type="button" className="button button-primary button-large" onClick={start}>
          {previous ? 'Play again' : 'Start the quiz'}
        </button>
      </div>
    )
  }

  // ---------- RESULTS ----------
  if (stage === 'results') {
    const percent = Math.round((score / total) * 100)
    const message = resultMessage(percent)
    return (
      <div className="quiz-card quiz-results">
        <div className="score-ring" style={{ '--pct': percent }} aria-hidden="true">
          <span>{percent}%</span>
        </div>
        <p className="eyebrow">Quiz complete</p>
        <h3>{message.title}</h3>
        <p className="results-score">
          You scored <strong>{score}</strong> out of <strong>{total}</strong>
        </p>
        <p>{message.text}</p>
        {previous && previous.best > score && (
          <p className="muted">Your best score is still {previous.best}/{total}.</p>
        )}

        <details className="review">
          <summary>Review your answers</summary>
          <ol>
            {questions.map((q, i) => (
              <li key={i} className={answers[i]?.correct ? 'is-correct' : 'is-wrong'}>
                <span className="review-icon" aria-hidden="true">{answers[i]?.correct ? '✓' : '✗'}</span>
                <span>
                  <strong>{q.question}</strong>
                  <br />
                  Correct answer:{' '}
                  {q.type === 'order' ? q.items.join(' → ') : q.options[q.answer]}
                </span>
              </li>
            ))}
          </ol>
        </details>

        <div className="results-actions">
          <button type="button" className="button button-primary" onClick={start}>Try again</button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => document.getElementById('takeaways')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Read the takeaways
          </button>
        </div>
      </div>
    )
  }

  // ---------- PLAYING ----------
  const last = answers[index]
  return (
    <div className="quiz-card">
      <div className="quiz-top">
        <span>Question {index + 1} of {total}</span>
        <span className="quiz-score">Score: {score}</span>
      </div>
      <div className="quiz-progress" aria-hidden="true">
        <div style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <h3 className="quiz-question">{question.question}</h3>

      {question.type === 'choice' && (
        <div className="options" role="group" aria-label="Answer choices">
          {question.options.map((option, i) => {
            let state = ''
            if (answered && i === question.answer) state = 'is-correct'
            else if (answered && i === selected) state = 'is-wrong'
            return (
              <button
                key={i}
                type="button"
                className={`option ${state}`}
                onClick={() => chooseOption(i)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'order' && (
        <div className="order-game">
          <p className="mini-label">Tap the steps in order</p>
          <div className="order-pool">
            {shuffledItems.map((item) => (
              <button
                key={item}
                type="button"
                className="order-chip"
                onClick={() => pickItem(item)}
                disabled={answered || picked.includes(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="mini-label">Your order</p>
          <ol className="order-answer">
            {question.items.map((correctItem, i) => {
              const item = picked[i]
              let state = ''
              if (answered) state = item === correctItem ? 'is-correct' : 'is-wrong'
              return (
                <li key={i} className={`order-slot ${item ? 'is-filled' : ''} ${state}`}>
                  <span className="slot-number">{i + 1}</span>
                  <span>{item ?? '…'}</span>
                </li>
              )
            })}
          </ol>

          {!answered && (
            <div className="order-actions">
              <button type="button" className="button button-ghost" onClick={() => setPicked([])} disabled={!picked.length}>
                Clear
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={checkOrder}
                disabled={picked.length !== question.items.length}
              >
                Check my order
              </button>
            </div>
          )}
        </div>
      )}

      {answered && (
        <div className={`feedback ${last.correct ? 'is-correct' : 'is-wrong'}`} role="status">
          <p className="feedback-title">{last.correct ? '✓ Correct!' : '✗ Not quite.'}</p>
          {!last.correct && question.type === 'order' && (
            <p><strong>Correct order:</strong> {question.items.join(' → ')}</p>
          )}
          <p>{question.explanation}</p>
          <button type="button" className="button button-primary" onClick={next} autoFocus>
            {index + 1 < total ? 'Next question →' : 'See my results →'}
          </button>
        </div>
      )}
    </div>
  )
}
