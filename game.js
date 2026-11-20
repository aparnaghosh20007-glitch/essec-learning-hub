/*
  GAME RULES — XP, levels, missions and badges
  ---------------------------------------------
  Everything that decides "how many points", "which badge" or "which
  avatar item is unlocked" lives here, so the rules are easy to read and
  change in one place.

  How XP works
    • Each activity has an ID such as "boss:session-2".
    • The XP for an ID is stored once in the browser (progress.awards).
    • Replaying never pays twice; a better quiz score only pays the difference.
*/
import { sessions } from './sessions.js'

// XP available for each part of a mission.
export const XP = {
  learn: 50,
  explore: 50,
  play: 100,
  challenge: 100,
  boss: 200,
  reflection: 50,
  daily: 25,
}

// The five sections of every mission (Learn → Boss Battle).
export const SECTIONS = [
  { key: 'learn', label: 'Learn' },
  { key: 'explore', label: 'Explore' },
  { key: 'play', label: 'Play' },
  { key: 'challenge', label: 'Challenge' },
  { key: 'boss', label: 'Boss Battle' },
]

export const MISSION_XP = SECTIONS.reduce((sum, s) => sum + XP[s.key], 0) + XP.reflection // 550

// Player ranks: [name, XP needed]. Everyone starts as a Marketing Explorer.
export const LEVELS = [
  ['Marketing Explorer', 0],
  ['Junior Marketer', 150],
  ['Campaign Builder', 350],
  ['Brand Strategist', 600],
  ['Growth Lead', 900],
  ['Marketing Director', 1300],
  ['Chief Marketing Officer', 1800],
]

export function getLevel(xp) {
  let index = 0
  LEVELS.forEach(([, min], i) => {
    if (xp >= min) index = i
  })
  const [name, floor] = LEVELS[index]
  const next = LEVELS[index + 1]
  const pct = next ? Math.round(((xp - floor) / (next[1] - floor)) * 100) : 100
  return {
    level: index + 1,
    name,
    floor,
    nextXp: next ? next[1] : null,
    nextName: next ? next[0] : null,
    toNext: next ? next[1] - xp : 0,
    pct,
  }
}

// Look and feel of each mission on the map. Add an entry when you add a session.
// `district` is the fictional place in Neo Metro (story layer only).
const META = {
  'session-1': { short: 'Vibe Coding', icon: 'code', accent: '#3B82F6', district: 'The Prompt Lab' },
  'session-2': { short: 'AI Marketing Team', icon: 'network', accent: '#8B5CF6', district: 'The AI Agency Tower' },
  'session-3': { short: 'LinkedIn Session', icon: 'people', accent: '#2DD4BF', district: 'Network City' },
  'session-4': { short: 'To be announced', icon: 'compass', accent: '#38BDF8', district: 'Dark District 04' },
  'session-5': { short: 'To be announced', icon: 'rocket', accent: '#A78BFA', district: 'Dark District 05' },
  'session-6': { short: 'Final mission', icon: 'crown', accent: '#FCD34D', district: 'The Summit' },
}
const FALLBACK_ICONS = ['compass', 'rocket', 'network', 'people', 'code', 'crown']
const FALLBACK_ACCENTS = ['#3B82F6', '#8B5CF6', '#2DD4BF', '#38BDF8', '#A78BFA', '#FCD34D']

export function missionMeta(session) {
  const i = (session.number - 1) % 6
  return META[session.id] ?? { short: session.title, icon: FALLBACK_ICONS[i], accent: FALLBACK_ACCENTS[i], district: `District ${String(session.number).padStart(2, '0')}` }
}

export const isLive = (session) => session.status === 'completed'
export const liveSessions = () => sessions.filter(isLive)

// The rooftop (boss) counts as cleared at 50% or more of its 200 XP,
// i.e. a score of at least half the original quiz.
export const BOSS_CLEAR = 0.5

export function sectionCleared(awards, sessionId, key) {
  const xp = awards[`${key}:${sessionId}`]
  if (key === 'boss') return xp !== undefined && xp >= XP.boss * BOSS_CLEAR
  return xp !== undefined
}

export function missionProgress(session, awards) {
  const cleared = SECTIONS.filter((s) => sectionCleared(awards, session.id, s.key)).map((s) => s.key)
  const earned = Object.entries(awards)
    .filter(([id]) => id.endsWith(`:${session.id}`))
    .reduce((sum, [, xp]) => sum + xp, 0)
  return { cleared, count: cleared.length, total: SECTIONS.length, complete: cleared.length === SECTIONS.length, earned }
}

// done = all five sections cleared; current = the next live mission to play.
export function missionStates(awards) {
  const currentId = liveSessions().find((s) => !missionProgress(s, awards).complete)?.id
  return Object.fromEntries(
    sessions.map((s) => {
      if (!isLive(s)) return [s.id, 'soon']
      if (missionProgress(s, awards).complete) return [s.id, 'done']
      return [s.id, s.id === currentId ? 'current' : 'open']
    }),
  )
}

export const countWords = (text = '') => (text.trim() ? text.trim().split(/\s+/).length : 0)

