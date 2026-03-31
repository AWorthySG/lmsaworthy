# A Worthy LMS — Handoff Document for Manus.AI

> Last updated: March 31, 2026
> Live at: https://lms.a-worthy.com

---

## Quick Start

```bash
cd /Users/jeremy/lms-app
npm install
npm run dev        # Vite dev server at localhost:5173
npm run build      # Production build → dist/
npx vercel --prod  # Deploy to production (no git — direct CLI deploy)
```

---

## Project Structure

```
lms-app/
├── index.html          # Entry HTML — global CSS, fonts, animations, dark mode, PWA
├── src/
│   ├── main.jsx        # React root — BrowserRouter wraps App
│   ├── App.jsx          # Renders <LMS /> (single component)
│   ├── LMS.jsx          # THE ENTIRE APP — ~14,700 lines, single file
│   └── index.css        # Minimal (most CSS is inline or in index.html)
├── public/
│   ├── logo-aworthy.jpeg
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # Service worker v4
│   ├── favicon.svg
│   └── resources/       # Static resources
├── vercel.json          # SPA rewrite: all routes → index.html
├── vite.config.js       # Vite + React plugin, no special config
└── package.json
```

**Critical**: Everything is in `src/LMS.jsx`. There are no separate component files.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 19 | Hooks-only, no class components |
| Bundler | Vite 8 | Default config, ~3MB bundle |
| Routing | react-router-dom 7 | URL ↔ state.page bidirectional sync |
| Auth | Firebase Auth | Email/password, tutor/student roles |
| Database | Firebase Realtime DB | User profiles, attendance (some features use localStorage) |
| Storage | Firebase Storage | Homework file uploads |
| State | useReducer | Single `lmsReducer` with ~30 action types |
| Persistence | localStorage | Wallet, bookmarks, goals, notes, etc. via `PERSIST_KEYS` |
| Animations | framer-motion + CSS | Page transitions, card stagger, celebrations |
| Icons | @phosphor-icons/react | Primary icon set |
| 3D | three.js | Whiteboard feature |
| PDF | pdfjs-dist | PDF viewer for resources |
| DOCX | mammoth | DOCX to HTML conversion |
| Charts | recharts | Analytics charts |
| Images | html2canvas-pro | Shareable progress card PNG generation |
| Deploy | Vercel CLI | No git — `npx vercel --prod` from project root |

---

## Architecture (LMS.jsx)

The file follows this top-to-bottom structure:

```
Lines 1-14       Imports
Lines 15-160     Firebase config, theme/color constants (T object)
Lines 160-340    Illustrations, helpers, data constants
Lines 340-700    Initial data (resources, students, homework, quizzes, etc.)
Lines 700-920    lmsReducer (state management, ~30 action types)
Lines 920-1140   State persistence (localStorage), Toast system
Lines 1140-1370  Celebration overlay, confetti, shareable progress card
Lines 1370-1500  Timer hook, UI primitives (Card, Button, Badge, Progress)
Lines 1500-1920  Leaderboard, avatars, StudentDashboard, HeroScene3D
Lines 1920-2100  Tutor Dashboard
Lines 2100-2800  Content Library, Video Lessons, Quiz system
Lines 2800-3400  Progress Reports, Attendance
Lines 3400-3800  Community Board
Lines 3800-4700  GP Question Types data (GP1_QTYPES)
Lines 4700-5200  Info Pack Themes data (INFO_PACK_THEMES)
Lines 5200-6800  Interactive games (20 games, ~1600 lines)
Lines 6800-7200  detectQuestionType, Timed Essay Writer
Lines 7200-7400  Sidebar navigation structure
Lines 7400-8800  Essay Grader, Vocabulary Builder, Example Connector
Lines 8800-11200 More games (Externality City, Market Mogul, etc.)
Lines 11200-11600 Events & Prizes system
Lines 11600-12300 Homework system, submission UI
Lines 12300-12600 Daily Reward Modal
Lines 12600-13000 Login Screen, Auth logic
Lines 13000-13500 Analytics Dashboard, Parent View
Lines 13500-14000 Study Plan, Notes, Goals, Mistake Journal, etc.
Lines 14000-14100 URL ↔ Page sync (PAGE_TO_PATH, PATH_TO_PAGE)
Lines 14100-14500 Main LMS component (routing switch, sidebar, header)
Lines 14500-14727 Mobile nav, search, notifications
```

---

## State Management

Single `useReducer` with state shape:

```js
{
  page: "dashboard",        // Current page/route
  subPage: null,            // Sub-navigation
  role: "tutor",            // "tutor" | "student"
  resources: [...],         // Content library items
  videoLessons: [...],
  quizzes: [...],
  exams: [...],
  students: [...],          // Student profiles
  sessions: [...],          // Class sessions
  attendance: {},           // { sessionId: { studentId: status } }
  reports: [...],           // Progress reports
  bookmarks: [],
  toasts: [],               // Notification toasts
  posts: [...],             // Community board posts
  homework: [...],
  submissions: [...],
  wallet: {                 // Gamification
    coins: 0, streak: 0, lastClaim: null,
    totalClaimed: 0, history: []
  },
  peerEssays: [],
  peerReviews: [],
  studyLogs: [],
  notes: [],                // Personal notes
  ratings: {},
  announcement: null,       // Tutor banner
  goals: [],
  mistakes: [],             // Mistake journal
  revisionChecklist: {},    // { "subject-topic": true/false }
}
```

