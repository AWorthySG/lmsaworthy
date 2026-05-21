# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Worthy LMS — a single-page React 19 + Vite app for a Singapore tuition centre, deployed to Vercel at `lms.a-worthy.com` and wrapped via Capacitor for iOS/Android. Subjects: O-Level English (`eng`), H1 General Paper (`gp`), H1 Economics (`h1econ`), H2 Economics (`h2econ`).

`LMS.jsx` is now ~620 lines (auth + shell + routing switch only); pages/components/state/data live in their own folders.

## Commands

```bash
npm run dev           # Vite dev server (localhost:5173)
npm run build         # Production build → dist/
npm run preview       # Preview the built dist/
npm run lint          # ESLint on **/*.{js,jsx}

# Capacitor (mobile wrapper — loads https://lms.a-worthy.com in a WebView)
npm run build:mobile  # vite build + npx cap sync
npm run cap:android   # build, sync, open Android Studio
npm run cap:ios       # build, sync, open Xcode

# Resource upload (one-off): re-uploads referenced files to Firebase Storage
# and rewrites fileUrl values in src — only used when adding new PDFs/DOCX.
node scripts/upload-resources.mjs
```

Deployment is via Vercel Git integration — pushing to `main` triggers automatic production deploy. `vercel.json` rewrites everything except `/api/*` and `/assets/*` to `index.html` (SPA). Domain: `lms.a-worthy.com`.

There is no test suite.

## Architecture

### Entry / shell
- `src/main.jsx` — React root, wraps `<App />` with `<BrowserRouter>`.
- `src/App.jsx` — renders `<LMS />` (default export of `src/LMS.jsx`, named `LMSAuthWrapper`).
- `src/LMS.jsx` (~620 lines) — auth gate (Firebase `onAuthStateChanged`), then the main `LMS` component: sidebar, header, mobile bottom nav, global Cmd-K search, notification bell, toast container, celebration overlay, offline indicator, and the `renderPage()` switch (wrapped in `<PageErrorBoundary>` + `<Suspense>`) that maps `state.page` → a lazy-loaded page component.

### Code splitting
- All page components are loaded via `React.lazy()` — each page becomes its own chunk at build time.
- `renderPage()` is wrapped in `<Suspense fallback={...}>` for loading states.
- Tutor-only pages (`aimarker`, `attendance`, `analytics`, `parentview`, `certificates`) are gated in `renderPage()` — students accessing these URLs are redirected to the dashboard.

### State management
- One `useReducer` in `LMS.jsx`: `appReducer` (in `src/state/reducer.js`) with ~35 action types. State shape and initial values are in `src/state/persistence.js` (`DEFAULT_STATE`).
- `initialState` is rehydrated from `localStorage` key `aworthy-lms-state` on load. Only keys listed in `PERSIST_KEYS` are persisted: `wallet`, `bookmarks`, `attendance`, `submissions`, `homework`, `peerEssays`, `peerReviews`, `studyLogs`, `notes`, `ratings`, `announcement`, `goals`, `mistakes`, `revisionChecklist`, `posts`, `reports`. Everything else re-seeds from `src/data/seedData.js` on every load.
- **`role` is NOT persisted** — it always comes from Firebase RTDB on login to prevent localStorage privilege escalation.
- Adding a new persistent field requires adding it to both `DEFAULT_STATE` and `PERSIST_KEYS`.
- localStorage writes are debounced (300ms). Firebase sync (`src/hooks/useFirebaseSync.js`) is also debounced (2s) and uses a write guard to prevent read-write loops.
- `MERGE_FIREBASE_STATE` does a one-level deep merge for object-typed keys (e.g., `attendance`) to prevent clobbering nested local changes.
- Pages receive `{ state, dispatch }` as props. There is no Context or external store.

