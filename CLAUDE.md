# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Worthy LMS — a single-page React 19 + Vite app for a Singapore tuition centre, deployed to Vercel at `lms.a-worthy.com` and wrapped via Capacitor for iOS/Android. Subjects: O-Level English (`eng`), O-Level Mathematics (`omath`), O-Level Additional Mathematics (`amath`), H1 General Paper (`gp`), H1 Economics (`h1econ`), H2 Economics (`h2econ`), IB MYP Mathematics (`ibmyp`).

`LMS.jsx` is ~600 lines (auth + shell + routing switch only); page components across `src/pages/`, all lazy-loaded. Pages, components, state, and data live in their own folders.

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
- `src/App.jsx` — wraps `<LMS />` in a `RootErrorBoundary` (catches top-level render failures with a safe fallback); `<LMS />` is the default export of `src/LMS.jsx`, named `LMSAuthWrapper`.
- `src/LMS.jsx` (~600 lines) — auth gate (Firebase `onAuthStateChanged`), then the main `LMS` component: sidebar, header, mobile bottom nav, global Cmd-K search, notification bell, toast container, offline indicator, and the `renderPage()` switch (wrapped in `<PageErrorBoundary>` + `<Suspense>`) that maps `state.page` → a lazy-loaded page component. Notifications and search results are memoized with `useMemo` with `Array.isArray` guards on all state arrays (Firebase can return indexed objects before sync normalises them). Mobile bottom nav uses `Confetti` icon for the Events tab. **Sidebar** is Bear-minimal: 232px open / 56px collapsed, `T.bgSidebar` (`#F2EFE8`) background, active items get a white card pill with a 2px rust accent left border, no dark panel. **No role-based access control** — all nav groups and pages are visible to every authenticated user.
- **Live Classroom** (`src/pages/Classroom.jsx`) — 44-line component that auto-opens `https://whiteboard.a-worthy.com` in a new tab on mount, with a fallback launch card if the popup is blocked. The built-in canvas whiteboard has been fully removed.
- **Dashboard** (`src/pages/Dashboard.jsx`) — always renders `TutorDashboard`. 2-column responsive layout (collapses to 1-col below 768px): `HeroBanner` (7 Subjects) + pending-submissions banner (shown when `state.submissions` has items with `status === 'submitted'`) + stat tiles (Resources, Active HW, Students, Sessions, Community — all using T-system colours, no hardcoded blues) + subject cards (show real resource count per subject via `state.resources.filter(r => r.subject === s.id).length`, navigate to subject-specific library) + quick actions (colours: T.omath, T.amath, T.success, T.gp). All cards draw from real `state` data.

### Code splitting
- All page components are loaded via `lazy()` from React — each page becomes its own chunk at build time.
- `renderPage()` is wrapped in `<Suspense fallback={...}>` for loading states.
- There is no role-based page gating — all routes are accessible to every authenticated user.

### State management
- One `useReducer` in `LMS.jsx`: `appReducer` (in `src/state/reducer.js`) with ~44 action types. State shape and initial values are in `src/state/persistence.js` (`DEFAULT_STATE`).
- `initialState` is rehydrated from `localStorage` key `aworthy-lms-state` on load. Only keys listed in `PERSIST_KEYS` are persisted: `bookmarks`, `attendance`, `submissions`, `homework`, `pastPaperDocs`, `studyLogs`, `notes`, `ratings`, `announcement`, `goals`, `mistakes`, `revisionChecklist`, `posts`, `reports`, `sessions`, `videoLessons`. Everything else re-seeds from `src/data/seedData.js` on every load.
- **`role` is NOT persisted** — it always comes from Firebase RTDB on login. However, `state.role` no longer gates any UI — all features are equally accessible to every authenticated user regardless of role.
- Adding a new persistent field requires adding it to both `DEFAULT_STATE` and `PERSIST_KEYS`.
- localStorage writes are debounced (300ms). Firebase sync (`src/hooks/useFirebaseSync.js`) is also debounced (2s) and uses a write guard to prevent read-write loops.
- `MERGE_FIREBASE_STATE` handles two cases: (1) if the current state key is an array and Firebase returned a plain indexed object (`{"0":…,"1":…}`), it reconstructs the proper JS array so callers can safely use `.find`/`.filter`; (2) if both the current state and Firebase value are plain objects (e.g. `attendance`), it does a one-level deep merge to avoid clobbering nested local changes.
- Pages receive `{ state, dispatch }` as props. There is no Context or external store.

