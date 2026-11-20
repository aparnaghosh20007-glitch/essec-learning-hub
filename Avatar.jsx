/*
  AVATAR
  An illustrated, customisable player avatar drawn in SVG (no photos).
  `look` = { skin, hair, hairColor, outfit, accent, accessory, frame }
  The options (and their ids, which saved profiles use) live in game.js → AVATAR.

  variant="portrait" (default): head-and-shoulders inside a round frame.
  variant="bust": the full illustrated bust with no frame (HQ pod, editor).
*/
import { useId } from 'react'
import { AVATAR, DEFAULT_AVATAR } from './game.js'

const FRAMES = {
  neon: ['#241C5C', '#0B0C26'],
  aurora: ['#0F766E', '#4C1D95'],
  gold: ['#7C4A0B', '#1A1206'],
}

// Mix a hex colour with white (amount 0–1) for hair highlights and outfit panels.
function tint(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c + (255 - c) * amount)
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c * (1 - amount))
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const HEAD = 'M82 122 C 82 84, 100 66, 120 66 C 140 66, 158 84, 158 122 C 158 152, 146 178, 120 186 C 94 178, 82 152, 82 122 Z'
const HEAD_SHADE = 'M140 72 C 152 84, 158 102, 158 122 C 158 152, 146 178, 120 186 C 138 172, 148 150, 148 122 C 148 100, 144 84, 140 72 Z'
const BODY = 'M18 300 C 22 246, 58 218, 120 216 C 182 218, 218 246, 222 300 Z'
const LAPEL_L = 'M94 218 C 100 242, 110 260, 120 272 L 98 300 L 64 300 C 70 262, 80 236, 94 218 Z'
const LAPEL_R = 'M146 218 C 140 242, 130 260, 120 272 L 142 300 L 176 300 C 170 262, 160 236, 146 218 Z'
const TRIM = 'M94 218 C 100 242, 110 260, 120 272 L 98 300 M146 218 C 140 242, 130 260, 120 272 L 142 300'

function backHair(style, c) {
  switch (style) {
    case 'long':
      return <path d="M64 112 C 50 168, 52 236, 66 272 L 174 272 C 188 236, 190 168, 176 112 C 168 66, 72 66, 64 112 Z" fill={c} />
    case 'curls':
      return (
        <g fill={c}>
          {[[74, 100], [70, 130], [74, 160], [84, 186], [166, 100], [170, 130], [166, 160], [156, 186], [96, 70], [120, 60], [144, 70]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="20" />
          ))}
        </g>
      )
    case 'braid':
      return <path d="M68 112 C 62 150, 66 176, 74 196 L 166 196 C 174 176, 178 150, 172 112 C 166 70, 74 70, 68 112 Z" fill={c} />
    default:
      return null
  }
}

