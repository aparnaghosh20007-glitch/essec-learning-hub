/*
  SCENE
  The layered, animated environment behind every game screen. Visual only.
    sky → stars/moon → searchlights → far / mid / near skyline (windows light
    up with progress) → neon signs → wet street with reflections → fog → rain
  Optional "room" overlays turn the city view into an interior:
    room="window"  a panoramic window with rain running down the glass (HQ, briefings)
    room="dome"    the glass dome and workbenches of the Prompt Lab
    room="rooftop" a storm rooftop with lightning (boss battles)
  `lit` (0–1) controls how many windows glow: the city lights up as you progress.
  Layers drift slightly with the mouse (or phone tilt). Respects "reduce motion".
*/
import { useEffect, useMemo, useRef } from 'react'

export const THEMES = {
  city: { sky: ['#03041A', '#100D3A', '#2B1760'], neon: ['#8B5CF6', '#2DD4BF'], glow: 'rgba(139,92,246,.45)', signs: [['BRAND', '#F0ABFC'], ['SIGNAL', '#2DD4BF'], ['OPEN 24/7', '#FCD34D'], ['INSIGHT', '#60A5FA'], ['LAUNCH', '#F472B6']] },
  lab: { sky: ['#020A1E', '#0A1D4A', '#14408A'], neon: ['#3B82F6', '#22D3EE'], glow: 'rgba(59,130,246,.55)', signs: [['PROTOTYPE', '#93C5FD'], ['BUILD', '#22D3EE'], ['DEPLOY', '#5EEAD4']] },
  agency: { sky: ['#07041C', '#1C0C48', '#3E1670'], neon: ['#F0ABFC', '#A855F7'], glow: 'rgba(168,85,247,.55)', signs: [['AGENCY', '#F0ABFC'], ['BRIEF', '#5EEAD4'], ['STUDIO', '#FCD34D'], ['REVIEW', '#A78BFA']] },
  network: { sky: ['#02131A', '#0A2A33', '#0F3D45'], neon: ['#2DD4BF', '#5EEAD4'], glow: 'rgba(45,212,191,.4)', signs: [['CONNECT', '#5EEAD4'], ['NETWORK', '#2DD4BF']] },
  hq: { sky: ['#050620', '#1A1450', '#3B1C6E'], neon: ['#FCD34D', '#A78BFA'], glow: 'rgba(252,211,77,.3)', signs: [['SESSION LAB', '#FCD34D'], ['SIGNAL', '#5EEAD4'], ['BRAND', '#F0ABFC']] },
  boss: { sky: ['#05020D', '#1E0828', '#3E0C34'], neon: ['#F43F5E', '#A855F7'], glow: 'rgba(244,63,94,.45)', signs: [] },
  dim: { sky: ['#04050F', '#0B0E22', '#151935'], neon: ['#475569', '#64748B'], glow: 'rgba(100,116,139,.25)', signs: [['NO SIGNAL', '#818CF8']] },
}

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildLayer(seed, count, minH, maxH, windowsPer) {
  const r = rng(seed)
  const width = 1600
  const step = width / count
  return Array.from({ length: count }, (_, i) => {
    const w = step * (0.6 + r() * 0.5)
    const h = minH + r() * (maxH - minH)
    const x = i * step + r() * step * 0.3 - step * 0.1
    const windows = Array.from({ length: windowsPer }, () => ({
      x: x + 4 + r() * Math.max(2, w - 10),
      y: 400 - h + 8 + r() * Math.max(4, h - 16),
      on: r(),
      tone: r() > 0.5 ? 0 : 1,
    }))
    const spire = r() > 0.82
    return { x, w, h, windows, spire, tone: r() > 0.5 ? 0 : 1 }
  })
}

const SIGN_SPOTS = [
  { left: 9, bottom: 34 },
  { left: 80, bottom: 39 },
  { left: 70, bottom: 26 },
  { left: 22, bottom: 22 },
  { left: 89, bottom: 22 },
]

