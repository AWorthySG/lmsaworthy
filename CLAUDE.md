# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Worthy LMS — a single-page React 19 + Vite app for a Singapore tuition centre, deployed to Vercel at `lms.a-worthy.com` and wrapped via Capacitor for iOS/Android. Subjects: O-Level English (`eng`), H1 General Paper (`gp`), H1 Economics (`h1econ`), H2 Economics (`h2econ`).

> Note: `MANUS_HANDOFF.md` is **stale** — it describes a monolithic `src/LMS.jsx` (~14,700 lines). The codebase has since been refactored: `LMS.jsx` is now only the auth + shell + routing switch (~587 lines), and pages/components/state/data live in their own folders. `LMS_FEATURE_OVERVIEW.md` is a product-side feature description, not an architecture doc.

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

Deployment is via Vercel (project domain `lms.a-worthy.com`). `vercel.json` rewrites everything except `/api/*` and `/assets/*` to `index.html` (SPA).

There is no test suite.

## Architecture

### Entry / shell
- `src/main.jsx` — React root, wraps `<App />` with `<BrowserRouter>`.
- `src/App.jsx` — renders `<LMS />` (default export of `src/LMS.jsx`, named `LMSAuthWrapper`).
- `src/LMS.jsx` — auth gate (Firebase `onAuthStateChanged`), then the main `LMS` component, which is the shell: sidebar, header, mobile bottom nav, global Cmd-K search, notification bell, dark-mode toggle, toast container, celebration overlay, and the `renderPage()` switch that maps `state.page` → a page component.

### State management
- One `useReducer` in `LMS.jsx`: `appReducer` (in `src/state/reducer.js`) with ~35 action types. State shape and initial values are in `src/state/persistence.js` (`DEFAULT_STATE`).
- `initialState` is rehydrated from `localStorage` key `aworthy-lms-state` on load. Only keys listed in `PERSIST_KEYS` (`wallet`, `bookmarks`, `attendance`, `submissions`, `homework`, `role`, `peerEssays`, `peerReviews`, `studyLogs`, `notes`, `ratings`, `announcement`, `goals`, `mistakes`, `revisionChecklist`) are persisted — everything else (resources, video lessons, students, etc.) re-seeds from `src/data/seedData.js` on every load. Adding a new persistent field requires adding it to both `DEFAULT_STATE` and `PERSIST_KEYS`.
- Pages receive `{ state, dispatch }` as props. There is no Context or external store.

### Routing (URL ↔ state.page two-way sync)
- `src/data/routing.js` is the source of truth for both sidebar nav (`NAV`) and the URL map (`PAGE_TO_PATH` / `PATH_TO_PAGE`).
- `LMS.jsx` has two effects: one reads `location.pathname` and dispatches `SET_PAGE`; the other watches `state.page` and calls `navigate(path)`. An `initializedRef` prevents the first render from racing.
- `renderPage()` in `LMS.jsx` is a `switch` on `state.page` returning the page component. Adding a page = (1) component file, (2) entry in `NAV`, (3) entry in `PAGE_TO_PATH`, (4) `case` in `renderPage()`, (5) import at top of `LMS.jsx`.
- Several page IDs are subject-scoped variants (`practice-eng`, `games-h2econ`, `pastpapers-gp`, `micro-h1econ`, …) — they all render the same component with a `subject` / `defaultSubject` prop.

### Page / component layout
- `src/pages/*.jsx` — top-level pages mapped from the route switch.
- `src/pages/{games,homework,infographics,study,tools}/` — grouped feature folders.
  - `pages/games/{economics,english,gp}/` hold individual game components; the per-subject `GameHub` (`pages/games/GameHub.jsx`) reads `subject` prop and renders the right set.
- `src/components/ui/` — design-system primitives (`Btn`, `Card`, `Badge`, `Progress`, `Input`, `Select`, `Textarea`, `StatCard`, `EmptyState`, `DocumentViewer`, …). Prefer these over ad-hoc markup.
- `src/components/gamification/` — `CelebrationOverlay`, `ConfettiCanvas`, `BurstAnimation`, `DailyRewardModal`, `ShareableProgressCard`, `StreakCalendar`, `StudentAvatar`, etc.
- `src/components/toast/` — `ToastContainer` listens to `state.toasts`; dispatch `{ type: "ADD_TOAST", payload: { message, variant } }` (`variant`: `success` | `error` | `info`).

