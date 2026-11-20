/*
  APP LAYOUT + PAGES
  The <Routes> list decides which screen shows for each web address.

    /                         title screen (choose or create a player)
    /profile                  create or edit your player + avatar
    /city                     Neo Metro city map (one district per session)
    /hq                       your headquarters: rank, avatar locker, badges
    /mission/:id              a mission tower (five floors)
    /mission/:id/complete     mission debrief, rewards and reflection
    /mission/:id/:section     one floor (learn, explore, play, challenge, boss)
    /session/:id              Intel Archive: the original session page,
                              including the classic quiz in its original format
    /reflections              learning journal (download as .txt)

  The HUD bar and footer show on every screen except the title screen's
  top bar. RewardLayer shows XP, badge and level-up pop-ups everywhere.
*/
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Home from './Home.jsx'
import Profile from './Profile.jsx'
import City from './City.jsx'
import HQ from './HQ.jsx'
import MissionHub from './MissionHub.jsx'
import MissionSection from './MissionSection.jsx'
import MissionComplete from './MissionComplete.jsx'
import SessionPage from './SessionPage.jsx'
import ReflectionsPage from './ReflectionsPage.jsx'
import NotFound from './NotFound.jsx'
import RewardLayer from './RewardLayer.jsx'

export default function App() {
  const { pathname, hash } = useLocation()
  const isTitle = pathname === '/'

  // New screen: scroll to the top, or to the section named in the link
  // (for example /session/session-2#game-title opens the classic quiz).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [pathname, hash])

  return (
    <div className={`app ${isTitle ? 'is-title' : ''}`}>
      {!isTitle && <Navbar />}
      <main className="main" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/city" element={<City />} />
          <Route path="/hq" element={<HQ />} />
          <Route path="/mission/:sessionId" element={<MissionHub />} />
          <Route path="/mission/:sessionId/complete" element={<MissionComplete />} />
          <Route path="/mission/:sessionId/:section" element={<MissionSection />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="/reflections" element={<ReflectionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <RewardLayer />
    </div>
  )
}
