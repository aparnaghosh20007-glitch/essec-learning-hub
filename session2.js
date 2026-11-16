/*
  SESSION 2 — Building an AI Marketing Team (Nick Goh, Yellow Pages Singapore)
  All content below is taken from the lecture slides of 30 October 2026.
  The Louis Vuitton "Terra" campaign used in class is a FICTIONAL scenario
  created for educational purposes; it is not affiliated with Louis Vuitton.

  Extra (optional) fields used by this session — any session can use them:
    subtitle, organisation, objectives, concepts, workflow, topics
*/

export const session2 = {
  id: 'session-2',
  number: 2,
  status: 'completed',
  title: 'Building an AI Marketing Team',
  subtitle: 'A Lite Agentic Workflow with Claude',
  topic: 'Running a marketing team of specialised AI roles, from brief to reviewed creative',
  speaker: 'Nick Goh',
  organisation: 'Yellow Pages Singapore',
  date: '30 October 2026',
  tools: ['Claude Projects & Skills', 'Scheduled tasks', 'SOMIN', 'Higgsfield', 'ChatGPT'],
  summary:
    'Nick Goh (CEO of INSPIRO Consulting; CMO of Yellow Pages Singapore and Marketing Lead of YP Academy) showed how a marketer can set up a "lite" agentic workflow in Claude: six specialist roles split into a Planning Team and a Production Team, each built as a reusable Claude skill, with a human approval step in the middle. He ran the whole chain live on a fictional campaign, the Singapore launch of a Louis Vuitton handbag called "Terra", from an emailed brief all the way to scored Instagram creative.',
  activities: [
    'Interactive handoff-chain walkthrough',
    'Key concept flip cards',
    'Louis Vuitton Terra case study',
    'Quiz (12 questions)',
    'Personal reflection',
  ],

  objectives: [
    'Explain what an agentic marketing workflow is and why it is split into specialised roles.',
    'Describe the jobs and outputs of the Planning Team (Brief Writer, Brief Validator, Strategist) and the Production Team (Designer, Copywriter, Reviewer).',
    'Put the six-step handoff chain in order and identify where human approval happens.',
    'Explain how Claude Projects, skills and scheduled tasks turn each role into a repeatable tool.',
    'Connect brief, research, Big Idea and messaging hierarchy using the Louis Vuitton Terra example.',
    'Evaluate AI-generated creative using a scoring framework and human judgement.',
  ],

  concepts: [
    {
      term: 'Agentic workflow',
      definition:
        'A chain of AI "agents", each with one job, where the output of one becomes the input of the next — instead of one long, do-everything chat.',
    },
    {
      term: 'Skill',
      definition:
        'A saved set of instructions (a SKILL.md with purpose, when to use it and inputs needed) that turns Claude into a specific team member, e.g. "Marketing Brief Builder".',
    },
    {
      term: 'Claude Project',
      definition:
        'A shared workspace (here "LVMH AI Marketing Team") holding instructions, context files, memory and scheduled tasks, so every chat starts with the same knowledge base.',
    },
    {
      term: 'Marketing brief',
      definition:
        'The document that sets the goal, audience, budget, timing, objectives and success metrics. Every later step is built on it.',
    },
    {
      term: 'Big Idea',
      definition:
        'The single creative thought the campaign is built around. For Terra: "Nothing to Explain". The Strategist delivers it as a one-pager.',
    },
    {
      term: 'Messaging hierarchy',
      definition:
        'The order of what to say: a core promise, supporting messages with proof points, and a call to action, then adapted per platform.',
    },
    {
      term: 'Key visual (KV)',
      definition:
        'The master campaign image that carries the Big Idea. The Designer / Art Director creates KV concepts and assets.',
    },
    {
      term: 'Hidden motivation truth',
      definition:
        'The underlying reason a customer buys. For Terra (a hypothesis): "She does not want a sustainable bag; she wants a bag she never has to justify."',
    },
    {
      term: 'Human in the loop',
      definition:
        'The approval point where you check the AI output, decide, and save it to the knowledge base before production starts.',
    },
  ],

  workflow: {
    title: 'The handoff chain',
    intro: 'Six steps. Each role hands its output to the next one — and a human approves the strategy before any creative is made.',
    steps: [
      {
        who: 'Brief Writer',
        team: 'Planning',
        does: 'Drafts the brief using the Project context.',
        detail:
          'Needs the goal, audience, budget and timing. In class it was triggered automatically by a scheduled task that read the "Marketing Brief" email.',
        output: 'Draft brief',
      },
      {
        who: 'Brief Validator',
        team: 'Planning',
        does: 'New chat, fresh eyes.',
        detail:
          'Critiques the brief in a fresh chat so it is not influenced by the writer. Checks objective, audience, message and metric.',
        output: 'Verdict and top fixes',
      },
      {
        who: 'Strategist',
        team: 'Planning',
        does: 'Digests the validated brief and shapes the Big Idea.',
        detail: 'Uses research on the brand, competitors and audience to find what the brand can credibly own.',
        output: 'Big Idea one-pager',
      },
      {
        who: 'You',
        team: 'Human approval',
        does: 'Approve and save to the knowledge base.',
        detail:
          'The human checkpoint. Nothing goes into production until a person has checked the strategy and saved it for the rest of the team to use.',
        output: 'Approved strategy in the Project',
      },
      {
        who: 'Designer + Copywriter',
        team: 'Production',
        does: 'Key visuals via Higgsfield, plus channel messaging.',
        detail:
          'The Designer / Art Director creates KV concepts and assets using connectors such as Higgsfield. The Copywriter builds the messaging hierarchy and adapts it per channel and platform.',
        output: 'KV concepts and channel-by-channel copy',
      },
      {
        who: 'Reviewer',
        team: 'Production',
        does: 'Checks brand voice.',
        detail: 'Checks the work against brand voice and confirms it delivers the brief and the Big Idea.',
        output: 'Edits and sign-off',
      },
    ],
  },

  topics: [
    {
      title: 'Introduction to AI marketing teams',
      intro:
        'The lecture opened with recent industry headlines — companies cutting jobs as investment shifts toward AI, WPP folding Ogilvy, VML and AKQA into a single creative banner, and Getty Images filing for US bankruptcy — to show how fast marketing work is changing.',
      points: [
        'Instead of one long chat, the work is split into specialist roles, mirroring a real agency team.',
        'Each role does one job with a clear input and a clear output, which makes the work easier to check and to repeat.',
        'Claude coordinates the work: every role is a skill inside one Claude Project, so all of them share the same brief, brand guide and research files.',
        'The team covers planning (briefs, research, strategy), production (visuals, copy) and quality control (review, scoring, compliance).',
      ],
    },
    {
      title: 'The Planning Team',
      cards: [
        { title: 'Brief Writer', items: ['Drafts the brief from Project context', 'Needs goal, audience, budget, timing'], output: 'Draft brief' },
        { title: 'Brief Validator', items: ['Critiques the brief in a fresh chat', 'Checks objective, audience, message, metric'], output: 'Verdict and top fixes' },
        { title: 'Strategist', items: ['Digests the validated brief', 'Develops the Big Idea'], output: 'Big Idea one-pager' },
      ],
    },
    {
      title: 'The Production Team',
      cards: [
        { title: 'Designer / Art Director', items: ['Creates the key visuals (KVs)', 'Uses connectors, e.g. Higgsfield'], output: 'KV concepts and assets' },
        { title: 'Copywriter', items: ['Builds the messaging hierarchy', 'Adapts it per channel and platform'], output: 'Channel-by-channel copy' },
        { title: 'Reviewer', items: ['Checks work against brand voice', 'Confirms it delivers the brief and Big Idea'], output: 'Edits and sign-off' },
      ],
    },
    {
      title: 'Claude setup and skills',
      intro:
        'Everything lived in one Claude Project called "LVMH AI Marketing Team", with Instructions, Context (28 files such as the brief, brand guide and research), Memory and a Scheduled task. Each team member was a custom skill:',
      rows: [
        { label: 'Marketing Brief Builder', text: 'Drafts a structured marketing brief from objectives, audience and Project context.' },
        { label: 'Brief Validator', text: 'Scores a brief against a checklist of objective, audience, message, channels and success measures.' },
        { label: 'Researcher Strategist', text: 'Researches a brand or product to find differentiation and key selling points against competitors.' },
        { label: 'Messaging Hierarchy Builder', text: 'Builds the core promise, supporting messages and proof points.' },
        { label: 'KV Concept Builder', text: 'Turns the approved brief and Big Idea into several key visual concepts, described in words.' },
        { label: 'Creative Review Scorer', text: 'Scores creative work (images, visuals or concepts) against the approved brief.' },
        { label: 'Governance Compliance Check', text: 'Checks content against the Singapore Code of Advertising Practice (SCAP).' },
      ],
      note:
        'The email trigger: a scheduled task ran "Marketing Brief Builder" daily. It found the latest email labelled "Marketing Brief", ran the skill on it, saved the draft to the Project and sent a notification — marking anything missing as [to confirm] instead of inventing it.',
    },
    {
      title: 'Marketing Brief Builder and revision',
      intro:
        'The source was a (fictional) internal Louis Vuitton social media brief: launch of the Terra handbag in Singapore, September 2027, a 3-month campaign with an indicative budget of S$300,000. Terra costs S$5,800, uses plant-based leather alternatives and selected recycled materials, and has an initial allocation of 1,000 bags. Its environmental credentials are hypothetical and must be substantiated before any ad is published.',
      points: [
        'The challenge: build awareness, desirability and consideration while establishing environmental credentials — without becoming promotional, mass-market or preachy.',
        'The draft brief set four objectives (awareness, desirability, consideration, brand health) with targets such as 20,000 qualified product-page visits and 300 boutique appointment or enquiry actions.',
        'Primary audience: "The Conscious Luxury Consumer" — mainly women aged 30–50, Singapore-based affluent professionals who value craft and heritage and are sceptical of greenwashing. Secondary: affluent 25–35 year olds.',
        'After validation, three fixes were made: every metric got a definition, data source, baseline and tracking method; consideration (boutique enquiries) became the primary objective; and the channels were narrowed to Instagram and TikTok, each tied to an objective, with one desirability-led message.',
        'The 1M reach target was flagged as too high for Singapore\'s affluent audience. Proposed changes were marked "(proposal)" and gaps "[to confirm]" — no budget figures or baselines were invented.',
      ],
    },
    {
      title: 'Research and strategy',
      intro: 'The Researcher Strategist skill used social data (SOMIN) and web search to build the "LV Terra – Research and Strategy Foundation".',
      rows: [
        { label: 'Hidden motivation (hypothesis)', text: 'She does not want a sustainable bag; she wants a bag she never has to justify. Beauty is the reason to buy; verified materials are the permission.' },
        { label: 'LV today', text: '90 days of organic social lean on heritage, travel, sport and art partnerships; sustainability-type topics appeared in only 2 of 210 posts.' },
        { label: 'Ansoff', text: 'Product development first (a new materials story for existing LV women buyers), market development second.' },
        { label: 'White space', text: '"Made to last" proof and desire-led storytelling, where LV is thin against competitors.' },
        { label: 'Differentiation', text: 'Plant-based leather alone will not set Terra apart — Hermès and Gucci have both worked on it. What LV can own is craft, scarcity and proof, in that order.' },
        { label: 'Watch-outs', text: 'Terra\'s green claims are unverified, SOMIN shows activity not motivation, and competitor facts from older press are marked [to verify].' },
      ],
    },
    {
      title: 'Messaging hierarchy',
      quote:
        'Core promise: "Terra is a Louis Vuitton handbag so beautifully made that you never have to explain it, with considered materials you can quietly stand behind."',
      rows: [
        { label: 'Big Idea — stance', text: '"Nothing to Explain": object first, confidence, restraint, no defensive green headline.' },
        { label: 'Visual territory', text: '"The Art of Renewal": material transformation shown as a striking final object; craft close-ups, texture, silhouette.' },
        { label: 'Proof pillar', text: '"Made to Be Kept": longevity and care as the luxury argument, weighted to weeks 7–12.' },
        { label: 'Message 1', text: '"Is this really Louis Vuitton?" — unmistakably LV in design and craft. The lead message in every asset.' },
        { label: 'Message 2', text: '"What is it made of, and can I trust that?" — considered, specific materials, with one verified fact per asset, never as the headline.' },
        { label: 'Message 3', text: '"Why this bag, and will it last?" — a limited allocation of 1,000 bags, made to be kept.' },
        { label: 'Call to action', text: 'Primary: "Book an appointment to see Terra". Alternative: "Discover Terra" (product page).' },
      ],
      points: [
        'Instagram: the core platform, carrying messages 1–3 across all 12 weeks with the boutique-appointment call to action.',
        'TikTok: weeks 1–6 only, leading with message 1 plus a material-to-object reveal, aimed at the 25–35 audience.',
        'LinkedIn (quiet, milestone-led, for senior professionals) and YouTube (Shorts plus a longer craft film) were outside the brief, so they were flagged as proposals needing a decision and budget.',
        'Guardrail: an LV Pillow "up to 90%" material figure came from press coverage, so it must not be reused for Terra.',
      ],
    },
    {
      title: 'Key visuals and creative development',
      intro: 'The KV Concept Builder turned Messaging Hierarchy v2 into three concepts, described in words first:',
      cards: [
        { title: 'Held', items: ['Nothing to Explain, weeks 1–3', 'Ambassador in quiet monochrome tailoring holding the bag against a cream studio backdrop', 'No caption, no material claim'], output: 'Recommended master visual' },
        { title: 'Reassembled', items: ['The Art of Renewal, weeks 4–6 + TikTok', 'Panels of indigo denim drift and resolve into the finished bag'], output: 'Most shareable, but riskiest on claims and most expensive' },
        { title: 'Years', items: ['Made to Be Kept, weeks 7–12', 'The same bag at three moments in one Singapore day'], output: 'Ends on the appointment call to action' },
      ],
      points: [
        '"Held" was recommended because it carries no unverified material claim, so it can be approved fastest and costs the least.',
        'Claude also flagged problems to fix before production: a render showed a wrong "VERDELUXE" wordmark, the denim looked "reused" although the brief never said so, and the ambassador is a real person whose likeness must not be generated to imply endorsement.',
        'Images were then generated with Higgsfield (e.g. a desert-sunrise scene with an invented model), and ChatGPT and Higgsfield / Cinema Studio were used for further edits, Instagram formats and a three-shot animation concept.',
      ],
    },
    {
      title: 'Practical example: the Louis Vuitton Terra Instagram reveal',
      highlight: true,
      intro:
        'Fictional educational scenario: Terra and its campaign details are invented and not affiliated with or endorsed by Louis Vuitton. The final creative shown in class:',
      rows: [
        { label: 'Story — frame 1', text: '"Nothing to explain." (wide desert-dunes shot)' },
        { label: 'Story — frame 2', text: '"Terra. Louis Vuitton craft, since 1854." (close-up of the bag)' },
        { label: 'Story — frame 3', text: '"Discover Terra." (link sticker to the product page)' },
        { label: 'Feed post (4:5)', text: '"Nothing to explain. Terra, the new Louis Vuitton handbag. Designed and made with the craft the Maison has refined since 1854. Discover Terra at the link in bio." Plus hashtags and alt text describing the image.' },
        { label: 'Before posting', text: 'A slot for one approved material fact; the "since 1854" line taken from the brand guide; a paid-partnership disclosure if an ambassador fronts the post; and a check on whether an AI-image label is needed.' },
      ],
      points: [
        'The copy follows the hierarchy: object first, then craft, then a soft invitation — and no unverified environmental claim.',
        'It was pitched at Phase 2 (weeks 4–6, the reveal), with message 1 and at most one material fact.',
      ],
    },
    {
      title: 'Creative evaluation and human oversight',
      intro:
        'The Creative Review Scorer rated each execution against the brief, research and messaging, through three agency-style lenses labelled BBH, Ogilvy and McCann.',
      rows: [
        { label: 'Instagram Story — 5.7/10', text: 'BBH 5, Ogilvy 6, McCann 6. Strength: it follows the hierarchy and frame 2 proves the craft. Weakness: the desert-safari setting works against the research, and frames 1 and 3 are near-duplicates.' },
        { label: 'Instagram post — 4.3/10', text: 'BBH 4, Ogilvy 4, McCann 5. Strength: restrained caption, no environmental claim, alt text and a clear next step. Weakness: a generic luxury-in-the-desert image, so the Big Idea reads as a slogan; placeholders left in.' },
        { label: '"Hand on the clasp" — 6.7/10', text: 'BBH 6, Ogilvy 7, McCann 7. The best idea: fingertips on the leaf lock, the moment just before opening, carrying desire and anticipation with no claim or caption needed.' },
      ],
      points: [
        'The bag in the desert images did not match the Terra renders, making it hard to tell which product was being launched — the scorer\'s "one change": drop the desert-safari scene and use the "Held" concept.',
        'Claude declined to put a real ambassador\'s face onto a generated model, or to swap in a real LV product photo, because the result could pass as a genuine ad. Different tools have different guardrails, so rights, consent and brand risk remain the marketer\'s responsibility.',
        'AI moved the work fast, but people still set the brief, approved the strategy, checked every claim and judged the creative. The lecture closed by asking: "What does this tell you?"',
      ],
    },
  ],

  takeaways: [
    'An AI marketing team works best as a chain of specialists — Brief Writer, Brief Validator, Strategist, Designer, Copywriter, Reviewer — each with one job and one clear output.',
    'Turn each role into a reusable Claude skill inside one Project, so every step draws on the same brief, brand guide and research.',
    'Validate in a fresh chat: a reviewer with "fresh eyes" catches what the writer missed.',
    'Keep a human approval step between strategy and production, and save the approved strategy to the knowledge base.',
    'Strong strategy starts from a customer truth: for Terra, beauty is the reason to buy and verified materials are the permission.',
    'A messaging hierarchy (core promise → supporting messages → proof → call to action) keeps every platform on the same story.',
    'Never let AI invent facts: unverified claims stay marked [to verify] or [to confirm] until someone approves them.',
    'Score creative against the brief, then apply human judgement on brand fit, rights and consent before anything is published.',
  ],

  quiz: {
    title: 'AI Marketing Team Challenge',
    intro:
      'Twelve questions on the roles, workflow and the Louis Vuitton Terra case from Nick Goh\'s lecture. Every answer comes with an explanation.',
    questions: [
      {
        type: 'order',
        question: 'Put the handoff chain in the right order. Tap the steps from first to last.',
        items: [
          'Brief Writer drafts the brief',
          'Brief Validator reviews it in a new chat',
          'Strategist shapes the Big Idea',
          'You approve and save to the knowledge base',
          'Designer + Copywriter create visuals and messaging',
          'Reviewer checks brand voice',
        ],
        explanation:
          'Planning (writer → validator → strategist), then human approval, then production (designer + copywriter) and finally the reviewer.',
      },
      {
        type: 'choice',
        question: 'Why does the Brief Validator critique the brief in a new chat?',
        options: [
          'Because each chat can only hold one document',
          'To get "fresh eyes" that are not influenced by how the brief was written',
          'Because the Brief Writer skill deletes old chats',
          'To save money on the subscription',
        ],
        answer: 1,
        explanation:
          'The handoff chain describes this step as "New chat, fresh eyes". A clean context lets the validator judge the brief on its own merits.',
      },
      {
        type: 'choice',
        question: 'What is the Strategist\'s output?',
        options: ['A draft brief', 'Edits and sign-off', 'A Big Idea one-pager', 'Channel-by-channel copy'],
        answer: 2,
        explanation: 'The Strategist digests the validated brief, develops the Big Idea and delivers it as a one-pager.',
      },
      {
        type: 'choice',
        question: 'Which role builds the messaging hierarchy and adapts it per channel and platform?',
        options: ['Reviewer', 'Copywriter', 'Designer / Art Director', 'Brief Validator'],
        answer: 1,
        explanation: 'The Copywriter builds the messaging hierarchy, adapts it per channel and platform, and outputs channel-by-channel copy.',
      },
      {
        type: 'choice',
        question: 'How was the Marketing Brief Builder triggered in the demo?',
        options: [
          'By a scheduled task that read the latest "Marketing Brief" email and ran the skill',
          'By the Reviewer after sign-off',
          'Manually, by copying the brief into every chat',
          'By a post on Instagram',
        ],
        answer: 0,
        explanation:
          'A daily scheduled task found the latest email labelled "Marketing Brief", ran /marketing-brief-builder on it and saved the draft to the Project.',
      },
      {
        type: 'choice',
        question: 'After validation, which objective became the primary one for Terra?',
        options: [
          'Awareness: reach 1 million users',
          'Brand health: positive sentiment',
          'Consideration: boutique appointments and enquiries',
          'Engagement: saves and shares',
        ],
        answer: 2,
        explanation:
          'With only 1,000 bags at S$5,800, qualified interest matters more than raw volume, so consideration (boutique enquiries) became primary.',
      },
      {
        type: 'choice',
        question: 'What was the "hidden motivation truth" (hypothesis) behind Terra\'s target customer?',
        options: [
          'She wants the cheapest luxury bag available',
          'She wants a sustainable bag she can talk about',
          'She does not want a sustainable bag; she wants a bag she never has to justify',
          'She only buys bags that celebrities wear',
        ],
        answer: 2,
        explanation: 'Beauty is the reason to buy; verified materials are the permission.',
      },
      {
        type: 'choice',
        question: 'Why won\'t plant-based leather alone set Terra apart, and what can LV own instead?',
        options: [
          'Customers dislike plant-based leather; LV should own low prices',
          'Hermès and Gucci have already worked on it; LV can own craft, scarcity and proof',
          'It is too expensive; LV should own mass-market reach',
          'It is illegal in Singapore; LV should own celebrity endorsements',
        ],
        answer: 1,
        explanation: 'The research found competitors already use similar materials, so LV\'s advantage is craft, scarcity and proof, in that order.',
      },
      {
        type: 'choice',
        question: 'In the messaging hierarchy, how should Terra\'s material facts be used?',
        options: [
          'As the main headline of every ad',
          'Not at all',
          'One verified fact per asset, never as the headline',
          'As many facts as possible to look credible',
        ],
        answer: 2,
        explanation: 'Message 2 ("What is it made of, and can I trust that?") uses one verified fact per asset and never leads with it.',
      },
      {
        type: 'choice',
        question: 'Why was the "Held" key visual recommended as the master visual?',
        options: [
          'It was the most expensive and impressive',
          'It carries no unverified material claim, so it can be approved fastest and costs the least',
          'It featured the most products',
          'It was designed only for TikTok',
        ],
        answer: 1,
        explanation: '"Reassembled" was more shareable but riskier on claims and costlier; "Held" was the safest, quickest route to approval.',
      },
      {
        type: 'choice',
        question: 'Why did Claude decline to put the real brand ambassador\'s face onto the generated model?',
        options: [
          'The image file was too large',
          'It could create a realistic image of a real person who had not agreed, which could pass as a genuine ad',
          'Claude cannot work with images at all',
          'The brief asked for no people in the visuals',
        ],
        answer: 1,
        explanation:
          'Using a real person\'s likeness without consent risks implying a false endorsement. Human oversight covers rights and consent, not just quality.',
      },
      {
        type: 'choice',
        question: 'What did the Creative Review Scorer identify as the main weakness of the desert Instagram executions?',
        options: [
          'The captions were too long',
          'The desert-safari setting worked against the research, and the bag shown did not match Terra',
          'There were too many environmental claims',
          'The images were black and white',
        ],
        answer: 1,
        explanation:
          'The Story scored 5.7/10 and the post 4.3/10. The scorer\'s one change was to drop the desert scene and use the "Held" concept; the "Hand on the clasp" image scored higher at 6.7/10.',
      },
    ],
  },
}
