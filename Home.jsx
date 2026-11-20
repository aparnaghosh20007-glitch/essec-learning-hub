/*
  TITLE SCREEN (homepage, "/")
  The cinematic opening of Session Lab: Neon Metropolis Tactics.
  First visit: choose the creator profile or create your own player.
  Returning players: continue the quest where they left off.
*/
import { Link, useNavigate } from 'react-router-dom'
import Scene from './Scene.jsx'
import Avatar from './Avatar.jsx'
import SoundToggle from './SoundToggle.jsx'
import { CreatorCard } from './Profile.jsx'
import { useProgress } from './ProgressContext.jsx'
import { liveSessions, missionProgress, missionMeta, MISSION_XP } from './game.js'
import { AriaSays } from './Characters.jsx'
import { CREATOR_CREDIT, COURSE } from './creator.js'
import { Icon, FillBar } from './GameUI.jsx'

export default function Home() {
  const { profile, displayName, details, avatar, level, xp, progress, saveProfile, missionsComplete } = useProgress()
  const navigate = useNavigate()
  const live = liveSessions()
  const lit = live.length ? 0.25 + (0.75 * missionsComplete) / live.length : 0.3
  const nextMission = live.find((s) => !missionProgress(s, progress.awards).complete)

  return (
    <Scene theme="city" lit={lit} className="title-scene">
      <div className="title-sound"><SoundToggle withLabel /></div>
      <div className="title-wrap">
        <p className="title-course">{COURSE}</p>
        <h1 className="title-logo">
          <span className="title-logo-main">SESSION LAB</span>
          <span className="title-logo-sub">Neon Metropolis Tactics</span>
        </h1>
        <p className="title-welcome">{profile ? `Welcome back, ${displayName.split(' ')[0]}` : 'Welcome to Session Lab'}</p>
        <p className="title-tagline">Your Marketing Quest Starts Here</p>
        <p className="title-story">
          Neo Metro has gone dark. Each district powers back on when you master a guest-speaker session. Rise from Marketing Explorer to Chief Marketing Officer.
        </p>
        <AriaSays mood="happy" size={88} className="title-aria">
          {profile
            ? nextMission
              ? `Welcome back, ${displayName.split(' ')[0]}. ${missionMeta(nextMission).district} is waiting for you.`
              : `Welcome back, ${displayName.split(' ')[0]}. Every live district is shining.`
            : 'Welcome to Neo Metro. The city has gone dark. Choose your player and help me bring it back online.'}
        </AriaSays>

        {profile ? (
          <div className="title-continue">
            <div className="title-player">
              <Avatar look={avatar} size={64} />
              <div>
                <p className="title-player-name">{displayName}</p>
                {(details.programme || details.institution) && (
                  <p className="title-player-programme">
                    {[details.programme, details.institution, details.campus].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="muted small">
                  Level {level.level} · {level.name} · {xp} XP
                </p>
                <FillBar pct={level.pct} label="XP towards next level" className="fillbar-xp" />
              </div>
            </div>
            <div className="title-buttons">
              <Link to={nextMission ? `/mission/${nextMission.id}` : '/city'} className="button button-gold button-large">
                {xp > 0 ? 'Continue your quest' : 'Start your quest'} <Icon name="arrow" size={18} />
              </Link>
              <Link to="/city" className="button button-primary">Enter Neo Metro</Link>
              <Link to="/profile" className="button button-ghost">Switch or edit profile</Link>
            </div>
            <p className="muted small">
              {missionsComplete} of {live.length} missions complete · up to {MISSION_XP} XP per mission
            </p>
          </div>
        ) : (
          <div className="title-choose">
            <h2 className="title-choose-head">Choose your player</h2>
            <div className="title-choose-grid">
              <CreatorCard
                action={
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => {
                      saveProfile({ mode: 'creator' })
                      navigate('/city')
                    }}
                  >
                    Play as the creator profile
                  </button>
                }
              />
              <article className="new-player-card">
                <p className="creator-kicker">New player</p>
                <div className="new-player-avatars" aria-hidden="true">
                  <Avatar look={{ skin: 3, hair: 'curls', hairColor: 1, outfit: 'hoodie', accent: 'blue' }} size={64} />
                  <Avatar look={{ skin: 0, hair: 'bun', hairColor: 3, outfit: 'turtleneck', accent: 'pink' }} size={64} />
                  <Avatar look={{ skin: 5, hair: 'buzz', hairColor: 0, outfit: 'blazer', accent: 'gold' }} size={64} />
                </div>
                <h3>Create your own player</h3>
                <p className="muted">Pick a name and design an illustrated avatar. Your progress is saved privately in your browser.</p>
                <Link to="/profile?new=1" className="button button-gold">
                  Create my player <Icon name="arrow" size={18} />
                </Link>
              </article>
            </div>
          </div>
        )}
        <p className="title-credit">{CREATOR_CREDIT}</p>
        <p className="title-fiction">Neo Metro and its characters are a fictional game world. Session content comes from the course materials.</p>
      </div>
    </Scene>
  )
}
