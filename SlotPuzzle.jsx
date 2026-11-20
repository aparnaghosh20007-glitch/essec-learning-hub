/*
  SLOT PUZZLE (Explore floor) + SlotBoard (also used by the boss battle)
  Rounds of "order" (put steps in sequence) and "match" (pair a term with
  its meaning). Drag a card into a slot, or tap a card then tap a slot.
  "Lock in" checks the board: wrong cards bounce back so you can retry.
*/
import { Aria } from './Characters.jsx'
import { useMemo, useState } from 'react'
import { useDragDrop } from './useDragDrop.js'
import { Icon } from './GameUI.jsx'
import { playSound } from './sound.js'

export function shuffled(list, seed = Math.random()) {
  const copy = list.map((x, i) => ({ x, k: Math.sin((i + 1) * 9973 * (seed + 0.17)) }))
  copy.sort((a, b) => a.k - b.k)
  const out = copy.map((c) => c.x)
  // never hand the player the answer already in order
  if (out.length > 1 && out.every((x, i) => x === list[i])) out.push(out.shift())
  return out
}

/* A board of slots plus a pool of cards. Fully controlled by the parent. */
export function SlotBoard({ slots, items, placed, onPlace, onRemove, results, disabled, layout = 'match', poolLabel = 'Cards' }) {
  const [selected, setSelected] = useState(null)
  const dnd = useDragDrop({
    disabled,
    onDrop: (id, key) => {
      setSelected(null)
      if (key === '__pool') {
        const from = Object.keys(placed).find((k) => placed[k] === id)
        if (from) onRemove(from)
      } else onPlace(id, key)
    },
  })
  const placedIds = Object.values(placed)
  const pool = items.filter((it) => !placedIds.includes(it.id))
  const byId = Object.fromEntries(items.map((it) => [it.id, it]))

  function tapSlot(key) {
    if (disabled) return
    if (selected) {
      onPlace(selected, key)
      setSelected(null)
    } else if (placed[key]) onRemove(key)
  }

  function chip(it, where) {
    const p = dnd.itemProps(it.id)
    return (
      <button
        key={it.id}
        type="button"
        {...p}
        className={`chip ${p.className} ${selected === it.id ? 'is-selected' : ''} ${where === 'slot' ? 'chip-in-slot' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          if (disabled) return
          if (where === 'slot') {
            const key = Object.keys(placed).find((k) => placed[k] === it.id)
            if (selected && selected !== it.id) onPlace(selected, key)
            else onRemove(key)
            setSelected(null)
            return
          }
          setSelected(selected === it.id ? null : it.id)
        }}
        aria-pressed={where === 'pool' ? selected === it.id : undefined}
        disabled={disabled}
      >
        <span className="chip-grip" aria-hidden="true">⋮⋮</span>
        <span>{it.text}</span>
      </button>
    )
  }

  return (
    <div className={`slotboard slotboard-${layout}`}>
      <ol className="slots">
        {slots.map((s, i) => {
          const item = byId[placed[s.key]]
          const state = results ? (results[s.key] ? 'is-right' : results[s.key] === false ? 'is-wrong' : '') : ''
          return (
            <li key={s.key} className={`slot ${item ? 'is-filled' : ''} ${dnd.over === s.key ? 'is-over' : ''} ${selected && !item ? 'is-target' : ''} ${state}`} data-drop={s.key}>
              <div
                className="slot-label"
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => tapSlot(s.key)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tapSlot(s.key))}
                aria-label={`${layout === 'order' ? `Position ${i + 1}` : s.label}${item ? `: ${item.text}` : ': empty'}`}
              >
                {layout === 'order' ? <span className="slot-num">{i + 1}</span> : <span className="slot-term">{s.label}</span>}
              </div>
              <div className="slot-body" onClick={() => !item && tapSlot(s.key)}>
                {item ? chip(item, 'slot') : <span className="slot-empty">{selected ? 'Tap to place here' : 'Drop a card here'}</span>}
              </div>
            </li>
          )
        })}
      </ol>
      <div className={`pool ${dnd.over === '__pool' ? 'is-over' : ''}`} data-drop="__pool" aria-label={poolLabel}>
        <p className="mini-label">{pool.length ? `${poolLabel} · drag or tap` : 'All cards placed'}</p>
        <div className="pool-cards">{pool.map((it) => chip(it, 'pool'))}</div>
      </div>
      {dnd.drag && (
        <div className="chip chip-ghost" style={dnd.ghostStyle} aria-hidden="true">
          <span className="chip-grip">⋮⋮</span>
          <span>{byId[dnd.drag.id]?.text}</span>
        </div>
      )}
    </div>
  )
}

function roundSetup(round) {
  if (round.type === 'order') {
    const slots = round.items.map((_, i) => ({ key: `s${i}`, label: `Step ${i + 1}`, answer: `i${i}` }))
    const items = shuffled(round.items.map((text, i) => ({ id: `i${i}`, text })))
    return { slots, items }
  }
  const slots = round.pairs.map((p, i) => ({ key: `s${i}`, label: p.left, answer: `i${i}` }))
  const items = shuffled(round.pairs.map((p, i) => ({ id: `i${i}`, text: p.right })))
  return { slots, items }
}

export default function SlotPuzzle({ content, onComplete }) {
  const [r, setR] = useState(0)
  const [placed, setPlaced] = useState({})
  const [results, setResults] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [cleared, setCleared] = useState(false)
  const [message, setMessage] = useState(null)
  const round = content.rounds[r]
  const setup = useMemo(() => roundSetup(round), [round])

  function place(id, key) {
    playSound('place')
    setResults(null)
    setMessage(null)
    setPlaced((p) => {
      const next = { ...p }
      const from = Object.keys(next).find((k) => next[k] === id)
      const swap = next[key]
      if (from) delete next[from]
      if (swap && from) next[from] = swap
      next[key] = id
      return next
    })
  }
  function remove(key) {
    setResults(null)
    setPlaced((p) => {
      const next = { ...p }
      delete next[key]
      return next
    })
  }

  function lockIn() {
    const res = Object.fromEntries(setup.slots.map((s) => [s.key, placed[s.key] === s.answer]))
    const wrong = Object.values(res).filter((v) => !v).length
    setResults(res)
    if (wrong === 0) {
      setCleared(true)
      playSound('good')
      setMessage({ ok: true, text: 'Board locked. Every card is in the right place.' })
    } else {
      setMistakes((m) => m + wrong)
      playSound('bad')
      setMessage({ ok: false, text: `${wrong} card${wrong > 1 ? 's are' : ' is'} in the wrong place. They bounce back to your hand. Try again.` })
      setTimeout(() => {
        setPlaced((p) => Object.fromEntries(Object.entries(p).filter(([k]) => res[k])))
        setResults((cur) => (cur ? Object.fromEntries(Object.entries(cur).filter(([, v]) => v)) : cur))
      }, 900)
    }
  }

  function nextRound() {
    if (r + 1 < content.rounds.length) {
      setR(r + 1)
      setPlaced({})
      setResults(null)
      setCleared(false)
      setMessage(null)
    } else onComplete({ mistakes })
  }

  const full = Object.keys(placed).length === setup.slots.length

  return (
    <div className="puzzle">
      <header className="engine-head">
        <p className="engine-kicker">
          Round {r + 1} of {content.rounds.length} · {round.type === 'order' ? 'Order' : 'Match'}
        </p>
        <h2>{round.title}</h2>
        <p>{round.prompt}</p>
        <div className="round-pips" aria-hidden="true">
          {content.rounds.map((_, i) => (
            <span key={i} className={i < r || (i === r && cleared) ? 'is-done' : i === r ? 'is-now' : ''} />
          ))}
        </div>
      </header>

      <SlotBoard key={r} slots={setup.slots} items={setup.items} placed={placed} onPlace={place} onRemove={remove} results={results} disabled={cleared} layout={round.type} />

      {message && (
        <div className={`consequence ${message.ok ? 'is-best' : 'is-bad'}`} role="status">
          <Aria mood={message.ok ? 'cheer' : 'think'} size={56} float={false} className="consequence-aria" />
          <p className="consequence-title">{message.ok ? 'Round clear' : 'Not yet'}</p>
          <p>{message.text}</p>
        </div>
      )}
      <p className="source-tag">Source: {round.source}</p>
      <div className="engine-actions">
        {!cleared ? (
          <button type="button" className="button button-primary" onClick={lockIn} disabled={!full}>
            <Icon name="check" size={18} /> Lock in
          </button>
        ) : (
          <button type="button" className="button button-gold" onClick={nextRound} autoFocus>
            {r + 1 < content.rounds.length ? 'Next round' : 'Clear this floor'} <Icon name="arrow" size={18} />
          </button>
        )}
        <span className="muted small">Mistakes: {mistakes}</span>
      </div>
    </div>
  )
}
