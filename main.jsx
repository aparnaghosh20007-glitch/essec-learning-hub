import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import './game.css'
import './visual.css'
import App from './App.jsx'
import { ProgressProvider } from './state/ProgressContext.jsx'

// A private review copy is built with VITE_HASH_ROUTER=1 so it works from any address.
// The real site (Vercel) uses normal addresses like /city.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </Router>
  </StrictMode>,
)
