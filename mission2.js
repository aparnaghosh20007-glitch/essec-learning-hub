/*
  MISSION 02 — THE AI AGENCY TOWER (game content)
  ------------------------------------------------
  Built from Nick Goh's lecture "Building an AI Marketing Team"
  (Yellow Pages Singapore, 30 October 2026) and session2.js.
  Slide numbers refer to the lecture PDF and were checked against it.

  The Louis Vuitton "Terra" campaign is a FICTIONAL scenario created for
  the lecture; it is not affiliated with or endorsed by Louis Vuitton.
  "Neo Metro" and "ARIA" are a fictional game setting. Wrong answer options
  are invented distractors, shown as wrong with the sourced explanation.
*/
import { session2 } from './session2.js'

const rows = (title) => session2.topics.find((t) => t.title === title)?.rows ?? []
const skill = (label) => rows('Claude setup and skills').find((r) => r.label === label)?.text

export const mission2 = {
  sessionId: 'session-2',
  theme: 'agency',
  chapter: { number: '02', title: 'THE AGENCY', subtitle: session2.title },
  district: 'The AI Agency Tower',
  sourceNote:
    'Mission 02 uses Nick Goh’s lecture slides (30 October 2026). Terra is a fictional educational scenario, not affiliated with or endorsed by Louis Vuitton. Neo Metro and ARIA are a fictional story layer.',
  floors: {
    learn: { name: 'The Lobby', desc: 'ARIA’s briefing and the handoff chain' },
    explore: { name: 'Planning Floor', desc: 'Order the team, match roles and skills' },
    play: { name: 'Production Studio', desc: 'Strategy cards: build the messaging hierarchy' },
    challenge: { name: 'Client War Room', desc: 'Make the Terra calls, then win over the consumer' },
    boss: { name: 'The Rooftop', desc: 'Boss battle: the original AI Marketing Team Challenge' },
  },

  intel: [
    { label: 'Client file', text: 'Terra, a fictional Louis Vuitton handbag · Singapore launch, September 2027 · 3-month campaign · indicative budget S$300,000 · 1,000 bags at S$5,800', source: 'Slide 13' },
    { label: 'Audience', text: '“The Conscious Luxury Consumer”: mainly women aged 30–50, Singapore-based affluent professionals, sceptical of greenwashing', source: 'Slide 15' },
    { label: 'Watch-out', text: 'Terra’s environmental credentials are hypothetical and must be substantiated before any ad is published', source: 'Slide 13' },
  ],

  // ---------- LEARN ----------
  learn: {
    location: 'District 02 · The AI Agency Tower · Lobby',
    lines: [
      {
        who: 'ARIA',
        text: 'Welcome to the AI Agency Tower, Manager. This district comes from Nick Goh’s lecture “Building an AI Marketing Team”: a lite agentic workflow with Claude.',
        source: 'Session 2 · Overview',
      },
      {
        who: 'ARIA',
        text: 'Instead of one long chat, the work is split into specialist roles, like a real agency team. Each role does one job with a clear input and a clear output.',
        source: 'Lecture notes · Introduction',
      },
      {
        who: 'ARIA',
        text: 'Our first client file is the fictional scenario used in class: the Singapore launch of a Louis Vuitton handbag called Terra. The floors are empty. Where do you begin?',
        source: 'Slide 13 · fictional scenario',
      },
    ],
    choice: {
      prompt: 'Where do you begin?',
      options: [
        {
          text: 'Hire the planning team, starting with the Brief Writer',
          verdict: 'best',
          title: 'Strong start',
          feedback: 'The handoff chain starts with the Brief Writer, who drafts the brief from the Project context and needs the goal, audience, budget and timing before anything creative happens.',
          source: 'Slides 4 and 6',
        },
        {
          text: 'Generate the key visuals right away',
          verdict: 'bad',
          title: 'Risky move · you start Production with 2 trust',
          feedback: 'Production comes after planning and human approval. Nothing goes into production until a person has checked the strategy and saved it for the team.',
          source: 'Slide 6 · handoff chain',
        },
        {
          text: 'Ask to see the client brief first',
          verdict: 'ok',
          title: 'Good instinct',
          feedback: 'Everything is built on the brief. The source brief: Terra, a 3-month Singapore launch with an indicative budget of S$300,000 and 1,000 bags at S$5,800. Someone still has to draft the marketing brief: the chain starts with the Brief Writer.',
          source: 'Slides 6 and 13',
        },
      ],
    },
    walkthrough: {
      title: 'Walk the handoff chain',
      intro: session2.workflow.intro,
      source: 'Slide 6 · The handoff chain',
      steps: session2.workflow.steps.map((s) => ({ ...s, source: 'Slide 6' })),
    },
  },

  // ---------- EXPLORE ----------
  explore: {
    intro: 'Staff the Planning Floor in three rounds. Drag each card into its slot, or tap a card and then tap a slot.',
    rounds: [
      {
        type: 'order',
        title: 'Round 1 · Build the chain',
        prompt: 'Put the six steps of the handoff chain in order.',
        source: 'Slide 6',
        items: ['Brief Writer', 'Brief Validator', 'Strategist', 'You · human approval', 'Designer + Copywriter', 'Reviewer'],
      },
      {
        type: 'match',
        title: 'Round 2 · Who delivers what?',
        prompt: 'Match each role to its output.',
        source: 'Slides 4 and 5',
        pairs: [
          { left: 'Brief Writer', right: 'Draft brief' },
          { left: 'Brief Validator', right: 'Verdict and top fixes' },
          { left: 'Strategist', right: 'Big Idea one-pager' },
          { left: 'Designer / Art Director', right: 'KV concepts and assets' },
          { left: 'Copywriter', right: 'Channel-by-channel copy' },
          { left: 'Reviewer', right: 'Edits and sign-off' },
        ],
      },
      {
        type: 'match',
        title: 'Round 3 · Install the skills',
        prompt: 'Match each Claude skill to its job.',
        source: 'Slide 8',
        pairs: ['Marketing Brief Builder', 'Brief Validator', 'Researcher Strategist', 'Creative Review Scorer', 'Governance Compliance Check'].map(
          (label) => ({ left: label, right: skill(label) }),
        ),
      },
    ],
  },

  // ---------- PLAY ----------
  play: {
    title: 'Production Studio',
    intro: 'Build Terra’s messaging hierarchy. Place each card in the slot it answers. Trap cards and wrong slots cost brand trust.',
    core: {
      label: 'CORE PROMISE',
      text: 'Terra is a Louis Vuitton handbag so beautifully made that you never have to explain it, with considered materials you can quietly stand behind.',
      source: 'Slide 22',
    },
    meter: 'Brand trust',
    slots: [
      { key: 'm1', label: 'MESSAGE 1 · LEAD', question: '“Is this really Louis Vuitton?”' },
      { key: 'm2', label: 'MESSAGE 2 · MATERIALS', question: '“What is it made of, and can I trust that?”' },
      { key: 'm3', label: 'MESSAGE 3 · SCARCITY', question: '“Why this bag, and will it last?”' },
      { key: 'cta', label: 'CALL TO ACTION', question: 'What should she do next?' },
    ],
    cards: [
      { id: 'craft', tag: 'MESSAGE', title: 'Craft first', text: 'Unmistakably Louis Vuitton in design and craft.', slot: 'm1', why: 'Message 1 is the lead message in every asset (slides 22–23).' },
      { id: 'fact', tag: 'MESSAGE', title: 'One verified fact', text: 'Considered, specific materials: one verified fact per asset.', slot: 'm2', why: 'Materials earn trust with one verified fact per asset, never as the headline (slides 22–23).' },
      { id: 'kept', tag: 'MESSAGE', title: 'Made to be kept', text: 'A limited allocation of 1,000 bags, made to be kept.', slot: 'm3', why: 'Scarcity and longevity answer “Why this bag, and will it last?” (slides 22–23).' },
      { id: 'cta', tag: 'ACTION', title: 'Book an appointment', text: '“Book an appointment to see Terra.”', slot: 'cta', why: 'The primary call to action; “Discover Terra” was the alternative (slides 22–23).' },
      { id: 'green', tag: 'TRAP', title: 'Green headline', text: 'Lead every ad with a bold environmental claim.', slot: null, why: '“Nothing to Explain” means no defensive green headline, and Terra’s green claims are unverified (slides 13 and 24).' },
      { id: 'promo', tag: 'TRAP', title: 'Go big and promotional', text: 'Push hard-selling, mass-market promotions to maximise volume.', slot: null, why: 'The brief says Louis Vuitton must avoid appearing overly promotional, mass-market or preachy. With 1,000 bags, qualified interest beats volume (slides 13, 15).' },
    ],
    result: { label: 'Hierarchy complete', text: 'Every message now ladders up to the core promise: object first, then craft, then a soft invitation, with no unverified environmental claim.' },
    source: 'Slides 22–23 · Messaging hierarchy',
  },

  // ---------- CHALLENGE ----------
  challenge: {
    title: 'Client War Room',
    intro: 'Six client calls, then a face-to-face with the Conscious Luxury Consumer. Wrong calls cost client confidence; lose all three and you replay the room.',
    meter: 'Client confidence',
    steps: [
      {
        situation: 'The Brief Validator returns its verdict. Terra has only 1,000 bags at S$5,800.',
        prompt: 'Which objective becomes primary?',
        source: 'Slide 17',
        options: [
          { text: 'Consideration: boutique appointments and enquiries', best: true, feedback: 'After validation, consideration (boutique enquiries) became the primary objective: with 1,000 bags at S$5,800, qualified interest matters more than raw volume.' },
          { text: 'Awareness: reach 1 million people', feedback: 'The validator flagged the 1M reach target as too high for Singapore’s affluent audience.' },
          { text: 'Engagement: saves and shares', feedback: 'Not the primary objective. After validation, consideration (boutique enquiries) became primary.' },
        ],
      },
      {
        situation: 'The Copywriter adapts the hierarchy per platform.',
        prompt: 'Which platform carries the campaign across all 12 weeks?',
        source: 'Slide 24',
        options: [
          { text: 'Instagram', best: true, feedback: 'Instagram is the core platform, carrying messages 1–3 across all 12 weeks with the boutique-appointment call to action.' },
          { text: 'TikTok', feedback: 'TikTok runs in weeks 1–6 only, leading with message 1 plus a material-to-object reveal for the 25–35 audience.' },
          { text: 'LinkedIn and YouTube', feedback: 'Both were outside the brief, so they were flagged as proposals needing a decision and budget.' },
        ],
      },
      {
        situation: 'The KV Concept Builder offers three key visual concepts.',
        prompt: 'Which is the master visual?',
        source: 'Slide 26',
        options: [
          { text: '“Held”: the ambassador holding the bag in quiet monochrome', best: true, feedback: '“Held” was recommended: it carries no unverified material claim, so it can be approved fastest and costs the least.' },
          { text: '“Reassembled”: denim panels resolve into the bag', feedback: 'The most shareable, but the riskiest on claims and the most expensive.' },
          { text: '“Years”: the same bag at three moments in one day', feedback: '“Years” carries the “Made to Be Kept” proof for weeks 7–12, but “Held” was the recommended master visual.' },
        ],
      },
      {
        situation: 'A press article says the LV Pillow uses “up to 90%” of a material.',
        prompt: 'Can the figure go into Terra’s copy?',
        source: 'Slides 22–23',
        options: [
          { text: 'No. It came from press coverage, so it must not be reused for Terra', best: true, feedback: 'The guardrail in the lecture: the “up to 90%” figure came from press coverage and must not be reused for Terra.' },
          { text: 'Yes, as the headline', feedback: 'Material facts are never the headline, and this one is not a verified fact about Terra.' },
          { text: 'Yes, published now and marked [to verify]', feedback: 'Unverified claims stay marked [to verify] until someone approves them. They are not published.' },
        ],
      },
      {
        situation: 'Someone asks to put the real ambassador’s face onto a generated model.',
        prompt: 'What do you do?',
        source: 'Slide 28',
        options: [
          { text: 'Decline: it would be a realistic image of a real person who has not agreed', best: true, feedback: 'Claude declined in the lecture: the image could easily be taken for a genuine ad. Rights and consent stay the marketer’s responsibility.' },
          { text: 'Do it, but add a “training only” label', feedback: 'From the lecture: a training label doesn’t change what the image shows.' },
          { text: 'Swap in a real LV product photo instead', feedback: 'Claude held off on this too in the lecture: a real product photo could also pass the result off as a genuine ad.' },
        ],
      },
      {
        situation: 'The Creative Review Scorer rates the desert Instagram post 4.3/10 and the Story 5.7/10.',
        prompt: 'What is the scorer’s “one change”?',
        source: 'Slides 47–49',
        options: [
          { text: 'Drop the desert-safari scene and use the “Held” concept', best: true, feedback: 'The desert-safari setting worked against the research, and the bag shown did not match the Terra renders.' },
          { text: 'Add more environmental claims to the caption', feedback: 'The restrained caption with no environmental claim was a strength; the image was the problem.' },
          { text: 'Keep it as it is', feedback: 'At 4.3 and 5.7 out of 10, the scorer asked for a change: drop the desert-safari scene.' },
        ],
      },
      {
        duel: true,
        speaker: 'The Conscious Luxury Consumer',
        speakerNote: 'Audience persona from the brief (slide 15)',
        situation: '“Is this really Louis Vuitton?”',
        prompt: 'Play your response card.',
        source: 'Slides 22–23',
        options: [
          { text: 'Lead with the recycled-materials story', feedback: 'Materials never take the headline, and Terra’s green claims are unverified. Message 1 has to prove it is unmistakably LV.' },
          { text: 'Craft first: unmistakably Louis Vuitton in design and craft', best: true, feedback: 'Message 1 leads every asset: the object and the craft come first.' },
          { text: 'Show her the ambassador face swap', feedback: 'Declined in the lecture: a realistic image of a real person who has not agreed could pass as a genuine endorsement.' },
        ],
      },
      {
        duel: true,
        speaker: 'The Conscious Luxury Consumer',
        speakerNote: 'Sceptical of greenwashing (slide 15)',
        situation: '“What is it made of, and can I trust that?”',
        prompt: 'Play your response card.',
        source: 'Slides 22–23',
        options: [
          { text: 'Quote the LV Pillow “up to 90%” figure', feedback: 'That figure came from press coverage of a different product, so it must not be reused for Terra.' },
          { text: 'One verified fact per asset', best: true, feedback: 'Trust comes from one verified fact per asset, never from a headline claim.' },
          { text: 'List every material claim you can', feedback: 'One verified fact per asset, never as the headline. Unverified claims stay out.' },
        ],
      },
      {
        duel: true,
        speaker: 'The Conscious Luxury Consumer',
        speakerNote: 'She values craft and heritage (slide 15)',
        situation: '“Why this bag, and will it last?”',
        prompt: 'Play your closing card.',
        source: 'Slides 13, 22–23',
        options: [
          { text: 'Made to be kept: a limited allocation of 1,000 bags', best: true, feedback: 'Scarcity and longevity are the luxury argument. Close with “Book an appointment to see Terra”.' },
          { text: 'Hard-sell promotion to move stock fast', feedback: 'The brief says Louis Vuitton must avoid appearing overly promotional, mass-market or preachy.' },
          { text: 'Promise mass awareness across Singapore', feedback: 'Mass reach was flagged as unrealistic for this audience; consideration is the primary objective.' },
        ],
      },
    ],
  },

  reflection: {
    prompt: 'What surprised you about running an AI marketing team? Where would you keep a human in the loop, and how would you use this workflow yourself?',
  },
}
