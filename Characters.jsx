/*
  CHARACTERS (fictional story layer)
  - Aria: the floating robot companion. Moods: happy, think, cheer, worry.
  - AriaSays: ARIA with a speech bubble.
  - Static: the glitch villain shown in boss battles. The battles themselves
    still use each session's original quiz.
  These are illustrations only; they never change scores or saved data.
*/
import { useId } from 'react'

function Eyes({ mood, glow }) {
  switch (mood) {
    case 'think':
      return (
        <>
          <rect x="72" y="76" width="14" height="22" rx="7" fill="#5EEAD4" filter={glow} />
          <path d="M110 90 L 128 85" stroke="#5EEAD4" strokeWidth="6" strokeLinecap="round" />
          <path d="M94 107 L 106 107" stroke="#5EEAD4" strokeWidth="3.5" strokeLinecap="round" />
          <text x="160" y="40" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="34" fill="#FCD34D">?</text>
        </>
      )
    case 'cheer':
      return (
        <>
          <path d="M80 74 L84 86 L96 88 L84 90 L80 102 L76 90 L64 88 L76 86 Z M120 74 L124 86 L136 88 L124 90 L120 102 L116 90 L104 88 L116 86 Z" fill="#FCD34D" filter={glow} />
          <path d="M89 104 Q 100 118 111 104 Z" fill="#5EEAD4" />
        </>
      )
    case 'worry':
      return (
        <>
          <path d="M70 82 L 88 89 M130 82 L 112 89" stroke="#F9A8D4" strokeWidth="5" strokeLinecap="round" />
          <circle cx="80" cy="97" r="5.5" fill="#F9A8D4" />
          <circle cx="120" cy="97" r="5.5" fill="#F9A8D4" />
          <path d="M92 111 Q 100 104 108 111" stroke="#F9A8D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )
    default:
      return (
        <>
          <path d="M70 92 Q 80 79 90 92 M110 92 Q 120 79 130 92" stroke="#5EEAD4" strokeWidth="6" fill="none" strokeLinecap="round" filter={glow} />
          <path d="M92 104 Q 100 111 108 104" stroke="#5EEAD4" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="72" cy="104" rx="6" ry="3" fill="#F472B6" opacity=".5" />
          <ellipse cx="128" cy="104" rx="6" ry="3" fill="#F472B6" opacity=".5" />
        </>
      )
  }
}

const HANDS = { happy: [50, 150, 150, 150], think: [50, 150, 156, 118], cheer: [44, 104, 156, 104], worry: [58, 160, 142, 160] }

export function Aria({ mood = 'happy', size = 120, float = true, className = '', title }) {
  const id = useId().replace(/:/g, '')
  const glow = size >= 70 ? `url(#ag${id})` : undefined
  const [lx, ly, rx, ry] = HANDS[mood] ?? HANDS.happy
  const bulb = mood === 'worry' ? '#F472B6' : mood === 'cheer' ? '#5EEAD4' : '#FCD34D'
  return (
    <svg
      className={`aria-bot ${float ? 'is-floating' : ''} ${className}`}
      width={size}
      height={size * 1.1}
      viewBox="0 0 200 220"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <filter id={`ag${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`as${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".55" stopColor="#DCE2FA" />
          <stop offset="1" stopColor="#9AA6D8" />
        </linearGradient>
        <linearGradient id={`aj${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67E8F9" stopOpacity=".9" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="210" rx="46" ry="7" fill="#22D3EE" opacity=".35" />
      <path className="aria-jet" d="M86 168 L114 168 L107 204 L93 204 Z" fill={`url(#aj${id})`} />
      <ellipse cx={lx} cy={ly} rx="12" ry="10" fill={`url(#as${id})`} />
      <ellipse cx={rx} cy={ry} rx="12" ry="10" fill={`url(#as${id})`} />
      <ellipse cx="100" cy="152" rx="33" ry="25" fill={`url(#as${id})`} />
      <path d="M70 158 C 82 173, 118 173, 130 158" stroke="#8B5CF6" strokeWidth="3" fill="none" opacity=".75" />
      <circle cx="100" cy="150" r="13" fill="#A78BFA" opacity=".3" />
      <circle cx="100" cy="150" r="6.5" fill="#C4B5FD" filter={glow} />
      <path d="M100 38 L100 18" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
      <circle className="aria-bulb" cx="100" cy="14" r="12" fill={bulb} opacity=".28" />
      <circle cx="100" cy="14" r="5.5" fill={bulb} />
      <circle cx="38" cy="86" r="14" fill="#4C3FB0" />
      <circle cx="38" cy="86" r="7" fill="none" stroke="#5EEAD4" strokeWidth="2.6" filter={glow} />
      <circle cx="162" cy="86" r="14" fill="#4C3FB0" />
      <circle cx="162" cy="86" r="7" fill="none" stroke="#5EEAD4" strokeWidth="2.6" filter={glow} />
      <rect x="40" y="36" width="120" height="100" rx="46" fill={`url(#as${id})`} />
      <path d="M150 60 C 160 82, 160 110, 140 130 C 120 140, 80 140, 60 130 C 122 128, 150 100, 150 60 Z" fill="#3B3A8F" opacity=".2" />
      <ellipse cx="74" cy="53" rx="20" ry="7" fill="#fff" opacity=".85" transform="rotate(-18 74 53)" />
      <rect x="54" y="56" width="92" height="64" rx="28" fill="#0A0E2A" />
      <rect x="54" y="56" width="92" height="64" rx="28" fill="none" stroke="#6D5BD0" strokeWidth="2" />
      <path d="M66 66 C 82 60, 112 60, 132 64" stroke="#fff" strokeOpacity=".16" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eyes mood={mood} glow={glow} />
    </svg>
  )
}

/* ARIA with a speech bubble. `children` is the line; `label` defaults to ARIA. */
export function AriaSays({ mood = 'happy', size = 96, children, label = 'ARIA', className = '', tone }) {
  return (
    <div className={`aria-says ${className}`} data-mood={mood} data-tone={tone ?? mood}>
      <Aria mood={mood} size={size} />
      <div className="aria-bubble frame">
        <div className="frame-in">
          <p className="aria-name">{label}</p>
          <div className="aria-line">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Static({ size = 260, className = '', hurt = false, title = 'STATIC, the fictional signal-jammer boss' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`static-boss ${hurt ? 'is-hurt' : ''} ${className}`} width={size} height={size * 1.23} viewBox="0 0 260 320" role="img" aria-label={title}>
      <defs>
        <filter id={`sg${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`sa${id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#F43F5E" stopOpacity=".55" />
          <stop offset=".6" stopColor="#A855F7" stopOpacity=".18" />
          <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="static-aura" cx="130" cy="170" rx="128" ry="150" fill={`url(#sa${id})`} />
      <g className="static-body">
        <path d="M124 30 C 90 30, 70 58, 68 96 C 66 120, 74 140, 86 152 C 54 164, 24 196, 14 260 L 0 320 L 248 320 L 234 260 C 224 196, 194 164, 162 152 C 174 140, 182 120, 180 96 C 178 58, 158 30, 124 30 Z" fill="#F43F5E" opacity=".6" />
        <path d="M136 30 C 102 30, 82 58, 80 96 C 78 120, 86 140, 98 152 C 66 164, 36 196, 26 260 L 12 320 L 260 320 L 246 260 C 236 196, 206 164, 174 152 C 186 140, 194 120, 192 96 C 190 58, 170 30, 136 30 Z" fill="#22D3EE" opacity=".45" />
        <path d="M130 30 C 96 30, 76 58, 74 96 C 72 120, 80 140, 92 152 C 60 164, 30 196, 20 260 L 6 320 L 254 320 L 240 260 C 230 196, 200 164, 168 152 C 180 140, 188 120, 186 96 C 184 58, 164 30, 130 30 Z" fill="#0B0614" />
        <path d="M92 152 C 104 160, 156 160, 168 152 L 160 176 C 140 184, 120 184, 100 176 Z" fill="#1F0A24" />
        <path className="static-eye" d="M96 94 L 164 88 L 162 106 L 98 112 Z" fill="#F43F5E" filter={`url(#sg${id})`} />
        <path d="M104 98 L 156 94" stroke="#FFE4E6" strokeWidth="2" />
        <path d="M112 112 L 106 140 M 150 108 L 158 134" stroke="#F43F5E" strokeWidth="1.5" opacity=".7" />
        <path d="M60 210 L 120 190 L 200 212 M40 256 L 130 236 L 222 258 M70 296 L 130 280 L 196 298" stroke="#F43F5E" strokeWidth="2" fill="none" opacity=".6" filter={`url(#sg${id})`} />
        <rect className="static-bar" x="18" y="220" width="130" height="6" fill="#22D3EE" opacity=".75" />
        <rect className="static-bar" x="110" y="170" width="110" height="5" fill="#F43F5E" opacity=".85" />
        <rect x="60" y="120" width="70" height="4" fill="#F0ABFC" opacity=".6" />
      </g>
      <path className="static-shards" d="M232 64 L 248 52 L 244 74 Z M24 104 L 40 94 L 36 116 Z M222 136 L 236 130 L 230 148 Z M12 180 L 24 176 L 20 192 Z" fill="#F43F5E" filter={`url(#sg${id})`} />
    </svg>
  )
}
