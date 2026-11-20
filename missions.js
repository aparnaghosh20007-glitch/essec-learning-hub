/*
  MISSIONS
  Links each session to its game content (the five floors of its tower).
  A session without an entry here is an "offline" district: it keeps its
  placeholder page and gets no invented game content.

  To add a mission later: create missionN.js (copy mission2.js as a guide,
  using ONLY verified session material), import it below and add it to
  the list.
*/
import { mission1 } from './mission1.js'
import { mission2 } from './mission2.js'

const MISSIONS = [mission1, mission2]

export function getMission(sessionId) {
  return MISSIONS.find((m) => m.sessionId === sessionId) ?? null
}