### Data / config
- `src/data/seedData.js` — all initial collections (resources, video lessons, quizzes, exams, students, sessions, attendance, reports, posts, homework, submissions). Resource `fileUrl`s point to Firebase Storage download URLs.
- `src/data/{routing,subjects,gameData,gpQuestionTypes,infoPackThemes,microModules,pastPapersData,practiceQuestions,essayData,vocabDrills,gamification,seedEvents}.js` — static content used by individual pages.
- `src/theme/theme.js` — exports `T` (one global design-token object: colors, radii, shadows, gradients, per-subject palette) and `SUBJ_THEME`. Styling is inline `style={{...}}` driven by `T`; there are no CSS-in-JS libraries or Tailwind. Subject themes are looked up via `T[subjectId]` or `getSubjectTheme(id)` from `src/utils/helpers.js`.
- `src/icons/icons.jsx` — Phosphor icon re-exports used throughout. Iconify (`@iconify/react`, fluent-emoji set) is used for full-colour emoji icons.

### Firebase
- `src/config/firebase.js` initialises the `aworthy-lms` project (Auth, Realtime DB region `asia-southeast1`, Storage). **Config keys are hardcoded in source** — these are client SDK keys, not secrets, but treat them accordingly.
- `LMSAuthWrapper` in `LMS.jsx` is the auth gate: `undefined` → loading splash, `null` → `<LoginScreen />`, object → `<LMS authUser userProfile />`. User profile is fetched from RTDB at `users/{uid}` and falls back to `{ name, email, role: "student" }`.
- The `role` from RTDB (`"tutor"` | `"student"`) overrides the persisted role on login. Tutors can toggle the active view via the sidebar button (dispatches `SET_ROLE`); the `NAV` groups marked `tutorOnly: true` are filtered out for students.

### Canva integration
- `api/canva.js` is a single Vercel serverless function (used by Certificates feature) that proxies Canva Connect OAuth + autofill + export, switched by `?action=` query (`auth-url`, `token`, `refresh`, `templates`, `template-fields`, `autofill`, `autofill-status`, `export`, `export-status`).
- Requires env vars `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI` in Vercel.
- `src/config/canva.js` is the browser client — tokens are stored in `localStorage` under `canva_tokens` and auto-refreshed within 5 minutes of expiry.

### AI grading (Claude)
- **Server:** `api/grade.js` is a Vercel serverless function that calls the Anthropic Messages API (`https://api.anthropic.com/v1/messages`) with vision support. Body shape: `{ subject, topic, question, rubric, instructions, text, images: [{ mediaType, base64, label }] }`. Returns a structured `{ grade, overallPercent, summary, strengths[], improvements[], criteria[], report, model }`. Claude is prompted to emit a `<grade-json>…</grade-json>` header followed by a markdown report; the function tolerantly parses either tag-wrapped or bare JSON. Body size limit is set to 20mb on the route; default model is `claude-sonnet-4-6`.
- **Required env vars** in Vercel: `ANTHROPIC_API_KEY` (required). Optional: `ANTHROPIC_GRADING_MODEL` to override the default model. Without the key, the rest of the LMS still works; only the auto-grade buttons fail with a clear toast.
- **Client engine** lives in `src/grading/`:
  - `rubrics.js` — pre-built rubrics keyed by `{subject}.{taskKey}` (e.g. `gp.essay`, `gp.saq`, `eng.comprehension`, `h2econ.essay`). `pickDefaultTask(subject, topic)` chooses the right task by inspecting the topic string; `rubricToText()` flattens a rubric to the human-readable text passed to Claude; `getDefaultRubricForHomework(subject, topic)` is the convenience wrapper used by the homework UI.
  - `extractText.js` — client-side submission extraction: `mammoth` for DOCX, `pdfjs-dist` for PDFs (renders first 8 pages to PNG via `canvas` if the PDF has no extractable text), and a canvas-based downscaler for photos (long edge 2048px, re-encoded as JPEG q0.85) so payloads stay under Vercel's request limit. `extractFromFile(File)` for local pickers; `extractFromUrl(url, name)` for Firebase Storage URLs already on a submission; `mergeExtractions([…])` combines several into one `{ text?, images?, warnings? }` payload.
  - `gradeClient.js` — thin POST wrapper around `/api/grade`.
