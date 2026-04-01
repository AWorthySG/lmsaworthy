# A Worthy LMS — Complete Feature Overview & Design Document

## About
A Worthy is a full-featured Learning Management System (LMS) built for a Singapore-based private tuition centre. It serves O-Level English, Integrated Programme (IP) English, H1 General Paper (GP), H1 Economics, and H2 Economics students. The entire application is a single-page React app (~10,000+ lines) deployed on Vercel at `lms.a-worthy.com`.

---

## 1. Authentication & User System

### Login/Register Screen
- Firebase Authentication (email/password)
- Branded login page with A Worthy logo, Sign In / Register tabs
- Students self-register with name, email, password → automatically assigned `role: student`
- Tutor account has `role: tutor` with full admin access
- User profiles stored in Firebase Realtime Database at `/users/{uid}`
- Auth state persists across page refreshes (Firebase session tokens)
- Sign Out button in sidebar

### Role-Based Access
- **Tutor view**: Full admin interface — homework creation/grading, attendance tracking, progress reports, student management, role toggle
- **Student view**: Focused dashboard — homework due dates, grades, streak calendar, quick actions, no admin sections
- Tutors can switch between views with a "Switch to Student/Tutor view" button
- "Manage" nav group (Homework, Attendance, Progress) hidden from students

---

## 2. Design System

