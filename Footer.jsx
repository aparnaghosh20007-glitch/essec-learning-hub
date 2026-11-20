/*
  FOOTER
  Shows the public creator credit (from creator.js) on every screen.
*/
import { CREATOR_CREDIT } from './creator.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-credit">{CREATOR_CREDIT}</p>
        <p>Session Lab · Neon Metropolis Tactics · Digital Platforms</p>
        <p className="muted">Profiles, XP, badges, scores and reflections are saved privately in this browser. No student numbers or photos are used.</p>
      </div>
    </footer>
  )
}
