/*
  HUD (top bar on every game screen)
  Logo, the three main places (City, HQ, Journal) and the player chip:
  illustrated avatar, name, rank and live XP that rolls up when earned.
*/
import { NavLink, Link } from 'react-router-dom'
import { useProgress } from './ProgressContext.jsx'
import Avatar from './Avatar.jsx'
import SoundToggle from './SoundToggle.jsx'
import { Icon, useCountUp } from './GameUI.jsx'

export default function Navbar() {
  const { profile, displayName, avatar, xp, level } = useProgress()
  const shownXp = useCountUp(xp)

  return (
    <header className="hud">
      <div className="hud-inner container">
        <Link to="/" className="brand" aria-label="Session Lab title screen">
          <span className="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l9 5v10l-9 5-9-5V7z" />
              <path d="M12 22V12M21 7l-9 5-9-5" />
            </svg>
          </span>
          <span className="brand-text">
            SESSION LAB
            <small>Neon Metropolis Tactics</small>
          </span>
        </Link>

        <nav className="hud-links" aria-label="Main">
          <NavLink to="/city">City</NavLink>
          <NavLink to="/hq">HQ</NavLink>
          <NavLink to="/reflections">Journal</NavLink>
        </nav>

        <SoundToggle />

        {profile ? (
          <Link to="/hq" className="hud-player" title={`${displayName} · Level ${level.level} ${level.name}`}>
            <Avatar look={avatar} size={38} />
            <span className="hud-player-text">
              <span className="hud-name">{displayName}</span>
              <span className="hud-rank">
                L{level.level} {level.name}
              </span>
            </span>
            <span className="nav-xp-amount" aria-label={`${xp} XP`}>
              <Icon name="bolt" size={14} /> {shownXp}
            </span>
          </Link>
        ) : (
          <Link to="/profile?new=1" className="button button-gold button-small">
            Create player
          </Link>
        )}
      </div>
    </header>
  )
}
