/*
  HQ (/hq)
  Your headquarters: player profile, the career elevator (one floor per
  rank — your floor rises as you level up), the avatar locker with
  unlockable items, badges, the creator card and your learning journal.
*/
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import Avatar from './Avatar.jsx'
import { AvatarEditor, CreatorCard } from './Profile.jsx'
import { BadgeShelf } from './HomeWidgets.jsx'
import { useProgress } from './ProgressContext.jsx'
import { LEVELS, liveSessions } from './game.js'
import { FillBar, Icon, useCountUp } from './GameUI.jsx'
import { Aria } from './Characters.jsx'

export default function HQ() {
  const { profile, displayName, details, avatar, updateAvatar, level, xp, progress, missionsComplete, badges, resetProgress } = useProgress()
  const [look, setLook] = useState(avatar)
  const [saved, setSaved] = useState(false)
  const shownXp = useCountUp(xp)
  const bossScores = Object.values(progress.quizResults)
  const reflections = Object.entries(progress.reflections).filter(([, t]) => t?.trim()).length

  function saveLook(next) {
    setLook(next)
    updateAvatar(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  function handleReset() {
    if (window.confirm('Reset all XP, badges, quiz scores and reflections in this browser? Your profile and avatar stay. This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <Scene theme="hq" room="window" lit={0.2 + level.level / 9} className="page-scene">
      <div className="container hq-page">
        <header className="page-head">
          <p className="engine-kicker">Headquarters · floor {level.level}</p>
          <h1>Your HQ</h1>
          <p className="muted">Your office moves up a floor every time you reach a new rank.</p>
        </header>

        <div className="hq-hero">
          <section className="glass hq-profile" aria-label="Player profile">
            <div className="hq-profile-head">
              <Avatar look={avatar} size={110} title={`${displayName}'s avatar`} />
              <div>
                <p className="creator-kicker">{profile?.mode === 'creator' ? 'Creator profile' : 'Player profile'}</p>
                <h2>{displayName}</h2>
                {details.programme && <p className="muted small">{details.programme}</p>}
                {details.institution && <p className="muted small">{details.institution}</p>}
                {details.campus && <p className="muted small">{details.campus} campus</p>}
              </div>
            </div>
            <p className="hq-rank">
              <span className="hq-rank-num">{level.level}</span> {level.name}
            </p>
            <p className="hq-xp">
              <Icon name="bolt" size={16} /> {shownXp} XP
              <span className="muted small">{level.nextName ? ` · ${level.toNext} XP to ${level.nextName}` : ' · top rank reached'}</span>
            </p>
            <FillBar pct={level.pct} label="XP towards next rank" className="fillbar-xp" />
            <dl className="hq-stats">
              <div><dt>Missions</dt><dd>{missionsComplete}/{liveSessions().length}</dd></div>
              <div><dt>Badges</dt><dd>{badges.length}</dd></div>
              <div><dt>Boss best</dt><dd>{bossScores.length ? `${Math.max(...bossScores.map((r) => Math.round((r.best / r.total) * 100)))}%` : '—'}</dd></div>
              <div><dt>Reflections</dt><dd>{reflections}</dd></div>
            </dl>
            <div className="engine-actions">
              <Link to="/profile" className="button button-ghost button-small"><Icon name="edit" size={16} /> Edit profile</Link>
              <Link to="/reflections" className="button button-ghost button-small">Learning journal</Link>
            </div>
          </section>

          <div className="hq-pod" aria-hidden="true">
            <span className="hq-pod-glass" />
            <span className="hq-pod-scan" />
            <span className="hq-pod-ring" />
            <span className="hq-pod-ring hq-pod-ring-2" />
            <span className="hq-pod-base" />
            <Avatar look={avatar} size={300} variant="bust" className="hq-pod-avatar" />
            <div className="hq-pod-aria">
              <p className="hq-pod-bubble">{missionsComplete > 0 ? `Welcome back. ${missionsComplete === 1 ? 'One district' : `${missionsComplete} districts`} restored so far.` : 'Welcome to HQ. Your first district is waiting.'}</p>
              <Aria mood={missionsComplete > 0 ? 'cheer' : 'happy'} size={92} />
            </div>
          </div>

          <section className="glass hq-elevator" aria-labelledby="elevator-title">
            <h2 id="elevator-title">Career elevator</h2>
            <ol className="elevator">
              {[...LEVELS].map(([name, min], i) => ({ name, min, n: i + 1 })).reverse().map((f) => (
                <li key={f.n} className={`elevator-floor ${f.n === level.level ? 'is-here' : f.n < level.level ? 'is-past' : ''}`}>
                  <span className="elevator-num">{f.n}</span>
                  <span className="elevator-name">{f.name}</span>
                  <span className="elevator-xp">{f.min} XP</span>
                  {f.n === level.level && <span className="elevator-you">You are here</span>}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="glass" aria-labelledby="locker-title">
          <div className="section-head-row">
            <h2 id="locker-title">Avatar locker</h2>
            <span className="muted small" aria-live="polite">{saved ? 'Saved' : 'Changes save automatically'}</span>
          </div>
          <p className="muted">Earn new outfits, accessories and frames by ranking up, clearing missions and winning badges.</p>
          <AvatarEditor look={look} onChange={saveLook} />
        </section>

        <section className="glass">
          <BadgeShelf />
        </section>

        <div className="hq-grid">
          <section className="glass">
            <h2>About this game</h2>
            <CreatorCard />
          </section>
          <section className="glass">
            <h2>Privacy and saves</h2>
            <ul className="plain-list">
              <li>Your profile, avatar, XP, scores and reflections are saved only in this browser.</li>
              <li>Nobody else can see your progress. There are no logins and no leaderboards.</li>
              <li>XP is paid once per activity. Replays are for practice; a better boss score pays only the difference.</li>
              <li>No student numbers or photos are used anywhere.</li>
            </ul>
            <button type="button" className="link-button" onClick={handleReset}>
              Reset my progress in this browser
            </button>
          </section>
        </div>
      </div>
    </Scene>
  )
}
