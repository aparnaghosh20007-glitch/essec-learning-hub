/*
  PROFILE PAGE + AVATAR EDITOR + CREATOR CARD
  /profile — choose the creator profile or create your own player.
  Everything typed here is saved only in this browser. There is no
  student-number field, and no photos: avatars are illustrations.
*/
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useProgress } from './ProgressContext.jsx'
import Avatar from './Avatar.jsx'
import Scene from './Scene.jsx'
import { AVATAR, DEFAULT_AVATAR, isItemUnlocked } from './game.js'
import { CREATOR, CREATOR_CREDIT } from './creator.js'
import { Icon } from './GameUI.jsx'

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/* Pick skin, hair, outfit, accessory… Locked items show how to earn them. */
export function AvatarEditor({ look, onChange }) {
  const { unlockCtx } = useProgress()
  const a = { ...DEFAULT_AVATAR, ...look }
  const set = (k, v) => onChange({ ...a, [k]: v })

  function Items({ title, list, field }) {
    return (
      <fieldset className="wardrobe-row">
        <legend>{title}</legend>
        <div className="wardrobe-items">
          {list.map((item) => {
            const open = isItemUnlocked(item, unlockCtx)
            return (
              <button
                key={item.id}
                type="button"
                className={`wardrobe-item ${a[field] === item.id ? 'is-on' : ''} ${open ? '' : 'is-locked'}`}
                onClick={() => open && set(field, item.id)}
                aria-pressed={a[field] === item.id}
                aria-disabled={!open}
                title={open ? item.name : `Locked: ${item.unlock}`}
              >
                {!open && <Lock />} {item.name}
                {!open && <span className="wardrobe-unlock">{item.unlock}</span>}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  function Swatches({ title, colors, field }) {
    return (
      <fieldset className="wardrobe-row">
        <legend>{title}</legend>
        <div className="wardrobe-items">
          {colors.map((c, i) => (
            <button
              key={c}
              type="button"
              className={`swatch ${a[field] === i ? 'is-on' : ''}`}
              style={{ background: c }}
              onClick={() => set(field, i)}
              aria-label={`${title} ${i + 1}`}
              aria-pressed={a[field] === i}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  return (
    <div className="avatar-editor">
      <div className="avatar-stage">
        <Avatar look={a} size={168} />
        <span className="avatar-stage-ring" aria-hidden="true" />
      </div>
      <div className="wardrobe">
        {Swatches({ title: 'Skin tone', colors: AVATAR.skins, field: 'skin' })}
        {Items({ title: 'Hair', list: AVATAR.hairs, field: 'hair' })}
        {Swatches({ title: 'Hair colour', colors: AVATAR.hairColors, field: 'hairColor' })}
        {Items({ title: 'Outfit', list: AVATAR.outfits, field: 'outfit' })}
        <fieldset className="wardrobe-row">
          <legend>Accent colour</legend>
          <div className="wardrobe-items">
            {AVATAR.accents.map((x) => (
              <button
                key={x.id}
                type="button"
                className={`swatch ${a.accent === x.id ? 'is-on' : ''}`}
                style={{ background: x.color }}
                onClick={() => set('accent', x.id)}
                aria-label={`Accent ${x.id}`}
                aria-pressed={a.accent === x.id}
              />
            ))}
          </div>
        </fieldset>
        {Items({ title: 'Accessory', list: AVATAR.accessories, field: 'accessory' })}
        {Items({ title: 'Frame', list: AVATAR.frames, field: 'frame' })}
      </div>
    </div>
  )
}

/* The public creator card (same for every visitor). */
export function CreatorCard({ action }) {
  return (
    <article className="creator-card">
      <p className="creator-kicker">Creator profile</p>
      <div className="creator-head">
        <Avatar look={CREATOR.avatar} size={84} title={`${CREATOR.name}'s illustrated avatar`} />
        <div>
          <h3>{CREATOR.name}</h3>
          <p className="muted small">Starting rank: {CREATOR.startingRank}</p>
        </div>
      </div>
      <dl className="creator-facts">
        <div><dt>Institution</dt><dd>{CREATOR.institution}</dd></div>
        <div><dt>Programme</dt><dd>{CREATOR.programme}</dd></div>
        <div><dt>Campus</dt><dd>{CREATOR.campus}</dd></div>
      </dl>
      <p className="creator-credit">{CREATOR_CREDIT}</p>
      {action}
    </article>
  )
}

export default function Profile() {
  const { profile, progress, saveProfile } = useProgress()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const startCustom = params.get('new') === '1' || profile?.mode === 'custom' || !profile
  const [mode, setMode] = useState(params.get('mode') === 'creator' ? 'creator' : startCustom ? 'custom' : 'creator')
  const [form, setForm] = useState(() => ({
    name: profile?.mode === 'custom' ? profile.name : progress.playerName || '',
    institution: profile?.mode === 'custom' ? profile.institution : '',
    programme: profile?.mode === 'custom' ? profile.programme : '',
    campus: profile?.mode === 'custom' ? profile.campus : '',
  }))
  const [look, setLook] = useState(() =>
    profile?.avatar ? profile.avatar : mode === 'creator' ? CREATOR.avatar : DEFAULT_AVATAR,
  )
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (mode === 'custom' && !form.name.trim()) {
      setError('Please choose a player name.')
      return
    }
    saveProfile({ mode, ...form, avatar: look })
    navigate('/city')
  }

  const field = (key, label, hint, max) => (
    <label className="field">
      <span>{label}</span>
      <input
        value={form[key]}
        maxLength={max}
        onChange={(e) => {
          setError('')
          setForm({ ...form, [key]: e.target.value })
        }}
        placeholder={hint}
        autoComplete="off"
      />
    </label>
  )

  return (
    <Scene theme="hq" lit={0.4} className="page-scene">
      <div className="container profile-page">
        <header className="page-head">
          <p className="engine-kicker">Player profile</p>
          <h1>{profile ? 'Edit your player' : 'Create your player'}</h1>
          <p className="muted">Your profile, avatar and progress are saved only in this browser. Nobody else can see them.</p>
        </header>

        <div className="mode-toggle" role="radiogroup" aria-label="Profile type">
          <button type="button" role="radio" aria-checked={mode === 'custom'} className={mode === 'custom' ? 'is-on' : ''} onClick={() => { setMode('custom'); if (profile?.mode !== 'custom') setLook(profile?.mode === 'custom' ? profile.avatar : DEFAULT_AVATAR) }}>
            My own player
          </button>
          <button type="button" role="radio" aria-checked={mode === 'creator'} className={mode === 'creator' ? 'is-on' : ''} onClick={() => { setMode('creator'); setLook(profile?.mode === 'creator' ? profile.avatar : CREATOR.avatar) }}>
            Creator profile
          </button>
        </div>

        <form className="profile-grid" onSubmit={submit}>
          <section className="glass">
            {mode === 'custom' ? (
              <>
                <h2>Your details</h2>
                {field('name', 'Player name (required)', 'e.g. Alex', 24)}
                {field('institution', 'Institution (optional)', 'e.g. your school', 60)}
                {field('programme', 'Programme (optional)', 'e.g. your programme', 60)}
                {field('campus', 'Campus (optional)', 'e.g. your campus', 40)}
                <p className="privacy-note">
                  <Icon name="check" size={14} stroke={3} /> No student number or ID is needed or stored. Please don’t type private information here.
                </p>
                <p className="muted small">Everyone starts as a Marketing Explorer.</p>
                {error && <p className="form-error" role="alert">{error}</p>}
              </>
            ) : (
              <CreatorCard />
            )}
          </section>
          <section className="glass">
            <h2>Illustrated avatar</h2>
            <AvatarEditor look={look} onChange={setLook} />
          </section>
          <div className="profile-actions">
            <button type="submit" className="button button-gold button-large">
              {mode === 'creator' ? 'Play as the creator profile' : 'Save and enter Neo Metro'} <Icon name="arrow" size={18} />
            </button>
            <Link to={profile ? '/hq' : '/'} className="button button-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </Scene>
  )
}
