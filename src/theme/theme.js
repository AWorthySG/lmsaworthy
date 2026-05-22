/* ━━━ A WORTHY DESIGN SYSTEM ━━━
   Bear-minimal — Geist · warm whites · soft borders · content-first */

export const T = {
  // ── Surfaces ─────────────────────────────────────────────────────────────
  bg:        "#FAFAF7",   // warm white main canvas
  bgSidebar: "#F2EFE8",   // slightly warmer sidebar
  bgCard:    "#FFFFFF",   // clean white cards
  bgMuted:   "#F4F1EB",   // muted fills
  bgHover:   "#EDEAD3",   // hover state
  bgOverlay: "rgba(28,27,25,0.4)",

  // ── Text ─────────────────────────────────────────────────────────────────
  text:        "#1C1B19",
  textSec:     "#6B6760",
  textTer:     "#A09C94",
  textInverse: "#FAFAF7",

  // ── Accent — warm rust (Bear-like) ───────────────────────────────────────
  accent:      "#C0392B",
  accentLight: "rgba(192,57,43,0.08)",
  accentMid:   "#E05040",
  accentDark:  "#962D22",
  accentText:  "#962D22",

  // ── Gold (achievements) ───────────────────────────────────────────────────
  gold:      "#B07D2A",
  goldLight: "#FBF3E2",
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

  // ── Sidebar (shares light palette — no separate dark tokens needed) ───────
  sidebarText:         "#1C1B19",
  sidebarTextSoft:     "#6B6760",
  sidebarTextFaint:    "#A09C94",
  sidebarBorder:       "rgba(28,27,25,0.07)",
  sidebarActive:       "#FFFFFF",
  sidebarActiveText:   "#1C1B19",
  sidebarActiveBorder: "#C0392B",
  sidebarHover:        "rgba(28,27,25,0.04)",
  sidebarMuted:        "rgba(28,27,25,0.03)",

  // ── Subject palette ───────────────────────────────────────────────────────
  eng:    { bg: "#EEF2FF", text: "#2D3A8C", accent: "#4F5BD5" },
  h1econ: { bg: "#F3EEFE", text: "#5B21B6", accent: "#7C3AED" },
  h2econ: { bg: "#FFF0EE", text: "#962D22", accent: "#C0392B" },
  gp:     { bg: "#EDFAF4", text: "#0F766E", accent: "#0D9488" },

  // ── Status ───────────────────────────────────────────────────────────────
  success:   "#16A34A",
  successBg: "#EDFAF4",
  warning:   "#9A5C04",
  warningBg: "#FEF8E8",
  danger:    "#C0392B",
  dangerBg:  "#FFF0EE",

  // ── Borders ───────────────────────────────────────────────────────────────
  border:      "rgba(28,27,25,0.08)",
  borderHover: "rgba(28,27,25,0.16)",
  borderFocus: "#C0392B",

  // ── Shadows — very soft ────────────────────────────────────────────────────
  shadow1:      "0 1px 2px rgba(28,27,25,0.04)",
  shadow2:      "0 2px 8px rgba(28,27,25,0.06)",
  shadow3:      "0 4px 20px rgba(28,27,25,0.08)",
  shadowAccent: "0 2px 10px rgba(192,57,43,0.18)",

  // ── Radii ─────────────────────────────────────────────────────────────────
  r1: 6, r2: 8, r3: 12, r4: 16, r5: 20,

  // ── Fonts — Geist only ────────────────────────────────────────────────────
  fontDisplay: "'Geist', sans-serif",
  fontBody:    "'Geist', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",
  fontSerif:   "'Geist', sans-serif",

  // ── Grade colours ─────────────────────────────────────────────────────────
  gradeS: "#B07D2A", gradeA: "#16A34A", gradeB: "#2D3A8C", gradeC: "#9A5C04", gradeD: "#C0392B",
};

export const SUBJ_THEME = { eng: T.eng, h1econ: T.h1econ, h2econ: T.h2econ, gp: T.gp };