// Achievement badges. `test` receives the saved progress.
export const BADGES = [
  {
    id: 'first-mission',
    name: 'First Mission Completed',
    desc: 'Clear all five floors of any mission tower.',
    test: (p) => liveSessions().some((s) => missionProgress(s, p.awards).complete),
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    desc: 'Score 100% in any boss battle.',
    test: (p) => Object.values(p.quizResults).some((r) => r.best === r.total),
  },
  {
    id: 'creative-thinker',
    name: 'Creative Thinker',
    desc: 'Make the best call in every decision of a challenge.',
    test: (p) => Object.values(p.flags ?? {}).some((f) => f?.challengePerfect),
  },
  {
    id: 'marketing-strategist',
    name: 'Marketing Strategist',
    desc: 'Score 80% or more in the Mission 02 boss battle.',
    test: (p) => {
      const r = p.quizResults['session-2']
      return Boolean(r && r.best / r.total >= 0.8)
    },
  },
  {
    id: 'reflective-mind',
    name: 'Reflective Mind',
    desc: 'Write a reflection of 30+ words for two missions.',
    test: (p) => sessions.filter((s) => countWords(p.reflections[s.id]) >= 30).length >= 2,
  },
  {
    id: 'quest-champion',
    name: 'Quest Champion',
    desc: 'Complete every mission that has content.',
    test: (p) => liveSessions().length > 0 && liveSessions().every((s) => missionProgress(s, p.awards).complete),
  },
]

export const unlockedBadges = (progress) => BADGES.filter((b) => b.test(progress)).map((b) => b.id)

// ---------- Daily challenge: one real quiz question per day ----------
export function todayKey(date = new Date()) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

export function dailyQuestion(key = todayKey()) {
  const pool = liveSessions().flatMap((s) =>
    (s.quiz?.questions ?? [])
      .filter((q) => q.type === 'choice')
      .map((q) => ({ ...q, sessionId: s.id, sessionNumber: s.number })),
  )
  if (!pool.length) return null
  const [y, m, d] = key.split('-').map(Number)
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000)
  return pool[(dayNumber * 7) % pool.length]
}

// ---------- Illustrated avatar ----------
// Free items have no `test`. Locked items show `unlock` (how to earn them).
// `ctx` = { level, badges: [ids], missionsDone: [sessionIds] }
const cleared = (id) => (ctx) => ctx.missionsDone.includes(id)
const atLevel = (n) => (ctx) => ctx.level >= n

export const AVATAR = {
  skins: ['#F8D7C0', '#EBC09E', '#D6A07A', '#B57A55', '#8D5A3B', '#5E3B26'],
  hairColors: ['#1B1420', '#4A2C1D', '#8A5A2B', '#C9A26B', '#7C3AED', '#E5E7EB'],
  hairs: [
    { id: 'long', name: 'Long' },
    { id: 'short', name: 'Short' },
    { id: 'bun', name: 'Bun' },
    { id: 'curls', name: 'Curls' },
    { id: 'buzz', name: 'Buzz' },
    { id: 'braid', name: 'Braid' },
  ],
  outfits: [
    { id: 'blazer', name: 'Blazer' },
    { id: 'hoodie', name: 'Hoodie' },
    { id: 'turtleneck', name: 'Turtleneck' },
    { id: 'builder', name: 'Lab builder jacket', unlock: 'Clear Mission 01', test: cleared('session-1') },
    { id: 'agency', name: 'Agency jacket', unlock: 'Clear Mission 02', test: cleared('session-2') },
    { id: 'executive', name: 'Executive suit', unlock: 'Reach Marketing Director', test: atLevel(6) },
  ],
  accents: [
    { id: 'violet', color: '#8B5CF6' },
    { id: 'blue', color: '#3B82F6' },
    { id: 'teal', color: '#2DD4BF' },
    { id: 'pink', color: '#F472B6' },
    { id: 'gold', color: '#FCD34D' },
  ],
  accessories: [
    { id: 'none', name: 'None' },
    { id: 'glasses', name: 'Glasses' },
    { id: 'headset', name: 'Headset', unlock: 'Reach Junior Marketer', test: atLevel(2) },
    { id: 'visor', name: 'Neon visor', unlock: 'Reach Campaign Builder', test: atLevel(3) },
    { id: 'lanyard', name: 'Holo-lanyard', unlock: 'Clear Mission 02', test: cleared('session-2') },
    { id: 'laurel', name: 'Gold laurel', unlock: 'Earn the Quest Champion badge', test: (ctx) => ctx.badges.includes('quest-champion') },
  ],
  frames: [
    { id: 'neon', name: 'Neon' },
    { id: 'aurora', name: 'Aurora', unlock: 'Reach Brand Strategist', test: atLevel(4) },
    { id: 'gold', name: 'Gold', unlock: 'Earn 3 badges', test: (ctx) => ctx.badges.length >= 3 },
  ],
}

export const DEFAULT_AVATAR = { skin: 1, hair: 'short', hairColor: 0, outfit: 'hoodie', accent: 'teal', accessory: 'none', frame: 'neon' }

export function isItemUnlocked(item, ctx) {
  return !item.test || Boolean(ctx && item.test(ctx))
}