const reduce = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Scene({ theme = 'city', lit = 0.5, rain = true, room = null, className = '', children, seed = 7 }) {
  const ref = useRef(null)
  const t = THEMES[theme] ?? THEMES.city
  const calm = reduce()
  const layers = useMemo(
    () => [buildLayer(seed, 34, 80, 220, 3), buildLayer(seed + 11, 24, 120, 300, 6), buildLayer(seed + 23, 14, 160, 340, 10)],
    [seed],
  )
  const drops = useMemo(() => {
    const r = rng(seed + 5)
    return Array.from({ length: 96 }, (_, i) => {
      const near = i % 4 === 0
      return { left: r() * 104, delay: r() * 2, dur: near ? 0.5 + r() * 0.2 : 0.75 + r() * 0.4, h: near ? 30 + r() * 12 : 12 + r() * 14, o: near ? 0.55 : 0.18 + r() * 0.25, w: near ? 1.6 : 1 }
    })
  }, [seed])
  const streaks = useMemo(() => {
    const r = rng(seed + 3)
    return Array.from({ length: 26 }, () => ({ left: r() * 100, delay: r() * 4, dur: 2.6 + r() * 2.4, h: 40 + r() * 80 }))
  }, [seed])
  const beads = useMemo(() => {
    const r = rng(seed + 4)
    return Array.from({ length: 36 }, () => ({ left: r() * 100, top: r() * 92, s: 3 + r() * 5 }))
  }, [seed])
  const ripples = useMemo(() => {
    const r = rng(seed + 6)
    return Array.from({ length: 9 }, () => ({ left: r() * 96, bottom: r() * 12, delay: r() * 2.2 }))
  }, [seed])
  const stars = useMemo(() => {
    const r = rng(seed + 9)
    return Array.from({ length: 60 }, () => ({ x: r() * 100, y: r() * 40, s: r() > 0.85 ? 2 : 1, d: r() * 4 }))
  }, [seed])
  const motes = useMemo(() => {
    const r = rng(seed + 8)
    return Array.from({ length: 22 }, () => ({ left: r() * 100, bottom: r() * 40, delay: r() * 6, c: r() > 0.5 }))
  }, [seed])

  // Parallax: move layers a little with the pointer or device tilt.
  useEffect(() => {
    const el = ref.current
    if (!el || reduce()) return
    let frame = 0
    const set = (x, y) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }
    const onMove = (e) => set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
    const onTilt = (e) => {
      if (e.gamma == null) return
      set(Math.max(-0.5, Math.min(0.5, e.gamma / 60)), Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 80)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  const indoor = room === 'window' || room === 'dome'
  const showRain = rain && !calm && !indoor

  return (
    <div
      ref={ref}
      className={`scene scene-${theme} ${room ? `has-room room-${room}` : ''} ${className}`}
      style={{
        '--sky1': t.sky[0],
        '--sky2': t.sky[1],
        '--sky3': t.sky[2],
        '--neon1': t.neon[0],
        '--neon2': t.neon[1],
        '--glow': t.glow,
      }}
    >
      <div className="scene-bg" aria-hidden="true">
        <div className="scene-sky" />
        <div className="scene-stars">
          {stars.map((s, i) => (
            <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
          ))}
        </div>
        <div className="scene-moon" />
        <span className="scene-beam scene-beam-a" />
        <span className="scene-beam scene-beam-b" />
        {room === 'rooftop' && (
          <>
            <div className="scene-clouds" />
            <span className="scene-flash" />
            <svg className="scene-bolt" viewBox="0 0 200 600" preserveAspectRatio="none">
              <path d="M140 0 L 100 120 L 132 126 L 70 290 L 106 296 L 30 470" />
              <path d="M100 120 L 50 170 M70 290 L 120 340" className="thin" />
            </svg>
          </>
        )}
        {layers.map((layer, li) => (
          <svg key={li} className={`scene-layer scene-layer-${li}`} viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice">
            {layer.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={400 - b.h} width={b.w} height={b.h} fill={li === 2 ? '#090820' : li === 1 ? '#110E36' : '#1A1648'} opacity={li === 0 ? 0.8 : 1} />
                <rect x={b.x} y={400 - b.h} width={b.w} height="2.5" fill={b.tone ? 'var(--neon1)' : 'var(--neon2)'} opacity={0.4 + li * 0.2} />
                {b.spire && <rect className="spire" x={b.x + b.w / 2 - 1.5} y={400 - b.h - 30} width="3" height="30" fill="var(--neon1)" opacity=".8" />}
                {b.windows.map((w, k) => (
                  <rect
                    key={k}
                    className={w.on < lit * 0.25 ? 'win-flicker' : undefined}
                    x={w.x}
                    y={w.y}
                    width={li === 2 ? 5 : 3}
                    height={li === 2 ? 7 : 4}
                    fill={w.tone ? 'var(--neon1)' : 'var(--neon2)'}
                    opacity={w.on < lit ? 0.9 : 0.08}
                  />
                ))}
              </g>
            ))}
          </svg>
        ))}
        {room !== 'rooftop' &&
          t.signs.map(([text, color], i) => (
            <span key={text} className={`scene-sign scene-sign-${i}`} style={{ left: `${SIGN_SPOTS[i].left}%`, bottom: `${SIGN_SPOTS[i].bottom}%`, '--c': color, animationDelay: `${i * 1.3}s` }}>
              {text}
            </span>
          ))}
        <div className="scene-street">
          {room !== 'rooftop' &&
            t.signs.map(([text, color], i) => <span key={text} className="scene-refl" style={{ left: `${SIGN_SPOTS[i].left + 1}%`, '--c': color }} />)}
          <span className="scene-refl scene-refl-wide" />
          {!calm && ripples.map((p, i) => <span key={i} className="scene-ripple" style={{ left: `${p.left}%`, bottom: `${p.bottom}%`, animationDelay: `${p.delay}s` }} />)}
        </div>
        <div className="scene-fog" />
        <div className="scene-haze" />
        {showRain && (
          <div className="scene-rain">
            {drops.map((d, i) => (
              <span key={i} style={{ left: `${d.left}%`, height: d.h, width: d.w, opacity: d.o, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
            ))}
          </div>
        )}
        {room === 'rooftop' && (
          <div className="scene-roof">
            <span className="scene-pad" />
            <span className="scene-pad scene-pad-inner" />
          </div>
        )}
        {room === 'window' && (
          <div className="scene-room">
            <div className="scene-glass">
              {!calm && streaks.map((s, i) => <span key={i} className="scene-streak" style={{ left: `${s.left}%`, height: s.h, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />)}
              {beads.map((b, i) => <span key={i} className="scene-bead" style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.s, height: b.s + 1 }} />)}
            </div>
            <div className="scene-mullions" />
            <div className="scene-ceiling" />
            <div className="scene-floor" />
          </div>
        )}
        {room === 'dome' && (
          <div className="scene-room scene-lab">
            <svg className="scene-dome" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMin slice">
              <path d="M-60 560 Q 720 -160 1500 560" />
              <path d="M60 560 Q 720 -60 1380 560" />
              <path d="M180 560 Q 720 40 1260 560" />
              <path className="rib" d="M720 40 V 560 M380 110 L 470 560 M1060 110 L 970 560 M150 270 L 290 560 M1290 270 L 1150 560" />
            </svg>
            {!calm && streaks.slice(0, 14).map((s, i) => <span key={i} className="scene-streak" style={{ left: `${s.left}%`, height: s.h * 0.7, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />)}
            <div className="scene-floor scene-floor-lab" />
            <span className="scene-bench scene-bench-l" />
            <span className="scene-bench scene-bench-r" />
            {!calm && motes.map((m, i) => <span key={i} className={`scene-mote ${m.c ? 'is-teal' : ''}`} style={{ left: `${m.left}%`, bottom: `${m.bottom}%`, animationDelay: `${m.delay}s` }} />)}
          </div>
        )}
        <div className="scene-vignette" />
      </div>
      <div className="scene-content">{children}</div>
    </div>
  )
}
