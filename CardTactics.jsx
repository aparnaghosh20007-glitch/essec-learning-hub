/*
  CARD TACTICS (Play floor)
  A hand of strategy cards and a board of slots around a core idea.
  Drag (or tap) each card onto the slot it answers. Trap cards and wrong
  slots cost a point of the meter (trust/stability). Lose them all and the
  round fails, so you retry. Calls onComplete({ perfect }) on a win.
*/
import { Aria } from './Characters.jsx'
import { useState } from 'react'
import { playSound } from './sound.js'
import { useDragDrop } from './useDragDrop.js'
import { Icon, Confetti } from './GameUI.jsx'
import { shuffled } from './SlotPuzzle.jsx'

const MAX = 3

export default function CardTactics({ content, startPenalty = 0, onComplete }) {
  const [attempt, setAttempt] = useState(0)
  const [hand] = useState(() => shuffled(content.cards))
  const [placed, setPlaced] = useState({}) // slotKey → cardId
  const [used, setUsed] = useState([]) // trap cards already played
  const [trust, setTrust] = useState(MAX - startPenalty)
  const [mistakes, setMistakes] = useState(0)
  const [selected, setSelected] = useState(null)
  const [msg, setMsg] = useState(startPenalty ? { kind: 'warn', title: 'Your opening call', text: `You start with ${MAX - startPenalty} of ${MAX} ${content.meter.toLowerCase()} because of your first call in the briefing.` } : null)
  const [shake, setShake] = useState(null)

  const slotsDone = Object.keys(placed).length === content.slots.length
  const lost = trust <= 0
  const byId = Object.fromEntries(content.cards.map((c) => [c.id, c]))

  function play(cardId, slotKey) {
    if (lost || slotsDone) return
    const card = byId[cardId]
    setSelected(null)
    if (placed[slotKey]) return
    if (!card.slot) {
      setTrust((t) => t - 1)
      setMistakes((m) => m + 1)
      setUsed((u) => [...u, card.id])
      setShake(slotKey)
      playSound('bad')
      setMsg({ kind: 'bad', title: `Trap card · −1 ${content.meter.toLowerCase()}`, text: card.why })
    } else if (card.slot === slotKey) {
      setPlaced((p) => ({ ...p, [slotKey]: card.id }))
      playSound('good')
      setMsg({ kind: 'good', title: 'Strong play', text: card.why })
    } else {
      setTrust((t) => t - 1)
      setMistakes((m) => m + 1)
      setShake(slotKey)
      playSound('bad')
      const slot = content.slots.find((s) => s.key === slotKey)
      setMsg({ kind: 'bad', title: `Wrong slot · −1 ${content.meter.toLowerCase()}`, text: `“${card.title}” does not answer ${slot.question} Try another slot.` })
    }
    setTimeout(() => setShake(null), 500)
  }

  const dnd = useDragDrop({ disabled: lost || slotsDone, onDrop: (id, key) => play(id, key) })

  function retry() {
    setAttempt((a) => a + 1)
    setPlaced({})
    setUsed([])
    setTrust(MAX)
    setMistakes(0)
    setSelected(null)
    setMsg({ kind: 'warn', title: 'New attempt', text: `${content.meter} restored to ${MAX}.` })
  }

  const inHand = hand.filter((c) => !used.includes(c.id) && !Object.values(placed).includes(c.id))

  return (
    <div className="tactics" key={attempt}>
      <header className="engine-head">
        <p className="engine-kicker">Strategy cards</p>
        <h2>{content.title}</h2>
        <p>{content.intro}</p>
      </header>

      <div className="tactics-hud">
        <span className="meter" aria-label={`${content.meter}: ${Math.max(0, trust)} of ${MAX}`}>
          {content.meter}
          {Array.from({ length: MAX }, (_, i) => (
            <span key={i} className={`meter-pip ${i < trust ? 'is-on' : ''}`} />
          ))}
        </span>
        <span className="muted small">{Object.keys(placed).length} / {content.slots.length} slots</span>
      </div>

      <div className="tactics-board">
        <div className="core-card">
          <p className="core-label">{content.core.label}</p>
          <p className="core-text">{content.core.text}</p>
          <p className="source-tag">Source: {content.core.source}</p>
        </div>
        <div className="tactic-slots">
          {content.slots.map((s) => {
            const card = byId[placed[s.key]]
            const tap = () => selected && play(selected, s.key)
            return (
              <button
                key={s.key}
                type="button"
                data-drop={s.key}
                className={`tactic-slot ${card ? 'is-filled' : ''} ${dnd.over === s.key ? 'is-over' : ''} ${selected && !card ? 'is-target' : ''} ${shake === s.key ? 'is-shake' : ''}`}
                onClick={tap}
                aria-label={`${s.label}, ${s.question}${card ? `: ${card.title}` : ': empty'}`}
                disabled={!!card}
              >
                <span className="tactic-slot-label">{s.label}</span>
                <span className="tactic-slot-q">{s.question}</span>
                {card ? (
                  <span className="tactic-slot-card">
                    <Icon name="check" size={16} stroke={3} /> {card.text}
                  </span>
                ) : (
                  <span className="tactic-slot-hint">{selected ? 'Place it here' : 'Empty slot'}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {msg && (
        <div className={`consequence is-${msg.kind === 'good' ? 'best' : msg.kind === 'bad' ? 'bad' : 'ok'}`} role="status">
          <Aria mood={msg.kind === 'good' ? 'happy' : msg.kind === 'bad' ? 'worry' : 'think'} size={56} float={false} className="consequence-aria" />
          <p className="consequence-title">{msg.title}</p>
          <p>{msg.text}</p>
        </div>
      )}

      {!slotsDone && !lost && (
        <div className="hand" aria-label="Your hand">
          {inHand.map((c) => {
            const p = dnd.itemProps(c.id)
            return (
              <button
                key={c.id}
                type="button"
                {...p}
                className={`card ${c.tag === 'TRAP' ? 'card-trap' : c.tag === 'ACTION' ? 'card-action' : ''} ${p.className} ${selected === c.id ? 'is-selected' : ''}`}
                onClick={() => setSelected(selected === c.id ? null : c.id)}
                aria-pressed={selected === c.id}
              >
                <span className="card-tag">{c.tag === 'TRAP' ? 'TACTIC' : c.tag}</span>
                <span className="card-title">{c.title}</span>
                <span className="card-text">{c.text}</span>
              </button>
            )
          })}
        </div>
      )}
      {dnd.drag && (
        <div className="card card-ghost" style={dnd.ghostStyle} aria-hidden="true">
          <span className="card-title">{byId[dnd.drag.id]?.title}</span>
          <span className="card-text">{byId[dnd.drag.id]?.text}</span>
        </div>
      )}

      {lost && (
        <div className="fail-panel" role="alert">
          <p className="fail-title">{content.meter} lost</p>
          <p>The campaign is compromised. Every wrong move taught you something: try again with a full {content.meter.toLowerCase()} meter.</p>
          <button type="button" className="button button-primary" onClick={retry} autoFocus>
            Retry the round
          </button>
        </div>
      )}

      {slotsDone && (
        <div className="win-panel" role="status">
          <Confetti pieces={50} />
          <p className="win-title">{content.result.label}</p>
          <p className="win-text">{content.result.text}</p>
          <p className="muted small">{mistakes === 0 ? 'Flawless: no trust lost.' : `${mistakes} mistake${mistakes > 1 ? 's' : ''} on the way.`}</p>
          <p className="source-tag">Source: {content.source}</p>
          <button type="button" className="button button-gold" onClick={() => onComplete({ perfect: mistakes === 0 })} autoFocus>
            Clear this floor <Icon name="arrow" size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
