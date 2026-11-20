/*
  MISSION 01 — THE PROMPT LAB (game content)
  -------------------------------------------
  Built ONLY from the Session 1 content already in this project
  (sessions.js: summary, tools, 8 takeaways and the 10 quiz questions).
  No workshop slides were available, so nothing else is presented as
  workshop content. Every item shows its source in the game.

  Story layer: "Neo Metro", "ARIA" and "the Prompt Lab" are a fictional
  game setting. Wrong answer options in the activities are invented
  distractors (they are shown as wrong, with the correct answer sourced).
*/
import { getSession } from './sessions.js'

const s1 = getSession('session-1')
const T = (n) => s1.takeaways[n - 1] // takeaway text, 1-based
const Q = (n) => s1.quiz.questions[n - 1] // quiz question, 1-based

export const mission1 = {
  sessionId: 'session-1',
  theme: 'lab',
  chapter: { number: '01', title: 'THE LAB', subtitle: s1.title },
  district: 'The Prompt Lab',
  sourceNote:
    'Mission 01 uses only the Session 1 content saved in this project: its summary, takeaways, quiz and workflow. Neo Metro and ARIA are a fictional story layer.',
  floors: {
    learn: { name: 'Arrival Deck', desc: 'ARIA’s briefing and the workflow light path' },
    explore: { name: 'Tool Stations', desc: 'Match tools and terms, then order the workflow' },
    play: { name: 'The Prompt Forge', desc: 'Forge a prompt from its five parts' },
    challenge: { name: 'Launch Control', desc: 'Make the launch-day calls' },
    boss: { name: 'The Core', desc: 'Boss battle: the original Vibe Coding Challenge' },
  },

  // ---------- LEARN ----------
  learn: {
    location: 'District 01 · The Prompt Lab · Arrival Deck',
    lines: [
      {
        who: 'ARIA',
        text: 'Welcome to the Prompt Lab, Explorer. This district is built from a hands-on workshop on “vibe coding”: describing what you want in plain language and using AI tools to design, build and deploy a working website.',
        source: 'Session 1 · Overview',
      },
      {
        who: 'ARIA',
        text: 'The workshop followed the full workflow from a first prompt to a public link, using Claude Design, Claude Code, GitHub and Vercel. Each one powers a station in this lab.',
        source: 'Session 1 · Overview',
      },
      { who: 'ARIA', text: 'First test. Someone asks you for a website by the end of the week. How do you start?' },
    ],
    choice: {
      prompt: 'How do you start?',
      options: [
        {
          text: 'Describe the outcome I want in plain language, then iterate with an AI tool',
          verdict: 'best',
          title: 'That is vibe coding',
          feedback: T(1),
          source: 'Session 1 · Takeaway 1',
        },
        {
          text: 'Write every line of code myself before anyone sees it',
          verdict: 'bad',
          title: 'Not this lab’s method',
          feedback: 'Vibe coding is the opposite: describe the outcome you want in natural language and iterate with an AI tool, rather than writing every line yourself.',
          source: 'Session 1 · Takeaway 1',
        },
        {
          text: 'Copy code snippets from forums without testing them',
          verdict: 'bad',
          title: 'Risky shortcut',
          feedback: 'This is a wrong answer in the Session 1 quiz. ' + Q(1).explanation,
          source: 'Session 1 · Quiz Q1',
        },
      ],
    },
    walkthrough: {
      title: 'Light the workflow path',
      intro: 'The core workflow from the workshop. Power up each station in order.',
      source: 'Session 1 · Takeaway 7',
      steps: [
        { who: 'Design', team: 'Claude Design', does: 'Explore the look and layout of the idea.', detail: T(2), output: 'Designs and prototypes to react to', source: 'Takeaway 2 · Quiz Q2' },
        { who: 'Build', team: 'Claude Code', does: 'Build the app from prompts.', detail: T(3), output: 'A working app', source: 'Takeaway 3 · Quiz Q3' },
        { who: 'Test locally', team: 'Your computer', does: 'Test it locally and fix errors.', detail: 'Run the app before it goes public. Claude Code can fix errors you show it.', output: 'A tested app', source: 'Quiz Q10 · Takeaway 3' },
        { who: 'Push', team: 'GitHub', does: 'Push the code to a GitHub repository.', detail: T(5), output: 'Commits in a repository', source: 'Takeaway 5 · Quiz Q5–Q6' },
        { who: 'Deploy', team: 'Vercel', does: 'Deploy on Vercel and share the link.', detail: T(6), output: 'A public, shareable link', source: 'Takeaway 6 · Quiz Q7–Q8' },
        { who: 'Iterate', team: 'Repeat', does: 'Improve it, step by step.', detail: Q(10).explanation, output: 'The next version', source: 'Takeaway 7 · Quiz Q10' },
      ],
    },
  },

  // ---------- EXPLORE ----------
  explore: {
    intro: 'Three rounds at the tool stations. Drag each card into its slot, or tap a card and then tap a slot.',
    rounds: [
      {
        type: 'match',
        title: 'Round 1 · Power the stations',
        prompt: 'Match each tool to its job in the workflow.',
        source: 'Session 1 · Takeaways 2, 3, 5 and 6',
        pairs: [
          { left: 'Claude Design', right: 'Explore the look and layout of an idea (designs, prototypes, slides) before committing to code' },
          { left: 'Claude Code', right: 'Read, write and run code across a whole project, and fix errors you show it' },
          { left: 'GitHub', right: 'Store the project as a repository with a full history of commits' },
          { left: 'Vercel', right: 'Turn a repository into a live website with a shareable link' },
        ],
      },
      {
        type: 'match',
        title: 'Round 2 · Decode the terminal',
        prompt: 'Match each term to its meaning.',
        source: 'Session 1 · Quiz Q1, Q5, Q6, Q8, Q9',
        pairs: [
          { left: 'Vibe coding', right: Q(1).options[1] },
          { left: 'Repository', right: Q(5).options[1] },
          { left: 'Commit', right: Q(6).options[0] },
          { left: 'Continuous deployment', right: 'Every push to the connected branch triggers a fresh build of the live site' },
          { left: 'Environment variables', right: 'Where secrets such as API keys go: in your hosting settings, never in the repository' },
        ],
      },
      {
        type: 'order',
        title: 'Round 3 · Light the path',
        prompt: 'Put the core workflow in order, from first to last.',
        source: 'Session 1 · Takeaway 7',
        items: ['Design', 'Build', 'Test locally', 'Push to GitHub', 'Deploy on Vercel', 'Iterate'],
      },
    ],
  },

  // ---------- PLAY ----------
  play: {
    title: 'The Prompt Forge',
    intro: 'Better prompts give better apps. Slot each card into the part of the prompt it answers. Vague prompts are trap cards: they cost stability.',
    core: { label: 'FORGE RULE', text: T(4), source: 'Session 1 · Takeaway 4' },
    meter: 'Stability',
    slots: [
      { key: 'purpose', label: 'PURPOSE', question: 'What is it for?' },
      { key: 'audience', label: 'AUDIENCE', question: 'Who is it for?' },
      { key: 'pages', label: 'PAGES', question: 'Which pages?' },
      { key: 'features', label: 'FEATURES', question: 'What must it do?' },
      { key: 'style', label: 'STYLE', question: 'How should it look?' },
    ],
    cards: [
      { id: 'purpose', tag: 'PART', title: 'Track guest sessions', text: 'A site to track guest sessions', slot: 'purpose', why: 'The purpose says what the site is for.' },
      { id: 'audience', tag: 'PART', title: 'For students', text: 'Built for students', slot: 'audience', why: 'Naming the audience gives the AI context.' },
      { id: 'pages', tag: 'PART', title: 'Homepage + tabs', text: 'A homepage and one tab per session', slot: 'pages', why: 'Listing the pages tells the AI what to build.' },
      { id: 'features', tag: 'PART', title: 'Quiz with feedback', text: 'A 10-question quiz with instant feedback', slot: 'features', why: 'Features say what the site must do.' },
      { id: 'style', tag: 'PART', title: 'Clean and modern', text: 'Responsive, with a clean modern style', slot: 'style', why: 'Style sets the look and feel.' },
      { id: 'vague1', tag: 'TRAP', title: '“Make me a website.”', text: 'Send it as it is', slot: null, why: 'A wrong answer in the Session 1 quiz. ' + Q(4).explanation },
      { id: 'vague2', tag: 'TRAP', title: '“Build a cool app, make it good.”', text: 'Send it as it is', slot: null, why: 'Too vague: it names no purpose, audience, pages, features or style. ' + Q(4).explanation },
      { id: 'vague3', tag: 'TRAP', title: '“Write HTML.”', text: 'Send it as it is', slot: null, why: 'A wrong answer in the Session 1 quiz: it says nothing about what the site is for or who will use it.' },
    ],
    result: { label: 'Your forged prompt (Session 1 · Quiz Q4, the strong answer)', text: Q(4).options[2] },
    source: 'Session 1 · Takeaway 4 and Quiz Q4',
  },

  // ---------- CHALLENGE ----------
  challenge: {
    title: 'Launch Control',
    intro: 'Launch day. Six calls stand between your app and a public link. Wrong calls cost stability; lose all three and the launch fails, so you retry.',
    meter: 'Stability',
    steps: [
      {
        situation: 'Before any code exists, you want to react to how the site could look.',
        prompt: 'Which station do you visit first?',
        source: 'Session 1 · Quiz Q2, Q5, Q7',
        options: [
          { text: 'Claude Design', best: true, feedback: Q(2).explanation },
          { text: 'Vercel', feedback: 'Vercel hosts the finished site; it does not design it. ' + Q(7).explanation },
          { text: 'GitHub', feedback: 'GitHub stores the project and its history; it is not where you explore the look. ' + Q(5).explanation },
        ],
      },
      {
        situation: 'Your first build opens with an error message on screen.',
        prompt: 'What do you do?',
        source: 'Session 1 · Takeaway 3 · Quiz Q3, Q10',
        options: [
          { text: 'Show the error to Claude Code and ask it to fix it', best: true, feedback: T(3) },
          { text: 'Ignore it and deploy anyway', feedback: 'The workflow tests the app locally and fixes errors before pushing and deploying.' },
          { text: 'Delete the project and start from scratch', feedback: 'No need: ' + Q(3).explanation },
        ],
      },
      {
        situation: 'The app needs a secret API key to work.',
        prompt: 'Where does the key go?',
        source: 'Session 1 · Takeaway 8 · Quiz Q9',
        options: [
          { text: Q(9).options[2], best: true, feedback: Q(9).explanation },
          { text: Q(9).options[0], feedback: Q(9).explanation },
          { text: Q(9).options[1], feedback: Q(9).explanation },
        ],
      },
      {
        situation: 'You have a working change and want it in the project’s history.',
        prompt: 'How do you save it?',
        source: 'Session 1 · Takeaway 5 · Quiz Q6',
        options: [
          { text: 'Make a commit: a snapshot with a short message describing the change', best: true, feedback: Q(6).explanation },
          { text: 'Publish it straight to the internet', feedback: 'Publishing is Vercel’s job. ' + Q(6).explanation },
          { text: 'Delete the old files to keep things tidy', feedback: 'That loses your history. ' + T(5) },
        ],
      },
      {
        situation: 'A visitor spots a typo on the live site. You fix it and push a new commit.',
        prompt: 'What happens next?',
        source: 'Session 1 · Takeaway 6 · Quiz Q8',
        options: [
          { text: Q(8).options[1], best: true, feedback: Q(8).explanation },
          { text: Q(8).options[0], feedback: Q(8).explanation },
          { text: Q(8).options[3], feedback: Q(8).explanation },
        ],
      },
      {
        situation: 'The site is live and the link is shared.',
        prompt: 'Is the job done?',
        source: 'Session 1 · Takeaway 7 · Quiz Q10',
        options: [
          { text: 'Keep iterating: each improvement is another prompt, commit and redeploy', best: true, feedback: Q(10).explanation },
          { text: 'Yes. Never change it again', feedback: 'The workflow ends with “iterate”. ' + Q(10).explanation },
        ],
      },
    ],
  },

  reflection: {
    prompt: 'How would you prompt an app idea of your own, using purpose, audience, pages, features and style? What would you build first?',
  },
}
