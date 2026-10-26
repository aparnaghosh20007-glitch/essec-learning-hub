/*
  APP LAYOUT + PAGES
  Every page shares the Navbar and Footer. The <Routes> list decides which
  page shows for each web address.
*/
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import SessionPage from './pages/SessionPage.jsx'
import ReflectionsPage from './pages/ReflectionsPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { pathname, hash } = useLocation()

  // Scroll to the top whenever you switch page
  // (unless the link points to a section, like /#progress).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="/reflections" element={<ReflectionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