### Routing (URL ↔ state.page two-way sync)
- `src/data/routing.js` is the source of truth for both sidebar nav (`NAV`) and the URL map (`PAGE_TO_PATH` / `PATH_TO_PAGE`).
- `LMS.jsx` has two effects: one reads `location.pathname` and dispatches `SET_PAGE`; the other watches `state.page` and calls `navigate(path)`. An `initializedRef` prevents the first render from racing.
- `renderPage()` in `LMS.jsx` is a `switch` on `state.page` returning the page component. Adding a page = (1) component file, (2) entry in `NAV`, (3) entry in `PAGE_TO_PATH`, (4) `case` in `renderPage()`, (5) lazy import at top of `LMS.jsx`.
- Subject-scoped page IDs use consistent suffixes: `library-eng`, `pastpapers-gp`, `library-h1econ`, etc. Shared library and past-papers pages have subject-suffixed NAV IDs that map to their respective route paths.
- URL slugs use hyphens: `/example-finder`, `/ai-marker`, `/past-papers/eng`, `/past-papers/gp`, `/past-papers/h1econ`, `/past-papers/h2econ`, `/past-papers/omath`, `/past-papers/amath`, `/past-papers/ibmyp`.
- **Removed routes** (do not re-add): `goals`, `timedwrite`, `notes`, `practice-gp`, `practice-h2econ`, `micro-gp`, `exams-h1econ`, `exams-h2econ`, all `micro-*` routes, `infographics`, `essaygrader`, and all subject-scoped `videos-*`, `practice-*`, `formulas-*` routes. The lazy imports for `VideoLessons`, `LiveInfographics`, `SubjectDrills`, `EssayGrader`, `NotesPage`, and `FormulaCards` have been fully removed from `LMS.jsx`, and their `renderPage()` cases are gone. Do not re-add them. Each subject nav group now only contains Resources (`library-*`) and Past Papers (`pastpapers-*`); English also has Vocabulary; GP has Example Finder and Model Essays.
- **Current active subject nav items per subject:** `eng` → Resources, Vocabulary, Past Papers; `omath`/`amath`/`h1econ`/`h2econ`/`ibmyp` → Resources, Past Papers; `gp` → Example Finder, Model Essays, Past Papers.

### Page / component layout
- `src/pages/*.jsx` — top-level pages mapped from the route switch.
- `src/pages/{homework,study,tools}/` — grouped feature folders.
  - `pages/tools/` contains both student tools (PomodoroTimer, VocabBuilder) and tutor tools (AIMarker, EssayGrader), plus the AI grading utilities (`extractText.js`, `gradeClient.js`, `rubrics.js`). `PracticeQuestions`, `SubjectDrills`, `EssayGrader`, `FormulaCards`, and `NotesPage` exist on disk but are no longer imported or routed.
