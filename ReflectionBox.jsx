/*
  REFLECTION BOX
  A text area that saves automatically as you type.
  `storageKey` decides where it is saved (a session id, or 'general').
*/
import { useEffect, useState } from 'react'
import { useProgress } from '../state/ProgressContext.jsx'

export default function ReflectionBox({ storageKey, label, placeholder, prompts = [] }) {
  const { progress, saveReflection } = useProgress()
  const savedText = progress.reflections[storageKey] ?? ''
  const [text, setText] = useState(savedText)
  const [status, setStatus] = useState('')

  // If progress is reset elsewhere, reflect that here.
  useEffect(() => {
    setText(savedText)
  }, [savedText])

  // Save shortly after you stop typing.
  useEffect(() => {
    if (text === savedText) return
    setStatus('Saving…')
    const timer = setTimeout(() => {
      saveReflection(storageKey, text)
      setStatus('Saved')
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const id = `reflection-${storageKey}`

  return (
    <div className="reflection-box">
      <label htmlFor={id} className="reflection-label">{label}</label>
      {prompts.length > 0 && (
        <ul className="reflection-prompts">
          {prompts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <textarea
        id={id}
        value={text}
        placeholder={placeholder}
        rows={6}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="reflection-meta">
        <span>{text.trim() ? `${text.trim().split(/\s+/).length} words` : 'Not started'}</span>
        <span className="save-status" aria-live="polite">{status}</span>
      </div>
    </div>
  )
}