### Routing (URL ↔ state.page two-way sync)
- `src/data/routing.js` is the source of truth for both sidebar nav (`NAV`) and the URL map (`PAGE_TO_PATH` / `PATH_TO_PAGE`).
- `LMS.jsx` has two effects: one reads `location.pathname` and dispatches `SET_PAGE`; the other watches `state.page` and calls `navigate(path)`. An `initializedRef` prevents the first render from racing.
- `renderPage()` in `LMS.jsx` is a `switch` on `state.page` returning the page component. Adding a page = (1) component file, (2) entry in `NAV`, (3) entry in `PAGE_TO_PATH`, (4) `case` in `renderPage()`, (5) lazy import at top of `LMS.jsx`.
- Subject-scoped page IDs use consistent suffixes: `practice-gp`, `practice-eng`, `games-h2econ`, `pastpapers-gp`, `micro-h1econ`, `library-eng`, `videos-h1econ`, `quizzes-h2econ`, `exams-h1econ`, etc. Shared pages (library, videos, quizzes, exams) have subject-suffixed NAV IDs that map to the same route path.
- URL slugs use hyphens: `/timed-writer`, `/essay-grader`, `/example-finder`, `/ai-marker`, `/past-papers`, `/peer-review`.

### Page / component layout
- `src/pages/*.jsx` — top-level pages mapped from the route switch.
- `src/pages/{games,homework,infographics,study,tools}/` — grouped feature folders.
  - `pages/games/{economics,english,gp}/` hold individual game components; the per-subject `GameHub` (`pages/games/GameHub.jsx`) reads `subject` prop and renders the right set.
  - `pages/tools/` contains both student tools (PomodoroTimer, VocabBuilder, PracticeQuestions) and tutor tools (AIMarker, EssayGrader), plus the AI grading utilities (`extractText.js`, `gradeClient.js`, `rubrics.js`).
- `src/components/ui/` — design-system primitives (`Btn`, `Card`, `Badge`, `Progress`, `Input`, `Select`, `Textarea`, `StatCard`, `EmptyState`, `DocumentViewer`, `PageHeader`, `PageErrorBoundary`, …). Prefer these over ad-hoc markup. `Card` supports keyboard accessibility when `onClick` is provided.
- `src/components/gamification/` — `CelebrationOverlay`, `ConfettiCanvas`, `BurstAnimation`, `DailyRewardModal`, `ShareableProgressCard`, `StreakCalendar`, `StudentAvatar`, `XPBar`, etc.
- `src/components/toast/` — `ToastContainer` listens to `state.toasts`; dispatch `{ type: "ADD_TOAST", payload: { message, variant } }` (`variant`: `success` | `error` | `info`).

### Data / config
- `src/data/seedData.js` — all initial collections (resources, video lessons, quizzes, exams, students, sessions, attendance, reports, posts, homework, submissions). Resource `fileUrl`s point to Firebase Storage download URLs.
- `src/data/{routing,subjects,gameData,gpQuestionTypes,infoPackThemes,microModules,pastPapersData,practiceQuestions,essayData,vocabDrills,gamification,seedEvents}.js` — static content used by individual pages.
- `src/theme/theme.js` — exports `T` (one global design-token object: colors, radii, shadows, gradients, per-subject palette) and `SUBJ_THEME`. Styling is inline `style={{...}}` driven by `T`; there are no CSS-in-JS libraries or Tailwind. Subject themes are looked up via `T[subjectId]` or `getSubjectTheme(id)` from `src/utils/helpers.js`. Colors are WCAG AA compliant against the `T.bg` background.
- `src/icons/icons.jsx` — Phosphor icon wrappers used throughout. All UI indicators use these icons, not raw emojis. Add new icons here rather than importing `@phosphor-icons/react` directly in pages. Iconify (`@iconify/react`) is used only for full-colour emoji in game content data.

### Firebase
- `src/config/firebase.js` initialises the `aworthy-lms` project (Auth, Realtime DB region `asia-southeast1`, Storage). **Config keys are hardcoded in source** — these are client SDK keys, not secrets, but treat them accordingly.
- `LMSAuthWrapper` in `LMS.jsx` is the auth gate: `undefined` → loading splash, `null` → `<LoginScreen />`, object → `<LMS authUser userProfile />`. User profile is fetched from RTDB at `users/{uid}` and falls back to `{ name, email, role: "student" }`.
- The `role` from RTDB (`"tutor"` | `"student"`) overrides state on login. Tutors can toggle the active view via the sidebar button (dispatches `SET_ROLE`); the `NAV` groups marked `tutorOnly: true` are filtered out for students.
- `src/hooks/useFirebaseSync.js` — debounced bidirectional sync of PERSIST_KEYS to `users/{uid}/state` in RTDB. Uses a `writingRef` guard to prevent write-read feedback loops.