- **Two surfaces consume the engine:**
  - **Homework auto-grade** — `TutorHomework.jsx` adds a rubric textarea to the create form (auto-fills via `getDefaultRubricForHomework` and is fully editable), a collapsible rubric editor on the detail view (dispatches `UPDATE_HOMEWORK_RUBRIC`), and an "✨ Auto-grade" button on each submitted item that fetches the student's files, extracts them, calls the grader, dispatches `SAVE_AI_GRADE`, and pre-fills the existing grading panel. The AI's draft is held in `submission.aiGrade` and never reaches `submission.grade` until the tutor hits "Save Grade" — tutor-in-the-loop by design.
  - **Standalone AI Marker** — `src/pages/tools/AIMarker.jsx` (route `aimarker` under the Manage nav) for ad-hoc submissions not tied to a homework. Drag-drop or pick files, optionally type a question, hit mark.
- **Reducer additions:** `ADD_HOMEWORK` now defaults a `rubric: ""` field and seeds `aiGrade: null` on each new submission. New actions: `SAVE_AI_GRADE`, `CLEAR_AI_GRADE`, `UPDATE_HOMEWORK_RUBRIC`. Persistence is unchanged — `homework` and `submissions` were already in `PERSIST_KEYS`, so the new sub-fields ride along automatically.
- **Sister repo:** `aworthysg/afk-mark-` is a standalone Vite + React app that ships the same `src/grading/` engine + `api/grade.js` function under a single-page UI. Use it as the reference when refactoring the engine — keep both copies in sync (no shared package yet).

### PWA / Capacitor
- `public/sw.js` (cache name `aworthy-lms-v4`) — network-first, never caches `/assets/*` (hashed). Bump the cache name when you change shell assets.
- `public/manifest.json` + apple-touch icons in `index.html`.
- `capacitor.config.ts` points the native shell at the **live URL** (`https://lms.a-worthy.com`) rather than the bundled `dist/`. To ship a fully offline mobile app, remove the `server.url` and rebuild.

## Conventions

- **JavaScript + JSX only** (no TypeScript outside `capacitor.config.ts`). ESLint enforces `no-unused-vars` with an exception for identifiers starting with uppercase or underscore (so unused PascalCase imports/types-via-jsdoc don't fail).
- **React 19 hooks only.** No class components.
- **Inline styles via `T`.** Don't introduce CSS modules, Tailwind, or styled-components — the codebase deliberately uses inline `style={{ ... }}` driven by tokens in `src/theme/theme.js`. Global typography/animations are in the `<style>` block in `index.html` and the small `src/index.css`.
- **Mobile-first responsive.** `src/hooks/useWindowWidth.js` is used to switch layouts; the breakpoint is `< 768px`. On mobile, sidebar becomes a slide-over and the bottom nav bar appears.
- **Celebrations** are triggered by dispatching a DOM event: `window.dispatchEvent(new CustomEvent("aworthy-celebrate", { detail: { type: "coins" | "streak" | "levelup" } }))`. The shell listens and renders `<CelebrationOverlay>`.
- **Toasts**: `dispatch({ type: "ADD_TOAST", payload: { message, variant } })`.
- **Reducers** return new objects — never mutate state. Many actions auto-assign incrementing IDs (`Math.max(...arr.map(x => x.id), 0) + 1`); follow the same pattern.
- **Subjects** are identified by the codes `eng`, `gp`, `h1econ`, `h2econ` everywhere (in `NAV` groups, route slugs, theme keys, seed data, etc.). When adding subject-scoped features, mirror the existing four-way fan-out (route id + sidebar entry + render case).
- **No git in past process** — the repo is now under git with branch-based development; do not commit secrets, and treat `node_modules`, `dist`, `android/app/build`, `ios/App/Pods`, `ios/App/build` as ignored.
