/*
  ============================================================
  SESSIONS DATA — the only file you need to edit to add content
  ============================================================

  Each object in the `sessions` list below becomes:
    • a tab in the navigation bar
    • a card on the homepage
    • its own page at /session/<id>

  To fill in a placeholder after a guest speaker visits:
    1. Find the session (e.g. id: 'session-2').
    2. Change `status` from 'upcoming' to 'completed'.
    3. Replace the placeholder text (title, topic, speaker, date, summary).
    4. Add your `takeaways` (a list of short sentences).
    5. Optional: add a `quiz` — copy the format used in Session 1.
       If you leave `quiz: null`, the page shows a
       "Mark session as complete" button instead.

  To add a 7th session: copy one whole { ... } block, paste it at the
  end of the list, and give it a new unique id like 'session-7'.

  Quiz question formats:
    • Multiple choice:
        { type: 'choice', question: '...', options: ['A', 'B', 'C', 'D'],
          answer: 1,               // index of the correct option (0 = first)
          explanation: '...' }
    • Put-in-order:
        { type: 'order', question: '...',
          items: ['Step 1', 'Step 2', 'Step 3'],   // write them in the CORRECT order
          explanation: '...' }                      // the app shuffles them for you
*/

export const sessions = [
  {
    id: 'session-1',
    number: 1,
    status: 'completed', // 'completed' or 'upcoming'
    title: 'Vibe Coding: From Prompt to Published App',
    topic: 'Building and deploying web apps with AI tools',
    speaker: 'Guest speaker — add name',
    date: 'Add date',
    summary:
      'A hands-on workshop on "vibe coding": describing what you want in plain language and using AI tools to design, build and deploy a working website. We followed the full workflow from a first prompt to a public link, using Claude Design, Claude Code, GitHub and Vercel.',
    tools: ['Claude Design', 'Claude Code', 'GitHub', 'Vercel'],
    activities: [
      'Interactive quiz (10 questions)',
      'Workflow ordering challenge',
      'Key takeaways review',
      'Personal reflection',
    ],
    takeaways: [
      'Vibe coding means describing the outcome you want in natural language and iterating with an AI tool, rather than writing every line yourself.',
      'Claude Design is useful for exploring the look and layout of an idea (designs, prototypes, slides) before committing to code.',
      'Claude Code is an agentic coding tool: it can read, write and run code across a whole project, and fix errors you show it.',
      'Better prompts give better apps: state the purpose, audience, pages, features and style, then refine step by step.',
      'GitHub stores your project as a repository with a full history of commits, so you can collaborate, review changes and roll back mistakes.',
      'Vercel turns a GitHub repository into a live website with a shareable link, and redeploys automatically every time you push changes.',
      'The core workflow: design → build → test locally → push to GitHub → deploy on Vercel → iterate.',
      'Never put API keys or passwords in your code or repository; use environment variables in your hosting settings instead.',
    ],
    quiz: {
      title: 'Vibe Coding Challenge',
      intro:
        'Ten questions on the tools and workflow from the workshop. You get instant feedback after every answer — aim for 8/10 or better!',
      questions: [
        {
          type: 'choice',
          question: 'What best describes "vibe coding"?',
          options: [
            'Writing code by hand while listening to music',
            'Describing what you want in natural language and iterating with an AI tool that writes the code',
            'Copying code snippets from forums without testing them',
            'A programming language designed for beginners',
          ],
          answer: 1,
          explanation:
            'Vibe coding is about expressing intent in plain language and steering an AI through rounds of feedback — you focus on the "what", the AI handles much of the "how".',
        },
        {
          type: 'choice',
          question: 'At which stage is Claude Design most useful?',
          options: [
            'Hosting the finished website on the internet',
            'Tracking changes to the code over time',
            'Exploring the visual look and layout of an idea — designs, prototypes or slides — before building',
            'Storing user passwords securely',
          ],
          answer: 2,
          explanation:
            'Claude Design focuses on visual creation: quickly turning an idea into designs and prototypes you can react to before investing in the full build.',
        },
        {
          type: 'choice',
          question: 'What makes Claude Code different from simply chatting about code?',
          options: [
            'It only works with one file at a time',
            'It is a design tool for making logos',
            'It can act on a whole project: reading files, writing code, running commands and fixing errors',
            'It automatically publishes your site to the web',
          ],
          answer: 2,
          explanation:
            'Claude Code is agentic — it works inside your project, makes changes across files, runs the app and responds to error messages.',
        },
        {
          type: 'choice',
          question: 'Which prompt is most likely to produce a useful first version of a website?',
          options: [
            '"Make me a website."',
            '"Build a cool app, make it good."',
            '"Build a responsive site for students to track guest sessions: a homepage, one tab per session, a 10-question quiz with instant feedback, and a clean modern style."',
            '"Write HTML."',
          ],
          answer: 2,
          explanation:
            'Specific prompts win. Naming the audience, pages, features and style gives the AI enough context to build something close to what you need on the first try.',
        },
        {
          type: 'choice',
          question: 'What is a GitHub repository?',
          options: [
            'A paid plugin that speeds up your website',
            'A project folder stored online, with a full history of every change made to it',
            'A chat room for programmers',
            'A tool that writes code for you',
          ],
          answer: 1,
          explanation:
            'A repository ("repo") holds all your project files plus their version history, so you and teammates can work on the same code safely.',
        },
        {
          type: 'choice',
          question: 'In Git, what is a "commit"?',
          options: [
            'A saved snapshot of your changes, with a short message describing them',
            'A promise to finish the project by a deadline',
            'Deleting old files from the project',
            'Publishing the website to the internet',
          ],
          answer: 0,
          explanation:
            'Each commit records exactly what changed and why. Together, commits form a timeline you can review or roll back to.',
        },
        {
          type: 'choice',
          question: 'What does Vercel do in this workflow?',
          options: [
            'Designs the user interface',
            'Writes the code from your prompt',
            'Takes your project and hosts it online with a public, shareable URL',
            'Replaces GitHub as a place to store code',
          ],
          answer: 2,
          explanation:
            'Vercel is a hosting platform: it builds your project and serves it on the web so anyone with the link can use it.',
        },
        {
          type: 'choice',
          question:
            'Your GitHub repo is connected to Vercel. You fix a typo and push a new commit. What happens?',
          options: [
            'Nothing — you must delete and recreate the Vercel project',
            'Vercel automatically rebuilds and redeploys the site with your change',
            'GitHub emails the change to every visitor',
            'The old website stays online forever',
          ],
          answer: 1,
          explanation:
            'This is continuous deployment: every push to the connected branch triggers a fresh build, so the live site stays in sync with your code.',
        },
        {
          type: 'choice',
          question: 'Your app needs a secret API key. Where should it go?',
          options: [
            'Directly in the code, so it is easy to find',
            'In the README file on GitHub',
            'In environment variables in your hosting settings — never committed to the repository',
            'In a comment at the top of the homepage',
          ],
          answer: 2,
          explanation:
            'Anything committed to a public repo can be read by anyone. Secrets belong in environment variables (e.g. in Vercel\'s project settings).',
        },
        {
          type: 'order',
          question: 'Put the app-building workflow in the right order. Tap the steps from first to last.',
          items: [
            'Design the idea (e.g. with Claude Design)',
            'Build the app from prompts (e.g. with Claude Code)',
            'Test it locally and fix errors',
            'Push the code to a GitHub repository',
            'Deploy on Vercel and share the link',
          ],
          explanation:
            'Design → build → test → push → deploy. And then repeat: each improvement is another prompt, another commit, and an automatic redeploy.',
        },
      ],
    },
  },

  // ---------- PLACEHOLDERS: fill these in after each session ----------
  {
    id: 'session-2',
    number: 2,
    status: 'upcoming',
    title: 'Session 2 — Title to be added',
    topic: 'Topic to be added after the session',
    speaker: 'Guest speaker — to be confirmed',
    date: 'Date to be added',
    summary: 'Placeholder: add a short summary of this guest speaker session here.',
    tools: [],
    activities: ['Interactive game — to be added', 'Key takeaways — to be added', 'Personal reflection'],
    takeaways: [],
    quiz: null,
  },
  {
    id: 'session-3',
    number: 3,
    status: 'upcoming',
    title: 'Session 3 — Title to be added',
    topic: 'Topic to be added after the session',
    speaker: 'Guest speaker — to be confirmed',
    date: 'Date to be added',
    summary: 'Placeholder: add a short summary of this guest speaker session here.',
    tools: [],
    activities: ['Interactive game — to be added', 'Key takeaways — to be added', 'Personal reflection'],
    takeaways: [],
    quiz: null,
  },
  {
    id: 'session-4',
    number: 4,
    status: 'upcoming',
    title: 'Session 4 — Title to be added',
    topic: 'Topic to be added after the session',
    speaker: 'Guest speaker — to be confirmed',
    date: 'Date to be added',
    summary: 'Placeholder: add a short summary of this guest speaker session here.',
    tools: [],
    activities: ['Interactive game — to be added', 'Key takeaways — to be added', 'Personal reflection'],
    takeaways: [],
    quiz: null,
  },
  {
    id: 'session-5',
    number: 5,
    status: 'upcoming',
    title: 'Session 5 — Title to be added',
    topic: 'Topic to be added after the session',
    speaker: 'Guest speaker — to be confirmed',
    date: 'Date to be added',
    summary: 'Placeholder: add a short summary of this guest speaker session here.',
    tools: [],
    activities: ['Interactive game — to be added', 'Key takeaways — to be added', 'Personal reflection'],
    takeaways: [],
    quiz: null,
  },
  {
    id: 'session-6',
    number: 6,
    status: 'upcoming',
    title: 'Session 6 — Title to be added',
    topic: 'Topic to be added after the session',
    speaker: 'Guest speaker — to be confirmed',
    date: 'Date to be added',
    summary: 'Placeholder: add a short summary of this guest speaker session here.',
    tools: [],
    activities: ['Interactive game — to be added', 'Key takeaways — to be added', 'Personal reflection'],
    takeaways: [],
    quiz: null,
  },
]

// Small helper used by the pages to look up one session by its id.
export function getSession(id) {
  return sessions.find((s) => s.id === id)
}