### Canva integration
- `api/canva.js` is a single Vercel serverless function (used by Certificates feature) that proxies Canva Connect OAuth + autofill + export, switched by `?action=` query (`auth-url`, `token`, `refresh`, `templates`, `template-fields`, `autofill`, `autofill-status`, `export`, `export-status`).
- Requires env vars `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI` in Vercel.
- `src/config/canva.js` is the browser client — tokens are stored in `localStorage` under `canva_tokens` and auto-refreshed within 5 minutes of expiry.

### AI Grading
- `api/grade.js` and `api/grade-essay.js` — Vercel serverless functions that proxy Anthropic API calls for AI-powered essay/homework grading. Require `ANTHROPIC_API_KEY` env var.
- `src/pages/tools/rubrics.js` — rubric definitions for different assignment types.
- `src/pages/tools/extractText.js` — extracts text from PDF/DOCX uploads for grading.
- `src/pages/tools/gradeClient.js` — browser client that calls the grading API functions.
- Used by `AIMarker.jsx` (standalone tool) and `TutorHomework.jsx` (inline grading in homework view).

### PWA / Capacitor
- `public/sw.js` (cache name `aworthy-lms-v5`) — network-first strategy. Skips caching for `/assets/*` (hashed by Vite) and opaque cross-origin responses. Has offline fallback for hashed assets. Bump the cache name when you change shell assets.
- `public/manifest.json` + apple-touch icons in `index.html`. Background color matches `T.bg` (`#F8F7F4`).
- `capacitor.config.ts` points the native shell at the **live URL** (`https://lms.a-worthy.com`) rather than the bundled `dist/`. To ship a fully offline mobile app, remove the `server.url` and rebuild.
- The app shows toast notifications when going offline/online.

## Conventions

- **JavaScript + JSX only** (no TypeScript outside `capacitor.config.ts`). ESLint enforces `no-unused-vars` with an exception for identifiers starting with uppercase or underscore.
- **React 19 hooks only.** No class components.
- **No emojis in UI** — use Phosphor icon components from `src/icons/icons.jsx` for all indicators, buttons, and decorative elements. Game content data arrays may still contain emoji for item labels, grid visuals, etc.
- **Inline styles via `T`.** Don't introduce CSS modules, Tailwind, or styled-components — the codebase deliberately uses inline `style={{ ... }}` driven by tokens in `src/theme/theme.js`. Global typography/animations are in the `<style>` block in `index.html` and the small `src/index.css`.
- **Dark mode** is controlled via the Settings page toggle. It sets `html.dark` class; basic CSS overrides exist in `index.html` for body, scrollbar, glass-header, etc. The inline `T` tokens do not change for dark mode.
- **Accessibility** — icon-only buttons must have `aria-label` attributes. Modals should have `role="dialog"` and `aria-label`. Logo images need descriptive alt text. `Card` component has built-in keyboard support when clickable.
- **Destructive actions** (delete note, delete goal, archive homework, clear AI grade) must use `window.confirm()` before dispatching.
- **PageHeader** — use the `PageHeader` component from `src/components/ui` for consistent page titles. It accepts `title`, `subtitle`, and `action` props.
- **Mobile-first responsive.** `src/hooks/useWindowWidth.js` is used to switch layouts; the breakpoint is `< 768px`. On mobile, sidebar becomes a slide-over and the bottom nav bar appears.
- **Celebrations** are triggered by dispatching a DOM event: `window.dispatchEvent(new CustomEvent("aworthy-celebrate", { detail: { type: "coins" | "streak" | "levelup" } }))`. The shell listens and renders `<CelebrationOverlay>`.
- **Toasts**: `dispatch({ type: "ADD_TOAST", payload: { message, variant } })`.
- **Reducers** return new objects — never mutate state. All actions auto-assign incrementing IDs via `Math.max(...arr.map(x => x.id), 0) + 1`; follow the same pattern.
- **Subjects** are identified by the codes `eng`, `gp`, `h1econ`, `h2econ` everywhere (in `NAV` groups, route slugs, theme keys, seed data, etc.). When adding subject-scoped features, mirror the existing four-way fan-out (route id with subject suffix + sidebar entry + render case).
- **Don't import heavy libraries** (three.js, recharts, etc.) unless actively used — they defeat tree-shaking when imported as `* as`.
- Do not commit secrets. Treat `node_modules`, `dist`, `android/app/build`, `ios/App/Pods`, `ios/App/build` as ignored.
