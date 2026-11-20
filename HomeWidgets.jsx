/*
  HOMEPAGE WIDGETS
    PlayerCard      — name, level, XP bar, stats and badges
    CourseProgress  — overall progress across the six missions
    DailyChallenge  — one real quiz question a day (+25 XP once)
    BadgeShelf      — all achievement badges, locked or unlocked
*/
import { useState } from 'react'
import { sessions } from './sessions.js'
import { useProgress } from './ProgressContext.jsx'
import { BADGES, LEVELS, SECTIONS, dailyQuestion, isLive, missionMeta, missionProgress, todayKey } from './game.js'
import { FillBar, Icon, Medal, useCountUp } from './GameUI.jsx'

export function PlayerCard() {
  const { progress, xp, level, badges, missionsComplete, setPlayerName, resetProgress } = useProgress()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(progress.playerName)
  const shownXp = useCountUp(xp)
  const name = progress.playerName || 'Player One'
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const bossScores = Object.values(progress.quizResults)
  const bestBoss = bossScores.length
    ? Math.max(...bossScores.map((r) => Math.round((r.best / r.total) * 100)))
    : null

  function save(e) {
    e.preventDefault()
    setPlayerName(draft.trim())
    setEditing(false)
  }

  function handleReset() {
    if (window.confirm('Reset all XP, badges, quiz scores and reflections? This cannot be undone.')) {
      resetProgress()
      setDraft('')
    }
  }

  return (
    <aside id="player" className="player-card" aria-label="Player profile">
      <div className="player-head">
        <span className="player-avatar" aria-hidden="true">{initials}</span>
        <div className="player-id">
          <p className="mini-label">Player profile</p>
          {editing ? (
            <form className="player-name-form" onSubmit={save}>
              <label htmlFor="player-name" className="sr-only">Your player name</label>
              <input
                id="player-name"
                value={draft}
                maxLength={24}
                placeholder="Your name"
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
              <button type="submit" className="button button-small button-glow">Save</button>
            </form>
          ) : (
            <p className="player-name">
              {name}
              <button type="button" className="icon-button" onClick={() => setEditing(true)} aria-label="Edit player name">
                <Icon name="edit" size={16} />
              </button>
            </p>
          )}
        </div>
        <div className="player-level">
          <span className="player-level-num">{level.level}</span>
          <span className="player-level-label">Level</span>
        </div>
      </div>

      <p className="player-xp-row">
        <strong>{level.name}</strong>
        <span>
          {shownXp}
          {level.nextXp ? ` / ${level.nextXp}` : ''} XP
        </span>
      </p>
      <FillBar pct={level.pct} label="XP towards next level" className="fillbar-xp" />
      <p className="player-next">
        {level.nextXp ? `${level.toNext} XP to Level ${level.level + 1} · ${level.nextName}` : 'Top level reached. Legendary!'}
      </p>

      <div className="player-stats">
        <div>
          <strong>{missionsComplete}<small>/{sessions.length}</small></strong>
          <span>Missions</span>
        </div>
        <div>
          <strong>{badges.length}<small>/{BADGES.length}</small></strong>
          <span>Badges</span>
        </div>
        <div>
          <strong>{bestBoss === null ? '—' : `${bestBoss}%`}</strong>
          <span>Best boss</span>
        </div>
      </div>

      <p className="mini-label">Achievement badges</p>
      <ul className="player-badges">
        {BADGES.map((b) => (
          <li key={b.id} title={`${b.name}: ${b.desc}`} className={badges.includes(b.id) ? 'is-unlocked' : ''}>
            <Medal unlocked={badges.includes(b.id)} size="sm" />
            <span className="sr-only">
              {b.name} — {badges.includes(b.id) ? 'unlocked' : 'locked'}
            </span>
          </li>
        ))}
      </ul>

      {xp > 0 && (
        <button type="button" className="link-button" onClick={handleReset}>
          Reset my progress
        </button>
      )}
    </aside>
  )
}