### Visual Style
- Light, warm colour palette — off-white backgrounds (#F8F7F5), warm text tones (#1C1B19), coral accent (#D97042)
- Muted subject colours: English (blue), IP English (gold), GP (green), H1 Econ (purple), H2 Econ (coral)
- Inter font for body text, Poppins for headings, DM Mono for code/monospace
- Tight border radii (4/8/10/14/20px) — editorial, not bubbly
- Minimal shadows — barely-there depth, not floating cards
- Simple 1px borders (#EAE8E4) as primary container delineation
- No dark backgrounds anywhere (except video sidebar in Live Classroom)
- Iconify coloured icons (Fluent Emoji Flat set) — full-colour emoji-style icons throughout

### Animations
- Page transitions: fade + 8px rise on every page switch
- Staggered item entrance: sidebar items, card grids animate in sequence
- Subtle scale-in for modals and toasts
- Progress bar fill animations
- Button press: slight opacity dip
- No glow effects, no floating cards, no bouncy animations — restrained and purposeful

### Responsive Design
- Desktop: 240px sidebar + content area (max-width 1080px)
- Mobile (<768px): Sidebar becomes a slide-over overlay with hamburger button, sticky top bar with logo + notification bell
- Tablet: Intermediate layout with narrower sidebar

### Sidebar Navigation (Canvas/Linear pattern)
- Collapsible subject sections — collapsed by default, click to expand
- 3-tier hierarchy: Home → Subjects → Engage/Manage
- ~10-12 items visible before scrolling
- Subject headers with coloured dots matching subject theme
- Active item highlighted with accent tint
- Live Classroom has a pulsing green dot indicator
- Coin balance bar shows coins + streak
- User profile + sign out at bottom
- A Worthy logo at top

---

## 3. Dashboard

### Tutor Dashboard
- Hero section: Professional Unsplash classroom photo with Ken Burns slow-zoom animation (25s infinite alternate), warm overlay, bottom gradient for text readability
- Welcome message: "Welcome back, Creator J"
- Stats grid (3 columns): Resources count, Videos count, Quizzes count, Students count, Sessions count, Community posts count — each clickable to navigate
- Study Streak Calendar: GitHub-style heatmap showing last 12 weeks of login activity, coloured squares for active days, streak count with fire emoji
- Subject cards: Each subject with progress percentage and topic count
- Today's Classes: Cards showing scheduled sessions with subject badge, time, attendance status
- Leaderboard preview: Top 3 students with XP
- Activity feed: Recent milestones and actions

### Student Dashboard
- Coins + Streak counters (large cards)
- Study Streak Calendar (same heatmap)
- Homework Due: Active assignments with due dates, overdue warnings
- Recent Grades: Graded submissions with grade letter + tutor feedback preview
- Quick Actions: 6 large buttons — Practice Drills, Flashcards, Games, Infographics, Events, Community

---

## 4. Content Library

- Hierarchical folder navigation: All Subjects → Subject → Topic
- Breadcrumb navigation
- 150 resources (PDFs, DOCX, videos) across all subjects
- Resource cards show title, subject badge, topic, file type icon, date
- Search bar for filtering resources
- Upload resource button (tutor only)
- Document Viewer modal: PDF iframe preview, DOCX "Open in Google Docs" button, video embed, download button
- Bookmarking system

---

## 5. Video Lessons

- 4 video lessons with YouTube embeds
- Chapter-level progress tracking (checkboxes per chapter)
- Chapter list with duration and completion status
- Subject-filtered view

---

## 6. Quizzes

- Quiz creation: Title, subject, topic, time limit, question editor
- Question types: MCQ, short answer, structured questions
- Quiz taking: Timer, question navigation, auto-scoring for MCQ
- Results screen: Score, correct/incorrect breakdown, model answers
- XP awarded: 10 per correct answer, +50 bonus for perfect score

---

## 7. Mock Exams

- Full exam simulations with multiple sections
- Structured questions with model answers
- Timer with exam-length countdowns
- 2 pre-loaded exams (H2 Econ, GP)

---

## 8. Live Classroom & Whiteboard

### Session System
- **Create Session**: Tutor clicks button → generates 6-character code (e.g. ABC123)
- **Join Session**: Student enters the code → joins the same whiteboard room
- Session code displayed prominently in top bar with copy button
- **Cross-device real-time sync via Firebase Realtime Database**: Drawing strokes, cursor positions, and clear events sync across all connected devices anywhere in the world

### Whiteboard
- Cream moleskin paper background with dot grid
- Drawing tools: Pen, Highlighter, Eraser, Line, Rectangle, Circle, Pointer
- Colour palette: 10 preset colours + custom colour picker
- Stroke size slider (1-20px)
- Fill toggle for shapes
- Undo / Redo (40-step history via ImageData snapshots)
- Clear board (syncs across devices)
- Export as PNG
- **Upload files**: Images render on canvas with shadow border; PDFs render first page via PDF.js; DOCX renders text content via Mammoth.js
- Remote cursors: See other users' cursor positions with name labels

### Stylus / Apple Pencil Support
- Pointer Events API (not mouse/touch) — unified handler
- Pressure sensitivity: Non-linear curve (p^0.7) for natural pen feel
- Tilt support: Apple Pencil Pro tilt affects stroke width (0.8x-1.5x)
- Quadratic curve smoothing: Midpoint interpolation for silky strokes
- Coalesced events: getCoalescedEvents() for maximum point density
- Palm rejection: 3-layer system
  - `penEverDetected`: Once a stylus is detected, ALL touch events on canvas are permanently blocked
  - `penCurrentlyDown`: 500ms grace period after pen lifts to catch palm-after-lift
  - `onPointerEnter/Over`: Detects Apple Pencil at hover stage before touch
- CSS: `touch-action: none !important`, `-webkit-user-select: none`, `overscroll-behavior: none` on canvas and container
- touchStart/touchMove/touchEnd all call preventDefault + stopPropagation

### Video Call Panel
- Video sidebar (right side, Lessonspace-style layout)
- Host camera OFF by default, students cameras ON
- Meeting controls: Floating dark dock at bottom-right with mic, camera, screen share, end call buttons
- Responsive: Desktop = sidebar, Tablet = narrower sidebar, Mobile = horizontal strip at bottom
- Local video via getUserMedia, student tiles with avatar initials

---

## 9. Live Infographics (GP-specific)

### GP Paper 1 Essay Guide
- 6 question types with expandable detail panels: Direct Assertion, Extent/How Far, Comparison, Cause/Solution, Open Discussion, Evaluative Judgement
- Each type: trigger words, framework (TAS/CAF/CCF/FAF/EEP/CEV), paragraph structure, common mistakes, examiner rewards, sample thesis
- Two Master Structures side-by-side (Refutation vs Limitation)
- Concession vs Rebuttal rule
- Paragraph frameworks (PEEL, PEPEEL, PEELE) with letter-by-letter breakdowns
- Planning tools (SPECTRAM, TIPPS, CLAMS, IONG) as interactive cards
- Band descriptor jumps (3→4→5)
- 90-minute time management plan

### GP Paper 2 SAQ Guide
- Paper overview with animated progress bars
- 8 question types grouped by section (A, B1, B2, B3)
- Each question type: approach steps, templates, weak/strong example toggle
- Accordion layout

### Info Packs — Example Bank
- 45+ curated real-world examples across 11 syllabus themes
- Each example: region, year, detailed context (4-6 sentences), FOR/COUNTER arguments with sample topic sentences, cross-theme versatility tags
- Search bar filtering across all themes
- 11 themes: Science & Tech, Arts & Culture, Politics, Society, Environment, Economy, Media, Education, Health, Global Affairs, Ethics
- Singapore-focused examples throughout
- FOR arguments generate affirmative topic sentences; COUNTER arguments prefixed with "However, ..."

### Critical Reading Framework
- 6-step critical reading routine (expandable accordion)
- Discourse markers quick reference grid

---

## 10. Practice Drills

### GP Question Analysis Drill
- 25 real GP essay questions
- Timed drill (configurable: 5/10/15/25 questions, ~40s each)
- For each question: select Question Type, Master Structure, Framework
- Instant feedback with correct answer + explanation from GP1_QTYPES data
- Results screen with percentage, per-question breakdown

### Subject-Specific MCQ Drills
- **O-Level English**: 10 MCQs (comprehension, summary, narrative, argumentative, situational)
- **IP English**: 8 MCQs (enjambment, antithesis, discursive writing, caesura, narrative perspective, pathetic fallacy, salience, stream of consciousness)
- **H1 Economics**: 8 MCQs (demand curves, externalities, price ceilings, fiscal policy, merit goods, multiplier, inflation, public goods)
- **H2 Economics**: 8 MCQs (monopolistic competition, allocative efficiency, currency depreciation, EOS, J-curve, market structures, supply-side policies, current account)
- Each question has 4 options, topic tag, full explanation after answering
- Progress bar, score tracking, results screen with percentage

---

## 11. Flashcard System

- ~160 flashcards auto-generated from Info Packs data
- 4 card types per example: Name Arguments, Identify Themes, Name Example from Description, Counter-Arguments
- Leitner spaced repetition: Cards advance through Boxes 0→1→2→3 (mastered) with increasing review intervals (0, 1min, 5min, 30min)
- Theme filtering (study only specific themes)
- Per-theme mastery progress bars
- Session size selector (10/15/25/50 cards)
- Card flip interaction: tap to reveal, self-grade "Got It" / "Missed It"
- Session results with percentage

---

## 12. Essay Tools (GP-specific)

### Essay Outline Builder
- 4-step wizard: Question → Thesis → Body Paragraphs → Review & Export
- Auto-detection of question type by scanning for trigger words
- Guided paragraph slots auto-generated from question type's paraStructure
- Each paragraph: Topic Sentence input, Key Argument, Example, Evaluation (TIPPS/CLAMS)
- Live validation: missing thesis, short topic sentences, rebuttal in Limitation structure, missing degree qualifier for extent questions
- Copy outline to clipboard as formatted text

### Essay Grader
- Paste any GP essay for framework-based analysis
- Grades against 7 criteria: Thesis Clarity, Essay Structure, Evidence & Examples, Vocabulary, Counter-Argument, Topic Sentences, Word Count
- Each criterion scored /5 with progress bar and specific feedback
- Estimated Band (1-5) from total score
- Vocabulary detection: 20 tracked sophisticated terms
- Evidence marker detection: statistics, dates, "according to", etc.
- All analysis runs locally — instant results, no API needed

### Timed Essay Writer
- Simulated 90-minute GP Paper 1 exam
- 8 randomly generated questions — student picks 1
- Live countdown timer with phase indicator (Select → Plan → Write → Proofread)
- Planning notes area + full essay writing area
- Live word count (target 600-800)
- Band Descriptor self-assessment checklist on completion (7 items from Band 3 to Band 5)
- Copy essay to clipboard

### Example Connector
- Paste a GP question → auto-finds most relevant Info Pack examples
- Ranked by keyword relevance with score bar
- Auto-detects question type
- Each result expands: full detail, FOR/COUNTER arguments, versatility tags

---

## 13. Vocabulary Builder

- 20 vocabulary cards across 5 categories: Tone Words, Connotation, Discourse Markers, Literary Devices, Paraphrasing, Evaluative Phrases
- 2 drill modes:
  - **Synonym Match**: MCQ — pick the closest synonym for a word shown in context
  - **Upgrade Your Phrase**: See weak version → reveal strong upgrade
- Category filtering
- Score tracking, results screen

---

## 14. Interactive Games (15 games, 5 subjects)

### O-Level English (3 games)
- **Shrink Ray** (Summary Writing): Click redundant words to condense a paragraph. Combo system, floating particle effects (✂️/🔥/💥), screen shake on errors, 3 lives, victory/defeat screens with gradients
- **Debate Arena** (Argumentative Writing): Sort argument cards as FOR or AGAINST a claim. Tests Claim-Evidence-Reasoning thinking
- **Story Architect** (Narrative Writing): Place 6 scrambled scenes onto story arc positions (Exposition → Resolution)

### IP English (3 games)
- **Device Spotter** (Literary Analysis): Click phrases in a prose passage, identify the literary device from options (Metaphor, Simile, Personification, etc.)
- **Tone Painter** (Unseen Poetry): Paint poem lines with mood colours (blue=melancholy, red=anger, green=hope, gold=joy), submit to compare with model answer
- **Scene Breakdown** (Prose & Drama): Assign character motivations from a dramatic scene, reveals relationship dynamics

### H1 GP (3 games)
- **Headline Sifter** (Media): Classify 10 headlines as Reliable/Biased/Misleading/Satire. Newspaper-style cards, red flag markers, streak system, letter grades (S/A/B/C/D)
- **Policy Lab** (Politics): Manage 4 meters (Affordability, Sustainability, Approval, Budget) over 5 rounds by choosing policy levers with trade-off effects
- **Argument Mapper** (Science & Tech): Sort arguments for/against a technology claim

### H1 Economics (3 games)
- **Market Playground** (Market Mechanism): Price slider with live SVG demand-supply graph, animated buyers/sellers, equilibrium detection, random economic shocks
- **Externality City** (Market Failure): 3×3 city grid, place factories/schools/parks/housing within budget, balance GDP vs welfare
- **Policy Tug-of-War** (Fiscal & Monetary): Economy as a tug-of-war rope between recession and overheating, apply fiscal and monetary tools to centre it

### H2 Economics (4 games)
- **Shift & Solve** (Demand & Supply): 10 real-world scenarios, 3-step per scenario: which curve shifts → direction → predict price/quantity effects. 4 points per scenario, explanations, streak system
- **Elasticity Lab** (Elasticity): Choose products (necessity vs luxury), adjust price slider, watch quantity/revenue/PED change in real-time
- **Market Mogul** (Market Structures): Compare 4 structures side-by-side (PC, monopolistic, oligopoly, monopoly) — price, output, profit with bar chart
- **Trade Winds** (International Trade): Two countries with PPFs, adjust production sliders, enable trading to see consumption expand beyond PPF

### Game System Features
- Each game has a full instruction screen before gameplay (Objective, How to Play rules, Pro Tips, Scoring)
- "Rules" button accessible during gameplay
- Game Hub per subject with difficulty badges (Easy/Medium/Hard)
- "Coming soon" placeholder for unbuilt games

---

## 15. Homework System

- **Create Homework**: Title, subject, topic, due date, instructions textarea, assign to All Students or select specific students
- **Homework List**: Cards with subject badge, topic, due date, progress bar (graded/submitted/in-progress segments), overdue highlighting
- **Detail View**: Full instructions, submissions table per student with status badges (Not Started / In Progress / Submitted / Graded)
- **Inline Grading**: Click "Grade" on a submitted item → grade input + feedback textarea → save
- **Student Submission**: SUBMIT_HOMEWORK action for students to submit with notes
- Subject filtering
- Archive button for old homework
- 3 pre-loaded sample assignments with realistic seed data

---

## 16. Attendance

- Session scheduling: Date, subject, time, notes
- Attendance marking: Present (green) / Late (amber) / Absent (red) per student per session
- Attendance rate tracking
- Subject filtering
- Session notes editable

---

## 17. Progress & Analytics

- Student selector
- Stat cards: Quiz average, attendance rate, resources accessed
- Score Trend chart (Recharts LineChart)
- Average by Subject chart (Recharts BarChart)
- Detailed student progress reports with sharing to parents

---

## 18. Leaderboard & Gamification

### XP System
- 10 XP per correct quiz answer
- +50 XP bonus for perfect score
- 20 XP per session attended
- 10 XP for late attendance
- 5 XP per resource accessed
- 5 XP levels: Newcomer (0-99), Learner (100-299), Scholar (300-599), Expert (600-999), Champion (1000+)

### Badges (8 types)
- First Quiz, Perfect Score, Bookworm, Rising Star, On Fire, Scholar, Expert, Top Performer

### Leaderboard
- Podium display (top 3 with gradient backgrounds)
- Full rankings table
- Achievement badges gallery

### Daily Login Rewards
- 7-day reward cycle: Day 1 (10 coins) → Day 7 (75 coins + Streak Badge + 20 XP)
- Streak multiplier: Week 2 = 2x, Week 3+ = 3x (capped)
- Auto-popup modal on first visit each day
- 7-day progress tracker showing claimed/upcoming days
- Claim button with coin count
- Balance shown in sidebar coin bar

### Coins
- Earned through daily login rewards
- Displayed in sidebar and notification area
- Streak count with fire emoji

---

## 19. Events & Prizes

- 4 pre-loaded events: GP Essay Sprint Challenge, Flashcard Marathon, Practice Drills Speed Run, Vocabulary Challenge
- Event statuses: Live Now (pulsing green), Upcoming, Ended
- Hero banner with live/upcoming/prizes counts
- Event cards: emoji, title, status badge, days remaining, prize previews, participant count
- Detail view: Description, "How to Participate" instructions, prize breakdown with medal emojis, judging criteria checklist, participant leaderboard with scores, "Join This Event" button
- Real prizes: GrabFood vouchers, Popular vouchers + coins + badges

---

## 20. Community Forum

- Post creation: Text + optional subject tag
- Post pinning and announcement marking
- Comment threads
- 5 reaction types: 👍 🔥 ⭐ 💡 🤝
- Subject filtering and announcement filtering
- Activity feed
- Tutor announcements and student discussions

---

## 21. Notifications

- Bell icon in top-right of every page
- Count badge showing number of active notifications
- Dropdown lists: Active homework due dates, pending grading count (tutor only), daily reward availability
- Click notification to navigate to relevant page

---

## 22. Data Persistence

- localStorage saves: wallet (coins, streak, history), bookmarks, attendance records, homework submissions, role preference
- Survives browser refreshes
- Merges with defaults so new features always have initial data
- Firebase Realtime Database for: user profiles, whiteboard sessions, auth state

---

## 23. PWA (Progressive Web App)

- manifest.json with app name, icons, theme colour
- Service worker (sw.js) with network-first caching strategy
- Installable on phones/tablets:
  - iPhone: Safari → Share → "Add to Home Screen"
  - Android: Chrome → menu → "Install app"
- Standalone display mode (no browser chrome)
- Apple touch icon, theme colour for status bar

---

## 24. Technical Architecture

- **Frontend**: Single-file React app (LMS.jsx, ~10,000+ lines), Vite bundler
- **Styling**: Inline styles via React's `style` prop, design tokens in `T` object, CSS animations in index.html
- **State**: useReducer with 15+ action types, localStorage persistence
- **Icons**: @iconify/react with Fluent Emoji Flat (coloured) + Fluent (monochrome for toolbar)
- **Charts**: Recharts (LineChart, BarChart)
- **PDF rendering**: pdfjs-dist (PDF.js v5)
- **DOCX rendering**: mammoth.js
- **3D/Canvas**: Three.js (installed but currently unused — hero uses 2D canvas/photo)
- **Auth**: Firebase Authentication (email/password)
- **Realtime**: Firebase Realtime Database (whiteboard sync)
- **Deployment**: Vercel (static deploy, custom domain lms.a-worthy.com)
- **Domain**: lms.a-worthy.com (CNAME to Vercel via Cloudflare DNS)

---

## 25. Subjects & Topics

| Subject | Topics |
|---------|--------|
| O-Level English | Comprehension, Summary Writing, Narrative Writing, Argumentative Writing, Situational Writing |
| English (IP) | Literary Analysis, Unseen Poetry, Prose & Drama, Discursive Writing, Narrative & Reflective Writing, Visual Text & Multimodal Literacy |
| H1 Economics | Market Mechanism, Market Failure, Macroeconomic Aims, Fiscal & Monetary Policy |
| H2 Economics | Demand & Supply, Elasticity, Market Structures, International Trade, Balance of Payments, Economic Growth |
| H1 General Paper | Science & Technology, Environment, Arts & Culture, Politics & Governance, Media |

---

## 26. Seed Data

- 150 resources (PDFs, DOCX, videos with real file paths)
- 4 video lessons with chapters
- 3 quizzes (MCQ, short-answer, structured)
- 2 mock exams (H2 Econ, GP)
- 3 students (Sarah Chen, James Tan, Aisha Rahman) with subjects, quiz results, topic completion
- 6 progress reports
- 5 community posts with comments and reactions
- 10+ attendance sessions
- 3 homework assignments with 8 submissions
- 4 events with participants
- 16 avatar options
- 25 GP practice questions
- 10 English drills, 8 IP English drills, 8 H1 Econ drills, 8 H2 Econ drills
- 10 Headline Sifter headlines, 10 D&S scenarios, 20 vocabulary cards
- 45+ Info Pack examples across 11 themes

---

*Generated for A Worthy LMS — lms.a-worthy.com*
