/* ━━━ A WORTHY DESIGN SYSTEM ━━━
   Bricolage Grotesque · Plus Jakarta Sans · JetBrains Mono
   Warm parchment surfaces · Terracotta accent · Deep editorial contrast */

export const T = {
  // Surfaces — warm off-white, not sterile
  bg: "#F8F7F4",
  bgSidebar: "#FDFCFA",
  bgCard: "#FFFFFF",
  bgMuted: "#F0EFF2",
  bgHover: "#E8E7EE",
  bgOverlay: "rgba(15,23,42,0.45)",
  // Text — deep charcoal with blue undertone (not pure black)
  text: "#1E1E2E",
  textSec: "#4B5563",
  textTer: "#64748B",
  textInverse: "#F8F7F4",
  // Accent — deep indigo (trust + aspiration)
  accent: "#2D3A8C",
  accentLight: "#EEF0FF",
  accentMid: "#4F5BD5",
  accentDark: "#1E2A6E",
  accentText: "#1E2A6E",
  // Gold — achievement, excellence, aspiration
  gold: "#D4A254",
  goldLight: "#FBF4E4",
  goldDark: "#A07830",
  // Atmospheric helpers
  gradPrimary: "linear-gradient(135deg, #2D3A8C, #4F5BD5)",
  gradGold: "linear-gradient(135deg, #D4A254, #E8C078)",
  gradNavy: "#0F172A",
  gradTeal: "#E4F4F0",
  navy: "#0F172A",
  navyLight: "#1E2A4A",
  navyMid: "#334155",
  teal: "#0D9488",
  // Subject palette — distinctive per subject
  eng:    { bg: "#EEF0FF", text: "#2D3A8C", accent: "#4F5BD5" },
  ipeng:  { bg: "#FBF4E4", text: "#8B6914", accent: "#D4A254" },
  h1econ: { bg: "#F0E8F8", text: "#5B21B6", accent: "#7C3AED" },
  h2econ: { bg: "#FEF2E8", text: "#C2410C", accent: "#EA580C" },
  gp:     { bg: "#E4F4F0", text: "#0F766E", accent: "#0D9488" },
  // Status — clear, decisive
  success: "#16A34A",
  successBg: "#E8F8EE",
  warning: "#D97706",
  warningBg: "#FEF8E8",
  danger: "#DC2626",
  dangerBg: "#FEF0F0",
  // Borders — cool-tinted, subtle
  border: "#E2E4EA",
  borderHover: "#C8CCD4",
  borderFocus: "#2D3A8C",
  // Shadows — cool-tinted, layered
  shadow1: "0 1px 3px rgba(15,23,42,0.04)",
  shadow2: "0 3px 8px rgba(15,23,42,0.07)",
  shadow3: "0 8px 24px rgba(15,23,42,0.10)",
  shadowAccent: "0 3px 12px rgba(45,58,140,0.25)",
  // Grade colors — centralized for consistency
  gradeS: "#D4A254", gradeA: "#16A34A", gradeB: "#2D3A8C", gradeC: "#D97706", gradeD: "#DC2626",
  // Radii — editorial with a touch of softness
  r1: 6, r2: 10, r3: 14, r4: 18, r5: 24,
};

export const SUBJ_THEME = { eng: T.eng, h1econ: T.h1econ, h2econ: T.h2econ, gp: T.gp };
