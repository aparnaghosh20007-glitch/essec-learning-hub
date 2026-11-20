/*
  DRAG AND DROP (mouse, touch and pen)
  ------------------------------------
  Works the same on laptops, tablets and phones using pointer events.
  Items can also be TAPPED (select) and then a slot tapped (place) —
  useful for keyboards, screen readers and small screens.
  While dragging near the top or bottom edge of the screen, the page
  scrolls, so cards can reach slots that are off-screen on a phone.

  Usage:
    const dnd = useDragDrop({ onDrop: (itemId, slotKey) => … })
    <button {...dnd.itemProps(id)} onClick={() => select(id)}>…</button>
    <div data-drop="slotKey">…</div>
    {dnd.drag && <div className="drag-ghost" style={dnd.ghostStyle}>…</div>}
*/
import { useEffect, useRef, useState } from 'react'

export function useDragDrop({ onDrop, disabled = false }) {
  const [drag, setDrag] = useState(null) // { id, x, y, w, h, dx, dy, over }
  const start = useRef(null)
  const justDragged = useRef(false)
  const dropRef = useRef(onDrop)
  useEffect(() => {
    dropRef.current = onDrop
  })

  useEffect(() => {
    let scrollFrame = 0
    let lastPoint = null
    function autoScroll() {
      cancelAnimationFrame(scrollFrame)
      const s = start.current
      if (!s?.active || !lastPoint) return
      const edge = 70
      // The sticky top bar covers the top of the screen, so the scroll zone starts below it.
      const top = (document.querySelector('.hud')?.getBoundingClientRect().bottom ?? 0) + edge
      const { y } = lastPoint
      const speed = y < top ? -Math.ceil(Math.min(top - y, edge * 2) / 6) : y > window.innerHeight - edge ? Math.ceil((y - (window.innerHeight - edge)) / 6) : 0
      if (speed) {
        window.scrollBy({ top: speed, behavior: 'instant' })
        setDrag((d) => (d ? { ...d, over: targetAt(lastPoint.x, lastPoint.y) } : d))
        scrollFrame = requestAnimationFrame(autoScroll)
      }
    }
    function targetAt(x, y) {
      const el = document.elementFromPoint(x, y)
      return el?.closest?.('[data-drop]')?.getAttribute('data-drop') ?? null
    }
    function move(e) {
      const s = start.current
      if (!s || e.pointerId !== s.pointerId) return
      const dist = Math.hypot(e.clientX - s.x, e.clientY - s.y)
      if (!s.active && dist < 7) return
      s.active = true
      e.preventDefault()
      lastPoint = { x: e.clientX, y: e.clientY }
      setDrag({ id: s.id, x: e.clientX, y: e.clientY, w: s.w, h: s.h, dx: s.dx, dy: s.dy, over: targetAt(e.clientX, e.clientY) })
      autoScroll()
    }
    function up(e) {
      const s = start.current
      if (!s || e.pointerId !== s.pointerId) return
      start.current = null
      cancelAnimationFrame(scrollFrame)
      if (s.active) {
        justDragged.current = true
        setTimeout(() => (justDragged.current = false), 60)
        const key = targetAt(e.clientX, e.clientY)
        setDrag(null)
        if (key) dropRef.current?.(s.id, key)
      }
    }
    function cancel() {
      cancelAnimationFrame(scrollFrame)
      start.current = null
      setDrag(null)
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      cancelAnimationFrame(scrollFrame)
    }
  }, [])

  function itemProps(id) {
    return {
      'data-drag-id': id,
      onPointerDown: (e) => {
        if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return
        const r = e.currentTarget.getBoundingClientRect()
        start.current = { id, x: e.clientX, y: e.clientY, pointerId: e.pointerId, w: r.width, h: r.height, dx: e.clientX - r.left, dy: e.clientY - r.top, active: false }
      },
      onClickCapture: (e) => {
        // A drag ends with a click event; ignore it so it isn't treated as a tap.
        if (justDragged.current) {
          e.stopPropagation()
          e.preventDefault()
        }
      },
      style: { touchAction: 'none' },
      className: drag?.id === id ? 'is-dragging' : '',
    }
  }

  const ghostStyle = drag
    ? { position: 'fixed', left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.w, height: drag.h, pointerEvents: 'none', zIndex: 200 }
    : null

  return { drag, itemProps, ghostStyle, over: drag?.over ?? null }
}
