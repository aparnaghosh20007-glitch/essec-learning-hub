/*
  PROGRESS STORE
  Keeps track of quiz scores, reflections, XP, badges and the daily challenge.
  Everything is saved in the browser's localStorage, so it stays after a
  page refresh — no login or database needed. (It is per-browser: opening
  the site on another device starts fresh.)

  Progress saved by the earlier version of the site uses the same storage
  key and is upgraded automatically: finished quizzes and reflections earn
  their XP once.

  The player profile (name, optional institution/programme/campus and the
  illustrated avatar) is stored here too. There is no student-number
  field and no photo. Choosing the creator profile shows the public
  creator details from creator.js.
*/
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { sessions } from './sessions.js'
import { XP, BADGES, DEFAULT_AVATAR, countWords, getLevel, unlockedBadges, missionProgress, liveSessions } from './game.js'
import { CREATOR } from './creator.js'

const STORAGE_KEY = 'essec-learning-hub-v1'

const emptyProgress = {
  quizResults: {}, // { 'session-1': { score, total, best, attempts, completedAt } }
  manualComplete: {}, // { 'session-2': true } for sessions without a quiz
  reflections: {}, // { 'session-1': 'text', general: 'text' }
  awards: {}, // { 'boss:session-1': 180 } — XP paid per activity (once)
  daily: {}, // { '2026-11-19': { choice: 1, correct: true } }
  flags: {}, // extra achievements per mission, e.g. { 'session-2': { challengePerfect: true } }
  badgesSeen: [], // badges already celebrated
  playerName: '', // (older versions) a free-text name
  profile: null, // { mode: 'creator' | 'custom', name, institution, programme, campus, avatar }
}

const clean = (v, max) => String(v ?? '').trim().slice(0, max)

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { ...emptyProgress, ...saved }
  } catch {
    return emptyProgress
  }
}

// XP owed for things saved before the game existed (old quiz scores, reflections).
function carriedOverAwards(p) {
  const owed = {}
  Object.entries(p.quizResults).forEach(([id, r]) => {
    const xp = Math.round((r.best / r.total) * XP.boss)
    if ((p.awards[`boss:${id}`] ?? -1) < xp) owed[`boss:${id}`] = xp
  })
  sessions.forEach((s) => {
    if (countWords(p.reflections[s.id]) >= 30 && p.awards[`reflection:${s.id}`] === undefined) {
      owed[`reflection:${s.id}`] = XP.reflection
    }
  })
  return owed
}