Persisted keys (to localStorage): `wallet, bookmarks, attendance, submissions, homework, role, peerEssays, peerReviews, studyLogs, notes, ratings, announcement, goals, mistakes, revisionChecklist`

---

## Brand Identity

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2D3A8C` | Buttons, links, active states |
| Gold | `#D4A254` | Achievement, coins, special moments |
| Navy | `#0F172A` | Dark backgrounds, hero sections, game HUDs |
| Background | `#F8F7F4` | Page background (warm off-white) |
| Text | `#1E1E2E` | Primary text |
| English | `#4F5BD5` | Subject accent |
| GP | `#0D9488` | Subject accent |
| H1 Econ | `#7C3AED` | Subject accent |
| H2 Econ | `#EA580C` | Subject accent |

Fonts: Plus Jakarta Sans (body), Bricolage Grotesque (headings), Fraunces (editorial/italic), JetBrains Mono (code/numbers)

The theme object `T` at the top of LMS.jsx contains all color tokens, border radii, shadows, gradients.

---

## Routing

Routes are defined in `PAGE_TO_PATH` (~line 14000):

```
dashboard → /
library → /library
videos → /videos
quizzes → /quizzes
homework → /homework
attendance → /attendance
progress → /progress
leaderboard → /leaderboard
community → /community
analytics → /analytics
parentview → /parent-view
notes → /notes
goals → /goals
mistakes → /mistake-journal
checklist → /revision-checklist
formulas → /formula-cards
modelessays → /model-essays
... (27+ routes total)
```

Page rendering happens in a switch statement (~line 14400).

---

## Key Patterns

### Adding a new page
1. Create the component function (e.g., `function MyNewPage({ state, dispatch })`)
2. Add entry to sidebar nav structure (~line 7200)
3. Add to `PAGE_TO_PATH` map (~line 14000)
4. Add `case "mypage": return <MyNewPage ... />` in the render switch (~line 14400)

### Triggering celebrations
```js
triggerCelebration("coins");   // Gold burst + confetti
triggerCelebration("streak");  // Purple burst + larger confetti
triggerCelebration("levelup"); // Green burst + confetti
```

### Adding toast notifications
```js
dispatch({ type: "ADD_TOAST", payload: { message: "Success!", variant: "success" } });
// variants: "success", "error", "info"
```

### Shareable progress card
`<ShareableProgressCard state={state} />` — renders a branded card with Preview/Download/Share buttons.

---

## Recently Removed (March 30, 2026)

- **Flashcards** — SM-2 spaced repetition with Info Pack themes. Functions `generateFlashcards()` and `FlashcardSystem()` deleted. Also removed: Flashcard Marathon event, quick actions entry, sidebar nav item, route mapping.
- **Essay Outline Builder** — Step-by-step GP essay planning. Function `EssayOutlineBuilder()` deleted. `detectQuestionType()` kept (shared with Timed Writer).

---

## Recently Added (March 31, 2026)

- **Celebration overlay** — Canvas confetti + CSS burst animations. Triggers on daily reward claim, quiz submit, peer review submit.
- **Shareable progress card** — html2canvas-pro generates branded PNG. Added to Student Dashboard, Analytics, Parent View.
- **Glassmorphism student dashboard** — Hero card with navy gradient, frosted-glass stat pills.

---

## What's NOT Done Yet (Priority Order)

1. **AI chatbot tutor** — Biggest competitive gap vs Geniebook. Needs API key setup.
2. **Lesson recording** — Live classroom needs WebRTC integration.
3. **Code splitting** — ~3MB bundle should be split by route (dynamic imports).
4. **File splitting** — 14,700-line LMS.jsx should be decomposed into components/pages/hooks folders.
5. **Canva Magic Design API** — Blocked at team level. For generating certificates, banners, social cards.

---

## Deployment

No git repository. Deploy directly:

```bash
cd /Users/jeremy/lms-app
npx vercel --prod
```

Vercel project ID: `prj_HeJFcEnUgQqlhC5MHKY44853FRIP`
Vercel org: `team_eU4Uk5HtOeWuJ8MtD7Io4Cbs`
Domain: `lms.a-worthy.com` (DNS via Cloudflare)

---

## Firebase Config

Firebase project: `aworthy-lms`
Config is hardcoded at the top of LMS.jsx (~line 15). Includes:
- Auth (email/password)
- Realtime Database (user profiles, attendance sync)
- Storage (homework file uploads)

---

## Subjects Taught

| Subject | Code | Level |
|---------|------|-------|
| O-Level English | `eng` | Secondary |
| H1 General Paper | `gp` | JC (A-Level) |
| H1 Economics | `h1econ` | JC (A-Level) |
| H2 Economics | `h2econ` | JC (A-Level) |

All content, games, quizzes, and exam papers are aligned to Singapore's Cambridge curriculum.