function frontHair(style, c, hi) {
  const shine = <path d="M98 72 C 112 64, 134 64, 150 77" stroke={hi} strokeWidth="3" fill="none" opacity=".75" strokeLinecap="round" />
  switch (style) {
    case 'long':
      return (
        <>
          <path d="M80 124 C 74 82, 96 56, 124 58 C 154 60, 170 86, 162 126 C 158 108, 150 94, 136 86 C 124 100, 102 106, 86 106 C 84 112, 82 118, 80 124 Z" fill={c} />
          <path d="M82 106 C 70 142, 72 186, 84 214 L 96 212 C 88 184, 88 144, 92 114 Z M158 106 C 170 142, 168 186, 156 214 L 144 212 C 152 184, 152 144, 148 114 Z" fill={c} />
          {shine}
          <path d="M90 88 C 98 79, 106 75, 115 73" stroke={hi} strokeWidth="2" fill="none" opacity=".55" strokeLinecap="round" />
        </>
      )
    case 'short':
      return (
        <>
          <path d="M80 120 C 74 80, 98 56, 124 58 C 152 60, 168 84, 160 120 C 156 102, 146 90, 128 86 C 114 96, 98 98, 86 100 C 83 106, 81 112, 80 120 Z" fill={c} />
          {shine}
        </>
      )
    case 'bun':
      return (
        <>
          <circle cx="120" cy="52" r="20" fill={c} />
          <path d="M107 46 C 113 39, 127 39, 133 46" stroke={hi} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".8" />
          <path d="M80 122 C 76 84, 96 62, 120 62 C 144 62, 164 84, 160 122 C 154 102, 140 90, 120 88 C 100 90, 86 102, 80 122 Z" fill={c} />
          {shine}
        </>
      )
    case 'curls':
      return (
        <g fill={c}>
          {[[90, 88], [106, 76], [124, 72], [142, 78], [154, 92]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="15" />
          ))}
          <circle cx="104" cy="70" r="5" fill={hi} opacity=".5" />
          <circle cx="140" cy="72" r="4" fill={hi} opacity=".45" />
        </g>
      )
    case 'buzz':
      return (
        <>
          <path d="M83 114 C 82 80, 100 64, 120 64 C 140 64, 158 80, 157 114 C 151 96, 138 86, 120 86 C 102 86, 89 96, 83 114 Z" fill={c} opacity=".92" />
          <path d="M100 72 C 112 67, 130 67, 142 74" stroke={hi} strokeWidth="2" fill="none" opacity=".5" strokeLinecap="round" />
        </>
      )
    case 'braid':
      return (
        <>
          <path d="M80 122 C 74 82, 98 56, 126 58 C 154 62, 168 88, 160 120 C 150 98, 128 86, 104 92 C 94 98, 86 108, 80 122 Z" fill={c} />
          <g fill={c}>
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={164 + i * 2} cy={140 + i * 24} rx="12" ry="14" />
            ))}
          </g>
          <circle cx="172" cy="262" r="6" fill={hi} />
          {shine}
        </>
      )
    default:
      return null
  }
}

// Outfit colours: [main, panel, trim]. Starter outfits use the chosen accent for trim.
function outfitColors(id, accent) {
  switch (id) {
    case 'blazer':
      return ['#232A5C', '#313B7A', accent]
    case 'hoodie':
      return [shade(accent, 0.45), shade(accent, 0.25), tint(accent, 0.35)]
    case 'turtleneck':
      return ['#141826', '#1F2537', accent]
    case 'builder':
      return ['#0F3B5C', '#165D8C', '#38BDF8']
    case 'agency':
      return ['#4A1760', '#7E2A95', '#F0ABFC']
    case 'executive':
      return ['#16131F', '#262132', '#FCD34D']
    default:
      return ['#232A5C', '#313B7A', accent]
  }
}

function Outfit({ id, accent, glow }) {
  const [main, panel, trim] = outfitColors(id, accent)
  return (
    <>
      <path d={BODY} fill={main} />
      <path d="M18 300 C 22 246, 58 218, 120 216 L 120 300 Z" fill="#fff" opacity=".07" />
      <path d="M150 222 C 190 232, 214 256, 222 300 L 180 300 Z" fill="#000" opacity=".25" />
      {id === 'hoodie' ? (
        <>
          <path d="M84 222 C 92 250, 148 250, 156 222 C 150 236, 90 236, 84 222 Z" fill={panel} />
          <path d="M108 240 L 106 280 M132 240 L 134 280" stroke={trim} strokeWidth="3" strokeLinecap="round" />
          <circle cx="106" cy="282" r="3.5" fill={trim} />
          <circle cx="134" cy="282" r="3.5" fill={trim} />
        </>
      ) : id === 'turtleneck' ? (
        <>
          <path d="M100 206 L 140 206 L 142 232 C 128 240, 112 240, 98 232 Z" fill={panel} />
          <path d="M40 262 L 200 262" stroke={trim} strokeWidth="2.5" opacity=".8" filter={glow} />
        </>
      ) : (
        <>
          <path d="M96 218 L120 262 L144 218 Z" fill={id === 'blazer' || id === 'executive' ? '#EDEBFA' : '#0A0F26'} />
          <path d={LAPEL_L} fill={panel} />
          <path d={LAPEL_R} fill={panel} />
          <path d={TRIM} stroke={trim} strokeWidth="2.5" fill="none" filter={glow} />
          <path d="M40 254 C 52 240, 66 232, 82 228 M200 254 C 188 240, 174 232, 158 228" stroke={trim} strokeWidth="2" fill="none" opacity=".7" />
        </>
      )}
      {id === 'builder' && <rect x="150" y="262" width="22" height="12" rx="3" fill="#FCD34D" />}
      {id === 'agency' && <path d="M60 300 L 74 250 M180 300 L 166 250" stroke={trim} strokeWidth="2" opacity=".6" />}
      {id === 'executive' && <circle cx="86" cy="266" r="7" fill="#FCD34D" stroke="#FEF3C7" strokeWidth="1.5" filter={glow} />}
    </>
  )
}