- `src/components/ui/` — 19 design-system primitives (`Btn`, `Card`, `Badge`, `Progress`, `Input`, `Select`, `Textarea`, `StatCard`, `EmptyState`, `DocumentViewer`, `PageHeader`, `PageErrorBoundary`, `BackBtn`, `BackToTop`, `FileIcon`, `InstallPrompt`, `LoadingSkeleton`, `SimpleQRDisplay`, `SubjectIllustration`). Prefer these over ad-hoc markup. `Card` supports keyboard accessibility when `onClick` is provided. `DocumentViewer` has a focus trap for accessibility.
- `src/components/gamification/` — `StudentAvatar` component + avatar system. Exports: `AVATAR_ICONS` (8 icons: star, crown, lightning, brain, flame, trophy, sparkle, target), `AVATAR_COLORS` (8 palettes: coral, amber, forest, teal, violet, rose, rust, slate), `decodeAvatar(key)` (splits `"{iconKey}-{colorKey}"` composite), `AvatarDisplay` (renders icon+colour given an avatarKey), `AvatarPicker` (inline picker with icon grid + colour swatches + Save/Cancel). Default `StudentAvatar` resolves key via `avatarKey ?? (avatarMap && student?.id != null ? avatarMap[student.id] : null)`, falls back to warm-gradient initials. Avatar state: `state.myAvatar` (logged-in user's key, persisted) and `state.studentAvatars` (map of studentId→key, persisted). Actions: `SET_MY_AVATAR` (payload: key), `UPDATE_STUDENT_AVATAR` (payload: `{ studentId, avatar }`). Settings page has inline AvatarPicker for the logged-in user. ProgressTracker lets tutors click a student's avatar to open an inline AvatarPicker. Sidebar shows user's chosen avatar. Community, Attendance, ProgressTracker all pass `avatarMap={state.studentAvatars}` to StudentAvatar.
- `src/components/toast/` — `ToastContainer` listens to `state.toasts`; dispatch `{ type: "ADD_TOAST", payload: { message, variant } }` (`variant`: `success` | `error` | `info`).

### Data / config
- **Content Library** (`src/pages/ContentLibrary.jsx`) — sidebar folder tree (subjects → topics with resource counts) + main panel. Root view shows subject cards; subject view shows only topics that have resources (empty topics hidden); topic/search/filter view shows a flat resource grid. Features: type filter pills (All/PDF/Video/DOCX), sort toggle (Newest/A–Z), bookmark toggle, and delete button (`window.confirm()` before dispatching `DELETE_RESOURCE`). The `ResourceCard` inner component is shared across all grid views. Upload form adds resources via `ADD_RESOURCE`; no actual file is written to Firebase Storage from this form. All controls visible to every user (`isTutor = true`).
- `src/data/seedData.js` — all initial collections (resources, video lessons, exams, students, sessions, attendance, reports, posts, homework, submissions). Resource `fileUrl`s point to Firebase Storage download URLs.
- `src/data/{routing,subjects,gpQuestionTypes,infoPackThemes,microModules,practiceQuestions,essayData,vocabDrills,seedEvents}.js` — static content used by individual pages. `pastPapersData.js` exists but is no longer used — Past Papers is now a dynamic document folder.
- **Past Papers** (`src/pages/study/PastPapers.jsx`) — documents stored in `state.pastPaperDocs` (persisted), uploaded to Firebase Storage. Documents are grouped by **Year (descending) → School (ascending)**. Each document has `{ id, name, fileName, url, subject, fileType, year, school, uploadedAt, uploadedBy }`. Upload panel (visible to all users) captures Year (dropdown), School (datalist with SG school suggestions), optional paper label, and file. Existing docs without `year`/`school` fields appear under "Uncategorised". Year and school groups are collapsible (open by default).
- **Vocabulary** (`src/pages/tools/VocabBuilder.jsx`) — 43 words across 6 categories (Tone Words, Connotation, Discourse Markers, Literary Devices, Paraphrasing, Evaluative Language). Each word has `{ id, cat, pos, word, def, example, tip, options, correct, context, upgrade }`. Four modes: Browse (searchable word bank with expandable detail), Flashcards (flip animation + SM-2 SR rating), Synonym Quiz (MCQ with reveal), Upgrade Drill (weak → strong reveal). SR data persisted via `localStorage` key `aworthy-vocab-sr`. Category colour palette: each of the 6 categories has a distinct warm/cool accent — none use the forbidden blue palette.
- `src/theme/theme.js` — exports `T` (one global design-token object: colors, radii, shadows, gradients, font families, per-subject palette) and `SUBJ_THEME`. **Design aesthetic: Bear-minimal** — warm whites, soft `rgba` borders, content-first layout, no decorative chrome. Font tokens: `T.fontDisplay` / `T.fontBody` / `T.fontSerif` → `'Nunito', sans-serif` (weights 300–800, rounded and warm); `T.fontMono` → `'JetBrains Mono', monospace`. Key palette: `T.bg` `#FAFAF7` (warm white canvas), `T.bgSidebar` `#F2EFE8`, `T.bgCard` `#FFFFFF`, `T.accent` `#C0392B` (rust red), `T.text` `#1C1B19`, `T.textSec` `#6B6760`, `T.border` `rgba(28,27,25,0.08)`. Subject themes (each with `bg`, `text`, `accent`): `T.eng` (indigo), `T.omath` (teal), `T.amath` (amber-orange), `T.gp` (teal-green), `T.h1econ` (violet), `T.h2econ` (rust), `T.ibmyp` (forest-green). Styling is inline `style={{...}}` driven by `T`; there are no CSS-in-JS libraries or Tailwind. Subject themes are looked up via `T[subjectId]` or `getSubjectTheme(id)` from `src/utils/helpers.js`. Colors are WCAG AA compliant against the `T.bg` background.
- `src/icons/icons.jsx` — Phosphor icon wrappers used throughout. All UI indicators use these icons, not raw emojis. Add new icons here rather than importing `@phosphor-icons/react` directly in pages. Current exports include `SortAscending`, `CaretLeft`, `Trash`, `Check`, `Paperclip`, `Smiley`.
- `src/hooks/` — `useFirebaseSync.js` (bidirectional RTDB sync), `useWindowWidth.js` (responsive breakpoint), `useTimer.js` (countdown/stopwatch for timed features).
- `src/utils/` — `helpers.js` (subject themes, exam countdowns, daily challenges, word of the day, study plan generation), `notifications.js` (homework reminders), `spacedRepetition.js` (spaced repetition scheduling for revision).

### Firebase
- `src/config/firebase.js` initialises the `aworthy-lms` project (Auth, Realtime DB region `asia-southeast1`, Storage). **Config keys are hardcoded in source** — these are client SDK keys, not secrets, but treat them accordingly.
- `LMSAuthWrapper` in `LMS.jsx` is the auth gate: `undefined` → loading splash, `null` → `<LoginScreen />`, object → `<LMS authUser userProfile />`. User profile is fetched from RTDB at `users/{uid}` and falls back to `{ name, email, role: "student" }`.
- The `role` from RTDB (`"tutor"` | `"student"`) is stored in `state.role` on login (via `SET_ROLE`). It is used for display purposes only (e.g., sidebar label "Creator" vs "Student") and does **not** gate any UI. There is no role toggle button and no `tutorOnly` NAV filtering.
- `src/hooks/useFirebaseSync.js` — debounced bidirectional sync of PERSIST_KEYS to `users/{uid}/state` in RTDB. Uses a `writingRef` guard to prevent write-read feedback loops.

### Canva integration
- `api/canva.js` is a single Vercel serverless function (used by Certificates feature) that proxies Canva Connect OAuth + autofill + export, switched by `?action=` query (`auth-url`, `token`, `refresh`, `templates`, `template-fields`, `autofill`, `autofill-status`, `export`, `export-status`).
- OAuth flow uses HMAC-signed state tokens (signed with `CANVA_CLIENT_SECRET`) for CSRF protection. The state is verified server-side on token exchange.
- Requires env vars `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI` in Vercel.
- `src/config/canva.js` is the browser client — tokens are stored in `localStorage` under `canva_tokens` and auto-refreshed within 5 minutes of expiry. OAuth state is stored in `sessionStorage` during the redirect flow.

### AI Grading
- `api/grade.js` and `api/grade-essay.js` — Vercel serverless functions that proxy Anthropic API calls for AI-powered essay/homework grading. Require `ANTHROPIC_API_KEY` env var. CORS is restricted to an allowlist of trusted origins.
- `src/pages/tools/rubrics.js` — rubric definitions for different assignment types.
- `src/pages/tools/extractText.js` — extracts text from PDF/DOCX uploads for grading.
- `src/pages/tools/gradeClient.js` — browser client that calls the grading API functions.
- Used by `AIMarker.jsx` (standalone tool) and `TutorHomework.jsx` (inline grading in homework view). `Homework.jsx` always renders `TutorHomework` — no student/tutor split.

### API security
- `api/_lib/auth.js` — shared CORS utility (`applyCors`) used by all serverless functions. Origin allowlist restricts access to known domains.
- All API functions validate required parameters and return structured error responses without leaking stack traces.
- Firebase RTDB rules (`database.rules.json`) restrict reads/writes to authenticated users accessing their own data path.

### AI grading (Claude)
- **Server:** `api/grade.js` is a Vercel serverless function that calls the Anthropic Messages API (`https://api.anthropic.com/v1/messages`) with vision support. Body shape: `{ subject, topic, question, rubric, instructions, text, images: [{ mediaType, base64, label }] }`. Returns a structured `{ grade, overallPercent, summary, strengths[], improvements[], criteria[], report, model }`. Claude is prompted to emit a `<grade-json>…</grade-json>` header followed by a markdown report; the function tolerantly parses either tag-wrapped or bare JSON. Body size limit is set to 20mb on the route; default model is `claude-sonnet-4-6`.
- **Required env vars** in Vercel: `ANTHROPIC_API_KEY` (required). Optional: `ANTHROPIC_GRADING_MODEL` to override the default model. Without the key, the rest of the LMS still works; only the auto-grade buttons fail with a clear toast.
- **Client engine** lives in `src/pages/tools/`:
  - `rubrics.js` — pre-built rubrics keyed by `{subject}.{taskKey}` (e.g. `gp.essay`, `gp.saq`, `eng.comprehension`, `h2econ.essay`). `pickDefaultTask(subject, topic)` chooses the right task by inspecting the topic string; `rubricToText()` flattens a rubric to the human-readable text passed to Claude; `getDefaultRubricForHomework(subject, topic)` is the convenience wrapper used by the homework UI.
  - `extractText.js` — client-side submission extraction: `mammoth` for DOCX, `pdfjs-dist` for PDFs (renders first 8 pages to PNG via `canvas` if the PDF has no extractable text), and a canvas-based downscaler for photos (long edge 2048px, re-encoded as JPEG q0.85) so payloads stay under Vercel's request limit. `extractFromFile(File)` for local pickers; `extractFromUrl(url, name)` for Firebase Storage URLs already on a submission; `mergeExtractions([…])` combines several into one `{ text?, images?, warnings? }` payload.
  - `gradeClient.js` — thin POST wrapper around `/api/grade`.
- **Two surfaces consume the engine:**
  - **Homework auto-grade** — `TutorHomework.jsx` adds a rubric textarea to the create form (auto-fills via `getDefaultRubricForHomework` and is fully editable), a collapsible rubric editor on the detail view (dispatches `UPDATE_HOMEWORK_RUBRIC`), and an "Auto-grade" button (with `Sparkle` Phosphor icon) on each submitted item that fetches the student's files, extracts them, calls the grader, dispatches `SAVE_AI_GRADE`, and pre-fills the existing grading panel. The AI's draft is held in `submission.aiGrade` and never reaches `submission.grade` until the tutor hits "Save Grade" — tutor-in-the-loop by design.
  - **Standalone AI Marker** — `src/pages/tools/AIMarker.jsx` (route `aimarker` under the Manage nav) for ad-hoc submissions not tied to a homework. Drag-drop or pick files, optionally type a question, hit mark.
- **Reducer additions:** `ADD_HOMEWORK` now defaults a `rubric: ""` field and seeds `aiGrade: null` on each new submission. New actions: `SAVE_AI_GRADE`, `CLEAR_AI_GRADE`, `UPDATE_HOMEWORK_RUBRIC`. Persistence is unchanged — `homework` and `submissions` were already in `PERSIST_KEYS`, so the new sub-fields ride along automatically.
- **Sister repo:** `aworthysg/afk-mark-` is a standalone Vite + React app that ships the same `src/grading/` engine + `api/grade.js` function under a single-page UI. Use it as the reference when refactoring the engine — keep both copies in sync (no shared package yet).

### PWA / Capacitor
- `public/sw.js` (cache name `aworthy-lms-v7`, separate `aworthy-assets-v7` for hashed bundles) — cache-first for `/assets/*` (immutable hashed filenames), network-first with 5s timeout for everything else, SPA fallback to `/index.html` for navigation. Bump both cache names when you change shell assets.
- `public/manifest.json` + apple-touch icons in `index.html`. Background color matches `T.bg` (`#FAFAF7`).
- `capacitor.config.ts` points the native shell at the **live URL** (`https://lms.a-worthy.com`) rather than the bundled `dist/`. To ship a fully offline mobile app, remove the `server.url` and rebuild.
- The app shows toast notifications when going offline/online.

## Conventions

- **JavaScript + JSX only** (no TypeScript outside `capacitor.config.ts`). ESLint enforces `no-unused-vars` with an exception for identifiers starting with uppercase or underscore.
- **React 19 hooks only.** No class components.
- **No emojis in UI** — use Phosphor icon components from `src/icons/icons.jsx` for all indicators, buttons, and decorative elements.
- **Inline styles via `T`.** Don't introduce CSS modules, Tailwind, or styled-components — the codebase deliberately uses inline `style={{ ... }}` driven by tokens in `src/theme/theme.js`. Use `T.fontDisplay`, `T.fontBody`, `T.fontMono`, `T.fontSerif` for font families — never hardcode font-family strings. Global typography/animations are in the `<style>` block in `index.html` and the small `src/index.css`.
- **Never use old blue/purple palette** — the colours `#2D3A8C`, `#4F5BD5`, `#6366F1`, `#8B5CF6`, `#0F172A`, `#1E2A4A`, `#818CF8` have been fully purged. Accent is `T.accent` (`#C0392B` rust red). Dark hero banners use warm charcoal (`#1C1B19`→`#2A2927`) with a subtle rust glow, never dark navy.
- **Dark mode** is controlled via the Settings page toggle. It sets `html.dark` class; basic CSS overrides exist in `index.html` for body, scrollbar, glass-header, etc. The inline `T` tokens do not change for dark mode.
- **Accessibility** — icon-only buttons must have `aria-label` attributes. Modals must have `role="dialog"`, `aria-modal="true"`, and `aria-label`. Modals should implement focus traps (Tab/Shift+Tab cycling, Escape to close). Logo images need descriptive alt text. `Card` component has built-in keyboard support when clickable. Toggle switches should have `aria-describedby` linking to their description text. Minimum touch target is 44×44px for interactive elements.
- **Destructive actions** (delete note, delete goal, archive homework, clear AI grade, delete resource) must use `window.confirm()` before dispatching.
- **PageHeader** — use the `PageHeader` component from `src/components/ui` for consistent page titles. It accepts `title`, `subtitle`, and `action` props.
- **Mobile-first responsive.** `src/hooks/useWindowWidth.js` is used to switch layouts; the breakpoint is `< 768px`. On mobile, sidebar becomes a slide-over and the bottom nav bar appears.
- **No gamification** — the XP/coins/streak/leaderboard/badges/wallet system and all mini-games have been fully removed. `state.wallet` does not exist. Do not re-introduce gamification imports, game routes, celebration overlays, or wallet state references.
- **No quizzes, no peer review** — both systems have been fully removed from state, routing, and UI. Do not re-add quiz routes, `peerEssays`, or `peerReviews` state keys. `state.quizzes` does not exist and `student.quizResults` is always empty (legacy field) — always use `(state.quizzes || [])` null-guard if touching legacy student data. ProgressTracker student detail shows "Submission Trend" and "Submissions by Subject" bar charts using real submission data (not quiz data).
- **Removed nav sections** — Goals, Timed Writer, GP Practice Drills, GP Quick Lessons, H1/H2 Econ Mock Exams, H2 Econ Practice Drills are gone. Their component files may still exist on disk but are not imported or rendered anywhere. Do not dispatch `SET_PAGE` with any of these removed IDs.
- **`generateStudyPlan()`** in `src/utils/helpers.js` covers all 7 subjects and 5 activity types (Practice Drills, Example Review, Essay Practice, Video Lesson, Past Paper). No emoji in activity objects — icon rendering is handled by the calling component.
- **`SubjectIllustration`** (`src/components/ui/SubjectIllustration.jsx`) has SVG configs for all 7 subjects. Add a new config entry when adding a new subject; the fallback is `configs.eng`.
- **Announcement banner** in `LMS.jsx` uses warm charcoal gradient `#1C1B19 → #2A2927`, never dark navy. All icon-only buttons in the shell (`LMS.jsx`) have `aria-label` attributes.
- **Toasts**: `dispatch({ type: "ADD_TOAST", payload: { message, variant } })`.
- **Reducers** return new objects — never mutate state. All actions auto-assign incrementing IDs via `Math.max(...arr.map(x => x.id), 0) + 1`; follow the same pattern. Resource deletion uses `DELETE_RESOURCE` (dispatches `id` as payload); the pattern mirrors `DELETE_PAST_PAPER_DOC`.
- **Subjects** are identified by the codes `eng`, `omath`, `amath`, `gp`, `h1econ`, `h2econ`, `ibmyp` everywhere (in `NAV` groups, route slugs, theme keys, seed data, etc.). When adding subject-scoped features, mirror the existing fan-out pattern: route ID with subject suffix + sidebar NAV entry + `PAGE_TO_PATH` entry + `renderPage()` case. No new lazy imports are needed for subjects that reuse existing shared pages (ContentLibrary, PastPapers). VideoLessons, SubjectDrills, MicrolearningPage, and FormulaCards have been removed and must not be reused.
- **Performance** — wrap expensive computations (filtered lists, search results, badge counts) in `useMemo` with appropriate dependency arrays. All `useEffect` hooks must have correct dependency arrays — never omit dependencies or use empty `[]` unless the effect truly runs once.
- **Don't import heavy libraries** (three.js, recharts, etc.) unless actively used — they defeat tree-shaking when imported as `* as`.
- Do not commit secrets. Treat `node_modules`, `dist`, `android/app/build`, `ios/App/Pods`, `ios/App/build` as ignored.
