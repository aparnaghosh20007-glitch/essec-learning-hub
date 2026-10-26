import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="session-hero-number">404</p>
      <h1>Page not found</h1>
      <p className="muted">This session or page doesn't exist (yet).</p>
      <Link to="/" className="button button-primary">Back to home</Link>
    </div>
  )
}