function Accessory({ id, accent, glow }) {
  switch (id) {
    case 'glasses':
      return (
        <g fill="none" stroke="#0B0B14" strokeWidth="3">
          <circle cx="104" cy="128" r="11" fill="rgba(191,219,254,.12)" />
          <circle cx="136" cy="128" r="11" fill="rgba(191,219,254,.12)" />
          <path d="M115 127 Q 120 124 125 127 M93 126 L 84 122 M147 126 L 156 122" />
        </g>
      )
    case 'headset':
      return (
        <g>
          <path d="M80 118 C 80 76, 100 60, 120 60 C 140 60, 160 76, 160 118" stroke="#0B1030" strokeWidth="5" fill="none" />
          <rect x="74" y="116" width="13" height="26" rx="6" fill="#0B1030" stroke={accent} strokeWidth="2" />
          <rect x="153" y="116" width="13" height="26" rx="6" fill="#0B1030" stroke={accent} strokeWidth="2" />
          <path d="M160 140 C 158 158, 148 164, 134 164" stroke={accent} strokeWidth="2" fill="none" />
          <circle cx="132" cy="164" r="3" fill={accent} filter={glow} />
        </g>
      )
    case 'visor':
      return (
        <g>
          <path d="M84 118 C 100 111, 140 111, 156 118 L 154 138 C 138 143, 102 143, 86 138 Z" fill={accent} opacity=".42" stroke={tint(accent, 0.4)} strokeWidth="2" filter={glow} />
          <path d="M92 121 L 148 121" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
        </g>
      )
    case 'lanyard':
      return (
        <g>
          <path d="M104 220 L 116 262 M136 220 L 124 262" stroke="#F0ABFC" strokeWidth="2.4" fill="none" />
          <rect x="108" y="258" width="24" height="30" rx="4" fill="#F0ABFC" filter={glow} />
          <rect x="112" y="266" width="16" height="3" fill="#4A1760" />
          <rect x="112" y="273" width="11" height="3" fill="#4A1760" />
        </g>
      )
    case 'laurel':
      return (
        <g fill="#FCD34D" filter={glow}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={`l${i}`} cx={88 + i * 6} cy={92 - i * 7} rx="9" ry="4" transform={`rotate(${-50 + i * 14} ${88 + i * 6} ${92 - i * 7})`} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={`r${i}`} cx={152 - i * 6} cy={92 - i * 7} rx="9" ry="4" transform={`rotate(${50 - i * 14} ${152 - i * 6} ${92 - i * 7})`} />
          ))}
        </g>
      )
    default:
      return null
  }
}