const ProgressContext = createContext(null)
let eventId = 0

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)
  const [events, setEvents] = useState([]) // reward pop-ups waiting to be shown

  function pushEvent(event) {
    eventId += 1
    setEvents((list) => [...list, { id: eventId, ...event }])
  }
  function dismissEvent(id) {
    setEvents((list) => list.filter((e) => e.id !== id))
  }

  // Save to the browser every time progress changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* storage unavailable (e.g. private mode) — the app still works, it just won't remember */
    }
  }, [progress])

  // Pay XP owed from earlier progress, once.
  useEffect(() => {
    const owed = carriedOverAwards(progress)
    const gained = Object.entries(owed).reduce((sum, [id, xp]) => sum + xp - Math.max(progress.awards[id] ?? 0, 0), 0)
    if (gained > 0) {
      setProgress((p) => ({ ...p, awards: { ...p.awards, ...owed } }))
      pushEvent({ type: 'xp', amount: gained, label: 'Progress carried over' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Award XP for an activity. Pays only once per ID; a higher value later
     pays only the difference. Returns the XP actually gained. */
  function award(id, xp, label) {
    const previous = progress.awards[id]
    const gained = Math.max(0, xp - (previous ?? 0))
    if (previous !== undefined && gained === 0) return 0
    setProgress((p) => {
      const prev = p.awards[id]
      if (prev !== undefined && prev >= xp) return p
      return { ...p, awards: { ...p.awards, [id]: xp } }
    })
    if (gained > 0) pushEvent({ type: 'xp', amount: gained, label })
    return gained
  }

  function saveQuizResult(sessionId, score, total) {
    const previous = progress.quizResults[sessionId]
    const best = Math.max(score, previous?.best ?? 0)
    setProgress((p) => {
      const prev = p.quizResults[sessionId]
      return {
        ...p,
        quizResults: {
          ...p.quizResults,
          [sessionId]: {
            score,
            total,
            best: Math.max(score, prev?.best ?? 0),
            attempts: (prev?.attempts ?? 0) + 1,
            completedAt: new Date().toISOString(),
          },
        },
      }
    })
    return award(`boss:${sessionId}`, Math.round((best / total) * XP.boss), 'Boss battle')
  }

  function setManualComplete(sessionId, value) {
    setProgress((p) => ({ ...p, manualComplete: { ...p.manualComplete, [sessionId]: value } }))
  }

  function saveReflection(key, text) {
    setProgress((p) => ({ ...p, reflections: { ...p.reflections, [key]: text } }))
    if (key !== 'general' && countWords(text) >= 30) award(`reflection:${key}`, XP.reflection, 'Reflection written')
  }

  function answerDaily(key, choice, correct) {
    if (progress.daily[key]) return
    setProgress((p) => ({ ...p, daily: { ...p.daily, [key]: { choice, correct } } }))
    if (correct) award(`daily:${key}`, XP.daily, 'Daily challenge')
  }

  function setFlag(sessionId, name, value = true) {
    setProgress((p) => ({ ...p, flags: { ...p.flags, [sessionId]: { ...p.flags[sessionId], [name]: value } } }))
  }

  function setPlayerName(name) {
    setProgress((p) => ({ ...p, playerName: name.slice(0, 24) }))
  }

  /* Save the player profile. 'creator' uses the public creator details;
     'custom' keeps only what the player typed (nothing is required but a name). */
  function saveProfile({ mode, name, institution, programme, campus, avatar }) {
    setProgress((p) => {
      const look = avatar ?? p.profile?.avatar ?? (mode === 'creator' ? CREATOR.avatar : DEFAULT_AVATAR)
      const profile =
        mode === 'creator'
          ? { mode: 'creator', avatar: look }
          : {
              mode: 'custom',
              name: clean(name, 24) || 'Player',
              institution: clean(institution, 60),
              programme: clean(programme, 60),
              campus: clean(campus, 40),
              avatar: look,
            }
      return { ...p, profile, playerName: mode === 'custom' ? profile.name : p.playerName }
    })
  }

  function updateAvatar(look) {
    setProgress((p) => ({ ...p, profile: { ...(p.profile ?? { mode: 'custom', name: 'Player' }), avatar: look } }))
  }

  // Clears XP, scores, reflections and badges. The profile and avatar stay.
  function resetProgress() {
    setProgress((p) => ({ ...emptyProgress, profile: p.profile, playerName: p.playerName }))
    setEvents([])
  }

  const xp = useMemo(() => Object.values(progress.awards).reduce((a, b) => a + b, 0), [progress.awards])
  const level = getLevel(xp)
  const badges = unlockedBadges(progress)

  // Celebrate level-ups (not on page load — only when the level changes).
  const lastLevel = useRef(level.level)
  useEffect(() => {
    if (level.level > lastLevel.current) pushEvent({ type: 'level', level: level.level, name: level.name })
    lastLevel.current = level.level
  }, [level.level, level.name])

  // Celebrate each badge once.
  const badgeKey = badges.join(',')
  useEffect(() => {
    const fresh = badges.filter((id) => !progress.badgesSeen.includes(id))
    if (!fresh.length) return
    fresh.forEach((id) => pushEvent({ type: 'badge', badge: BADGES.find((b) => b.id === id) }))
    setProgress((p) => ({ ...p, badgesSeen: [...p.badgesSeen, ...fresh] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeKey])

  // A session's quiz is finished (used by the session pages and journal).
  function isComplete(sessionId) {
    return Boolean(progress.quizResults[sessionId] || progress.manualComplete[sessionId])
  }

  const completedCount = sessions.filter((s) => isComplete(s.id)).length
  const missionsDone = liveSessions().filter((s) => missionProgress(s, progress.awards).complete).map((s) => s.id)
  const missionsComplete = missionsDone.length

  // Profile as shown in the game.
  const profile = progress.profile
  const isCreator = profile?.mode === 'creator'
  const displayName = isCreator ? CREATOR.name : profile?.name || progress.playerName || 'Player'
  const avatar = profile?.avatar ?? (isCreator ? CREATOR.avatar : DEFAULT_AVATAR)
  const details = isCreator
    ? { institution: CREATOR.institution, programme: CREATOR.programme, campus: CREATOR.campus }
    : { institution: profile?.institution ?? '', programme: profile?.programme ?? '', campus: profile?.campus ?? '' }
  const unlockCtx = { level: level.level, badges, missionsDone }

  const value = {
    progress,
    saveQuizResult,
    setManualComplete,
    saveReflection,
    answerDaily,
    award,
    setFlag,
    setPlayerName,
    saveProfile,
    updateAvatar,
    resetProgress,
    profile,
    isCreator,
    displayName,
    avatar,
    details,
    unlockCtx,
    isComplete,
    completedCount,
    totalCount: sessions.length,
    xp,
    level,
    badges,
    missionsComplete,
    events,
    dismissEvent,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  return useContext(ProgressContext)
}