export function CourseProgress() {
  const { progress, missionsComplete } = useProgress()
  const rows = sessions.map((s) => ({ s, meta: missionMeta(s), p: missionProgress(s, progress.awards) }))
  const live = rows.filter((r) => isLive(r.s))
  const cleared = live.reduce((sum, r) => sum + r.p.count, 0)
  const pct = Math.round((cleared / (sessions.length * SECTIONS.length)) * 100)
  const shown = useCountUp(pct)

  return (
    <section className="course-progress" aria-label="Course progress">
      <div className="course-progress-head">
        <span className="course-progress-pct">{shown}%</span>
        <span>
          <strong>Course progress</strong>
          <span className="muted">
            {' '}· {missionsComplete} of {sessions.length} missions complete · {live.length} live
          </span>
        </span>
      </div>
      <div className="course-segments">
        {rows.map(({ s, meta, p }) => (
          <div key={s.id} className="course-segment" title={`Mission ${s.number}: ${p.count}/${p.total} sections`}>
            <FillBar
              pct={Math.round((p.count / p.total) * 100)}
              label={`Mission ${s.number} progress`}
              color={`linear-gradient(90deg, ${meta.accent}, #2DD4BF)`}
            />
            <span>M{String(s.number).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function DailyChallenge() {
  const { progress, answerDaily } = useProgress()
  const key = todayKey()
  const q = dailyQuestion(key)
  const saved = progress.daily[key]
  if (!q) return null
  const answered = Boolean(saved)
  const correct = saved?.correct

  return (
    <section className={`daily ${answered ? (correct ? 'is-win' : 'is-miss') : ''}`} aria-labelledby="daily-title">
      <div className="daily-head">
        <p className="eyebrow eyebrow-teal">Daily marketing challenge</p>
        <span className="reward-chip">
          <Icon name="bolt" size={14} /> +25 XP · once a day
        </span>
      </div>
      <h3 id="daily-title">{q.question}</h3>
      <div className="daily-options">
        {q.options.map((opt, i) => {
          let state = ''
          if (answered && i === q.answer) state = 'is-correct'
          else if (answered && i === saved.choice) state = 'is-wrong'
          return (
            <button
              key={opt}
              type="button"
              className={`daily-option ${state}`}
              onClick={() => answerDaily(key, i, i === q.answer)}
              disabled={answered}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="daily-feedback" role="status">
          <p className="daily-feedback-title">
            {correct ? 'Correct! +25 XP' : 'Not quite. No XP today, but now you know.'}
          </p>
          <p>{q.explanation}</p>
          <p className="muted">From Mission {String(q.sessionNumber).padStart(2, '0')} · A new challenge unlocks tomorrow.</p>
        </div>
      )}
    </section>
  )
}

export function BadgeShelf() {
  const { badges } = useProgress()
  return (
    <section id="badges" className="badge-shelf" aria-labelledby="badges-title">
      <div className="section-head-row">
        <div>
          <p className="eyebrow eyebrow-gold">Achievements</p>
          <h2 id="badges-title">Badges</h2>
        </div>
        <p className="muted">{badges.length} of {BADGES.length} unlocked</p>
      </div>
      <ul className="badge-grid">
        {BADGES.map((b) => {
          const on = badges.includes(b.id)
          return (
            <li key={b.id} className={`badge-card ${on ? 'is-unlocked' : ''}`}>
              <Medal unlocked={on} />
              <h3>{b.name}</h3>
              <p>{b.desc}</p>
              <span className="badge-state">{on ? 'Unlocked' : 'Locked'}</span>
            </li>
          )
        })}
      </ul>
      <details className="level-ladder">
        <summary>See all levels</summary>
        <ol>
          {LEVELS.map(([name, min], i) => (
            <li key={name}>
              <span>{i + 1}</span> {name} <em>{min} XP</em>
            </li>
          ))}
        </ol>
      </details>
    </section>
  )
}
