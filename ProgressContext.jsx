/*
  PROGRESS STORE
  Keeps track of quiz scores, completed sessions and your reflections.
  Everything is saved in the browser's localStorage, so it stays after a
  page refresh — no login or database needed. (It is per-browser: opening
  the site on another device starts fresh.)
*/
import { createContext, useContext, useEffect, useState } from 'react'
import { sessions } from '../data/sessions.js'

const STORAGE_KEY = 'essec-learning-hub-v1'

const emptyProgress = {
  quizResults: {}, // { 'session-1': { score, total, best, attempts, completedAt } }
  manualComplete: {}, // { 'session-2': true } for sessions without a quiz
  reflections: {}, // { 'session-1': 'text', general: 'text' }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { ...emptyProgress, ...saved }
  } catch {
    return emptyProgress
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)

  // Save to the browser every time progress changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* storage unavailable (e.g. private mode) — the app still works, it just won't remember */
    }
  }, [progress])

  function saveQuizResult(sessionId, score, total) {
    setProgress((p) => {
      const previous = p.quizResults[sessionId]
      return {
        ...p,
        quizResults: {
          ...p.quizResults,
          [sessionId]: {
            score,
            total,
            best: Math.max(score, previous?.best ?? 0),
            attempts: (previous?.attempts ?? 0) + 1,
            completedAt: new Date().toISOString(),
          },
        },
      }
    })
  }

  function setManualComplete(sessionId, value) {
    setProgress((p) => ({ ...p, manualComplete: { ...p.manualComplete, [sessionId]: value } }))
  }

  function saveReflection(key, text) {
    setProgress((p) => ({ ...p, reflections: { ...p.reflections, [key]: text } }))
  }

  function resetProgress() {
    setProgress(emptyProgress)
  }

  // A session counts as complete when its quiz is finished,
  // or (for sessions without a quiz) when you mark it complete.
  function isComplete(sessionId) {
    return Boolean(progress.quizResults[sessionId] || progress.manualComplete[sessionId])
  }

  const completedCount = sessions.filter((s) => isComplete(s.id)).length

  const value = {
    progress,
    saveQuizResult,
    setManualComplete,
    saveReflection,
    resetProgress,
    isComplete,
    completedCount,
    totalCount: sessions.length,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  return useContext(ProgressContext)
}