function Figure({ a, skin, hair, accent, glow }) {
  const hi = tint(hair, 0.45)
  return (
    <>
      {backHair(a.hair, hair)}
      <Outfit id={a.outfit} accent={accent} glow={glow} />
      <path d="M106 176 L106 214 C 112 222, 128 222, 134 214 L 134 176 Z" fill={skin} />
      <path d="M106 186 C 114 197, 126 197, 134 186 L 134 202 C 126 209, 114 209, 106 202 Z" fill="#000" opacity=".18" />
      <ellipse cx="81" cy="130" rx="7" ry="11" fill={skin} />
      <ellipse cx="159" cy="130" rx="7" ry="11" fill={skin} />
      <path d={HEAD} fill={skin} />
      <path d={HEAD_SHADE} fill="#000" opacity=".15" />
      <path d="M84 112 C 83 142, 93 168, 112 182" stroke="#5EEAD4" strokeWidth="2" fill="none" opacity=".75" />
      <path d="M156 112 C 157 142, 147 168, 128 182" stroke="#F472B6" strokeWidth="1.6" fill="none" opacity=".6" />
      <ellipse cx="100" cy="147" rx="8" ry="4.5" fill="#F47C7C" opacity=".3" />
      <ellipse cx="140" cy="147" rx="8" ry="4.5" fill="#F47C7C" opacity=".3" />
      <path d="M95 114 Q 104 108 113 112 M127 112 Q 136 108 145 114" stroke={shade(hair, 0.2)} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <ellipse cx="104" cy="128" rx="7" ry="5.6" fill="#fff" />
      <ellipse cx="136" cy="128" rx="7" ry="5.6" fill="#fff" />
      <circle cx="105" cy="128.6" r="4.3" fill="#3B2416" />
      <circle cx="137" cy="128.6" r="4.3" fill="#3B2416" />
      <circle cx="105" cy="128.6" r="2" fill="#0B0B14" />
      <circle cx="137" cy="128.6" r="2" fill="#0B0B14" />
      <circle cx="106.6" cy="126.8" r="1.4" fill="#fff" />
      <circle cx="138.6" cy="126.8" r="1.4" fill="#fff" />
      <path d="M96 126 Q 104 120 112 125 M128 125 Q 136 120 144 126" stroke="#1A1020" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M121 133 C 119 141, 116 146, 119 149 C 121 150, 124 149, 126 147" stroke="#000" strokeOpacity=".3" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M110 160 Q 120 168 130 160 Q 120 163 110 160 Z" fill="#B4475A" />
      <path d="M110 160 Q 120 167 130 160" stroke="#7A2638" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {frontHair(a.hair, hair, hi)}
      <Accessory id={a.accessory} accent={accent} glow={glow} />
    </>
  )
}

export default function Avatar({ look, size = 96, className = '', title, variant = 'portrait' }) {
  const gid = useId().replace(/:/g, '')
  const a = { ...DEFAULT_AVATAR, ...(look ?? {}) }
  const skin = AVATAR.skins[a.skin] ?? AVATAR.skins[1]
  const hair = AVATAR.hairColors[a.hairColor] ?? AVATAR.hairColors[0]
  const accent = (AVATAR.accents.find((x) => x.id === a.accent) ?? AVATAR.accents[0]).color
  const [f1, f2] = FRAMES[a.frame] ?? FRAMES.neon
  const ring = a.frame === 'gold' ? '#FCD34D' : a.frame === 'aurora' ? '#5EEAD4' : accent
  const glow = size >= 60 ? `url(#glow${gid})` : undefined
  const a11y = { role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true }

  const defs = (
    <filter id={`glow${gid}`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )

  if (variant === 'bust') {
    return (
      <svg className={`avatar avatar-bust ${className}`} width={size * 0.8} height={size} viewBox="0 0 240 300" {...a11y}>
        <defs>{defs}</defs>
        <Figure a={a} skin={skin} hair={hair} accent={accent} glow={glow} />
      </svg>
    )
  }

  return (
    <svg className={`avatar ${className}`} width={size} height={size} viewBox="0 0 120 120" {...a11y}>
      <defs>
        {defs}
        <radialGradient id={`bg${gid}`} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor={f1} />
          <stop offset="1" stopColor={f2} />
        </radialGradient>
        <clipPath id={`clip${gid}`}>
          <circle cx="60" cy="60" r="57" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="57" fill={`url(#bg${gid})`} />
      <g clipPath={`url(#clip${gid})`}>
        <circle cx="60" cy="40" r="40" fill={ring} opacity=".14" />
        <svg x="0" y="0" width="120" height="120" viewBox="30 50 180 180">
          <Figure a={a} skin={skin} hair={hair} accent={accent} glow={glow} />
        </svg>
      </g>
      <circle cx="60" cy="60" r="57" fill="none" stroke={ring} strokeWidth="3" opacity=".95" />
    </svg>
  )
}
