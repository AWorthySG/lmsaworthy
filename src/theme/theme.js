/* ━━━ A WORTHY DESIGN SYSTEM ━━━
   Bear-minimal — Geist · warm whites · soft borders · content-first */

export const T = {
  // ── Surfaces ─────────────────────────────────────────────────────────────
  // Neutral surface/text/border tokens are CSS variables (defined in index.html:
  // :root = light, html.dark = dark) so every inline style is theme-aware.
  // The var() fallback is the light value — light mode renders identically even
  // if the variables are missing. NEVER string-concatenate these tokens with an
  // alpha suffix (e.g. T.text + "18") — that only works on static hex tokens
  // like accent/success/danger and the subject palette.
  bg:        "var(--c-bg, #FAFAF7)",         // warm white main canvas
  bgSidebar: "var(--c-bg-sidebar, #F2EFE8)", // slightly warmer sidebar
  bgCard:    "var(--c-bg-card, #FFFFFF)",    // clean white cards
  bgMuted:   "var(--c-bg-muted, #F4F1EB)",   // muted fills
  bgHover:   "var(--c-bg-hover, #EDEAD3)",   // hover state
  bgOverlay: "rgba(28,27,25,0.4)",

  // ── Text ─────────────────────────────────────────────────────────────────
  text:        "var(--c-text, #1C1B19)",
  textSec:     "var(--c-text-sec, #6B6760)",
  textTer:     "var(--c-text-ter, #A09C94)",
  textInverse: "#FAFAF7",

  // ── Accent — warm rust (Bear-like) ───────────────────────────────────────
  accent:      "#C0392B",
  accentLight: "rgba(192,57,43,0.08)",
  accentMid:   "#E05040",
  accentDark:  "#962D22",
  accentText:  "#962D22",

  // ── Gold (achievements) ───────────────────────────────────────────────────
  gold:      "#B07D2A",
  goldLight: "var(--c-gold-light, #FBF3E2)",
  goldDark:  "#8A6020",

  // ── Helpers ───────────────────────────────────────────────────────────────
  gradPrimary: "linear-gradient(135deg, #1C1B19, #3a3835)",
  gradGold:    "linear-gradient(135deg, #B07D2A, #D4A254)",
  gradNavy:    "#1C1B19",
  gradTeal:    "#E6F4F1",
  navy:        "#1C1B19",
  navyLight:   "#2e2d2a",
  navyMid:     "#4a4845",
  teal:        "#0D9488",

  // ── Sidebar (follows the neutral variables so it themes with the shell) ───
  sidebarText:         "var(--c-text, #1C1B19)",
  sidebarTextSoft:     "var(--c-text-sec, #6B6760)",
  sidebarTextFaint:    "var(--c-text-ter, #A09C94)",
  sidebarBorder:       "var(--c-border, rgba(28,27,25,0.07))",
  sidebarActive:       "var(--c-bg-card, #FFFFFF)",
  sidebarActiveText:   "var(--c-text, #1C1B19)",
  sidebarActiveBorder: "#C0392B",
  sidebarHover:        "var(--c-sidebar-hover, rgba(28,27,25,0.04))",
  sidebarMuted:        "var(--c-sidebar-muted, rgba(28,27,25,0.03))",

  // ── Subject palette ───────────────────────────────────────────────────────
  eng:    { bg: "#EEF2FF", text: "#3730A3", accent: "#4338CA" },
  omath:  { bg: "#E0F7FA", text: "#00695C", accent: "#00897B" },
  amath:  { bg: "#FFF3E0", text: "#BF360C", accent: "#E64A19" },
  h1econ: { bg: "#F3EEFE", text: "#5B21B6", accent: "#7C3AED" },
  h2econ: { bg: "#FFF0EE", text: "#962D22", accent: "#C0392B" },
  gp:     { bg: "#EDFAF4", text: "#0F766E", accent: "#0D9488" },
  ibmyp:  { bg: "#E8F5E9", text: "#1B5E20", accent: "#2E7D32" },

  // ── Status (solid colours stay static — they read well on both modes and
  //    are alpha-concatenated in places; only the *Bg tints are theme-aware) ──
  success:   "#16A34A",
  successBg: "var(--c-success-bg, #EDFAF4)",
  warning:   "#9A5C04",
  warningBg: "var(--c-warning-bg, #FEF8E8)",
  danger:    "#C0392B",
  dangerBg:  "var(--c-danger-bg, #FFF0EE)",

  // ── Borders ───────────────────────────────────────────────────────────────
  border:      "var(--c-border, rgba(28,27,25,0.08))",
  borderHover: "var(--c-border-hover, rgba(28,27,25,0.16))",
  borderFocus: "#C0392B",

  // ── Shadows — very soft ────────────────────────────────────────────────────
  shadow1:      "0 1px 2px rgba(28,27,25,0.04)",
  shadow2:      "0 2px 8px rgba(28,27,25,0.06)",
  shadow3:      "0 4px 20px rgba(28,27,25,0.08)",
  shadowAccent: "0 2px 10px rgba(192,57,43,0.18)",

  // ── Radii ─────────────────────────────────────────────────────────────────
  r1: 6, r2: 8, r3: 12, r4: 16, r5: 20,

  // ── Fonts — Nunito (warm, rounded) ───────────────────────────────────────
  fontDisplay: "'Nunito', sans-serif",
  fontBody:    "'Nunito', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",
  fontSerif:   "'Nunito', sans-serif",

  // ── Grade colours ─────────────────────────────────────────────────────────
  gradeS: "#B07D2A", gradeA: "#16A34A", gradeB: "#3730A3", gradeC: "#9A5C04", gradeD: "#C0392B",
};

export const SUBJ_THEME = { eng: T.eng, omath: T.omath, amath: T.amath, h1econ: T.h1econ, h2econ: T.h2econ, gp: T.gp, ibmyp: T.ibmyp };
