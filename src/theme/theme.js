/* ━━━ A WORTHY DESIGN SYSTEM ━━━
   Studio × Salon — Spectral · Manrope · Libre Caslon Text · JetBrains Mono
   Warm cream paper · Forest green sidebar · Brass accent · Oxblood alert */

export const T = {
  // ── Surfaces ─────────────────────────────────────────────────────────────
  bg:          "#f1ebde",    // Studio cream paper
  bgSidebar:   "#1b2a23",    // Salon forest panel
  bgCard:      "#ece5d5",    // warm card surface
  bgMuted:     "#e7dfcf",    // deeper muted cream
  bgHover:     "#ddd5c5",    // hover on cream
  bgOverlay:   "rgba(15,23,42,0.5)",

  // ── Text ─────────────────────────────────────────────────────────────────
  text:        "#1d1916",    // Studio deep ink
  textSec:     "#5a5247",
  textTer:     "#9c9384",
  textInverse: "#f1ebde",

  // ── Accent (brass) ───────────────────────────────────────────────────────
  accent:      "#a07a2e",
  accentLight: "rgba(199,154,69,0.14)",
  accentMid:   "#c79a45",
  accentDark:  "#7a5520",
  accentText:  "#7a5520",

  // ── Gold (brass alias — for gamification) ────────────────────────────────
  gold:        "#a07a2e",
  goldLight:   "#f5ead5",
  goldDark:    "#7a5520",

  // ── Danger / oxblood ─────────────────────────────────────────────────────
  oxblood:     "#7a2418",    // Studio overdue/alert accent

  // ── Atmospheric helpers ───────────────────────────────────────────────────
  gradPrimary: "linear-gradient(135deg, #1b2a23, #2c4d3a)",
  gradGold:    "linear-gradient(135deg, #a07a2e, #c79a45)",
  gradNavy:    "#1b2a23",
  gradTeal:    "#E4F4F0",
  navy:        "#1b2a23",
  navyLight:   "#243830",
  navyMid:     "#2e4a3e",
  teal:        "#0D9488",

  // ── Sidebar dark tokens ───────────────────────────────────────────────────
  sidebarText:         "#e9e2ce",
  sidebarTextSoft:     "rgba(233,226,206,0.72)",
  sidebarTextFaint:    "#c79a45",
  sidebarBorder:       "rgba(233,226,206,0.12)",
  sidebarActive:       "rgba(199,154,69,0.16)",
  sidebarActiveText:   "#f6e9c8",
  sidebarActiveBorder: "#c79a45",
  sidebarHover:        "rgba(233,226,206,0.07)",
  sidebarMuted:        "rgba(233,226,206,0.04)",

  // ── Subject palette ───────────────────────────────────────────────────────
  eng:    { bg: "#e8edf8", text: "#2a4080", accent: "#3b5bb5" },
  h1econ: { bg: "#f0e8f8", text: "#5B21B6", accent: "#7C3AED" },
  h2econ: { bg: "#f8e8e6", text: "#7a2418", accent: "#a03020" },
  gp:     { bg: "#e4f0e8", text: "#2f5a38", accent: "#2f7a3e" },

  // ── Status ───────────────────────────────────────────────────────────────
  success:   "#16A34A",
  successBg: "#E8F8EE",
  warning:   "#9A5C04",
  warningBg: "#FEF8E8",
  danger:    "#7a2418",
  dangerBg:  "#fce8e5",

  // ── Borders ───────────────────────────────────────────────────────────────
  border:       "rgba(29,25,22,0.13)",
  borderHover:  "rgba(29,25,22,0.22)",
  borderFocus:  "#a07a2e",

  // ── Shadows (warm-tinted) ─────────────────────────────────────────────────
  shadow1:       "0 1px 3px rgba(29,25,22,0.05)",
  shadow2:       "0 3px 8px rgba(29,25,22,0.08)",
  shadow3:       "0 8px 24px rgba(29,25,22,0.12)",
  shadowAccent:  "0 3px 12px rgba(160,122,46,0.25)",

  // ── Radii ─────────────────────────────────────────────────────────────────
  r1: 6, r2: 10, r3: 14, r4: 18, r5: 24,

  // ── Fonts ─────────────────────────────────────────────────────────────────
  fontDisplay: "'Spectral', serif",
  fontBody:    "'Manrope', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",
  fontSerif:   "'Libre Caslon Text', serif",

  // ── Grade colours ─────────────────────────────────────────────────────────
  gradeS: "#a07a2e", gradeA: "#16A34A", gradeB: "#3b5bb5", gradeC: "#9A5C04", gradeD: "#7a2418",
};

export const SUBJ_THEME = { eng: T.eng, h1econ: T.h1econ, h2econ: T.h2econ, gp: T.gp };
