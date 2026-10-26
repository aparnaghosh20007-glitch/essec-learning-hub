/*
  REFLECTIONS PAGE
  Your learning journal: overall lessons + one entry per session.
  Includes a download button so you can keep or submit your notes.
*/
import { Link } from 'react-router-dom'
import { sessions } from '../data/sessions.js'
import ReflectionBox from '../components/ReflectionBox.jsx'
import { useProgress } from '../state/ProgressContext.jsx'

export default function ReflectionsPage() {
  const { progress, isComplete } = useProgress()

  function downloadJournal() {
    const lines = ['SESSION LAB — LEARNING JOURNAL', 'Digital Platforms · ESSEC Business School', '']
    lines.push('KEY LESSONS OF THE SEMESTER', progress.reflections.general?.trim() || '(not written yet)', '')
    sessions.forEach((s) => {
      lines.push(`SESSION ${s.number}: ${s.title}`)
      const result = progress.quizResults[s.id]
      if (result) lines.push(`Quiz best score: ${result.best}/${result.total}`)
      lines.push(progress.reflections[s.id]?.trim() || '(no reflection yet)', '')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'learning-journal.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className="session-hero">
        <div className="container">
          <p className="eyebrow eyebrow-light">Learning journal</p>
          <h1>Reflections & lessons learned</h1>
          <p className="session-hero-topic">
            Capture what each speaker taught you while it's fresh. Everything saves automatically in this browser.
          </p>
          <button type="button" className="button button-on-dark" onClick={downloadJournal}>
            ⬇ Download my journal (.txt)
          </button>
        </div>
      </section>

      <div className="container session-body">
        <section className="panel panel-highlight">
          <h2>Most important lessons this semester</h2>
          <ReflectionBox
            storageKey="general"
            label="Big-picture lessons"
            placeholder="e.g. 'The fastest way to learn a new tool is to ship something small with it…'"
            prompts={[
              'Which ideas came up across several sessions?',
              'What will you do differently as a result of this course?',
            ]}
          />
        </section>

        {sessions.map((s) => (
          <section className="panel" key={s.id}>
            <div className="journal-head">
              <div>
                <p className="eyebrow">Session {s.number}{isComplete(s.id) ? ' · ✓ completed' : s.status === 'upcoming' ? ' · placeholder' : ''}</p>
                <h2>{s.title}</h2>
              </div>
              <Link to={`/session/${s.id}`} className="button button-ghost button-small">Open session</Link>
            </div>
            <ReflectionBox
              storageKey={s.id}
              label={`My reflection on Session ${s.number}`}
              placeholder="What did you learn? What will you apply?"
            />
          </section>
        ))}
      </div>
    </>
  )
}
