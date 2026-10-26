# Session Lab — Digital Platforms (ESSEC)

A learning platform with one tab per guest speaker session: an interactive quiz/game, key takeaways, personal reflections and a progress tracker.

Built with **React + Vite**. No login, no database, no API keys — progress and reflections are saved in the visitor's own browser.

---

## Project structure

```
essec-learning-hub/
├── src/
│   ├── data/sessions.js        ← ALL session content lives here (edit this!)
│   ├── components/             ← reusable building blocks
│   │   ├── Navbar.jsx            top bar + session tabs
│   │   ├── Quiz.jsx              the quiz game (works for any session)
│   │   ├── SessionCard.jsx       cards on the homepage
│   │   ├── ProgressTracker.jsx   progress bar + steps
│   │   ├── ReflectionBox.jsx     auto-saving text box
│   │   └── Footer.jsx
│   ├── pages/                  ← one file per page
│   │   ├── Home.jsx
│   │   ├── SessionPage.jsx
│   │   ├── ReflectionsPage.jsx
│   │   └── NotFound.jsx
│   ├── state/ProgressContext.jsx  saves progress in the browser
│   ├── App.jsx                 decides which page shows for each address
│   ├── main.jsx                starts the app
│   └── index.css               all styles (colours/fonts at the top)
├── public/favicon.svg
├── index.html
├── vercel.json                 makes links like /session/session-2 work on Vercel
└── package.json                project name, scripts and libraries
```

## Adding a new session's content

Open `src/data/sessions.js`. The instructions are at the top of the file. In short:

1. Find the placeholder (e.g. `id: 'session-2'`).
2. Change `status: 'upcoming'` to `status: 'completed'`.
3. Replace the title, topic, speaker, date and summary.
4. Add `takeaways`.
5. Add a `quiz` by copying Session 1's format — or leave `quiz: null` to show a "Mark as complete" button.

To add a 7th session, copy a whole `{ ... }` block and give it a new `id`. The tab, card and page appear automatically.

## Running it on your computer

You need **Node.js** (LTS version) from https://nodejs.org. Then, in a terminal inside this folder:

```bash
npm install     # downloads the libraries (only needed once)
npm run dev     # starts a local preview at http://localhost:5173
```

Press `Ctrl + C` in the terminal to stop it.

---

## Publishing with GitHub + Vercel

You don't need Node.js or Git installed for this: Vercel builds the site for you in the cloud.

### Option A — no terminal (recommended for beginners)
1. Create a free account at https://github.com.
2. Click **+ → New repository**. Name it `essec-learning-hub`, keep it **Public**, leave every box unticked, then click **Create repository**.
3. On the next page, click the link **uploading an existing file**.
4. Open this project folder on your computer (the one containing `package.json`), select everything inside it (`Ctrl + A`), and drag it into the browser. Don't drag the outer folder itself: `package.json` must end up at the top level of the repository.
5. Wait until all files are listed, then click **Commit changes**.
6. Continue with **2. Deploy on Vercel** below.

To update the site later: open the file on github.com, click the ✏️ pencil icon, edit, and click **Commit changes**. Vercel redeploys automatically.

### Option B — with Git in a terminal
1. Create a free account at https://github.com.
2. Click **+ → New repository**. Name it `essec-learning-hub`, keep it **Public**, and **don't** tick "Add a README" (this project already has one). Click **Create repository**.
3. In a terminal inside this project folder, run the commands GitHub shows under "…or push an existing repository", which look like:

```bash
git remote add origin https://github.com/YOUR-USERNAME/essec-learning-hub.git
git branch -M main
git push -u origin main
```

- `git remote add origin …` tells Git where your online repository is.
- `git branch -M main` names your main branch "main".
- `git push -u origin main` uploads your commits to GitHub.

(If you prefer no terminal: install **GitHub Desktop**, choose *File → Add local repository*, select this folder, then *Publish repository*.)

### 2. Deploy on Vercel
1. Go to https://vercel.com and **Sign up with GitHub**.
2. Click **Add New → Project**, find `essec-learning-hub`, click **Import**.
3. Vercel detects **Vite** automatically. Leave all settings as they are and click **Deploy**.
4. After about a minute you get a public link like `https://essec-learning-hub.vercel.app` — share it with your professor.

### 3. Updating the site later (Option B)
Edit files, then:

```bash
git add .
git commit -m "Add Session 2 content"
git push
```

- `git add .` stages all your changed files.
- `git commit -m "…"` saves a snapshot with a message.
- `git push` uploads it — Vercel automatically redeploys within a minute.

## Notes
- Progress and reflections are stored per browser (localStorage). Use **Download my journal** on the Reflections page to keep a copy.
- The project contains no secrets. If you ever add an API key, put it in Vercel's *Settings → Environment Variables*, never in the code.
