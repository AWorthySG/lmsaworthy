import {
  House, Broadcast, Notebook, BookOpen, ClipboardText,
  Books, Scroll,
  GraduationCap, Lightbulb,
  Confetti, Handshake,
  CalendarCheck, CalendarBlank, ChartLineUp, Eye, Gear, Sparkle, FolderSimpleStar, Table,
} from '../icons/icons.jsx';

export const NAV = [
  { group: "Overview", items: [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "classroom", label: "Live Classroom Whiteboard", icon: Broadcast, highlight: true },
  ]},
  { group: "O-Level English", subject: "eng", items: [
    { id: "library-eng", label: "Resources", icon: Books },
    { id: "vocab", label: "Vocabulary", icon: Scroll },
    { id: "pastpapers-eng", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "O-Level Mathematics", subject: "omath", items: [
    { id: "library-omath", label: "Resources", icon: Books },
    { id: "pastpapers-omath", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "O-Level Add. Maths", subject: "amath", items: [
    { id: "library-amath", label: "Resources", icon: Books },
    { id: "pastpapers-amath", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "H1 General Paper", subject: "gp", items: [
    { id: "example-finder", label: "Example Finder", icon: Lightbulb },
    { id: "modelessays", label: "Model Essays", icon: GraduationCap },
    { id: "pastpapers-gp", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "H1 Economics", subject: "h1econ", items: [
    { id: "library-h1econ", label: "Resources", icon: Books },
    { id: "pastpapers-h1econ", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "H2 Economics", subject: "h2econ", items: [
    { id: "library-h2econ", label: "Resources", icon: Books },
    { id: "pastpapers-h2econ", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "IB MYP Mathematics", subject: "ibmyp", items: [
    { id: "library-ibmyp", label: "Resources", icon: Books },
    { id: "pastpapers-ibmyp", label: "Practice Papers", icon: Notebook },
  ]},
  { group: "My Work", items: [
    { id: "homework", label: "Homework", icon: ClipboardText },
    { id: "calendar", label: "Calendar", icon: CalendarBlank },
    { id: "aifeedback", label: "AI Feedback", icon: Sparkle, highlight: true },
  ]},
  { group: "Revision", items: [
    { id: "revisiontimetable", label: "Revision Timetable", icon: Table },
    { id: "checklist", label: "Revision Checklist", icon: ClipboardText },
    { id: "mistakes", label: "Mistake Journal", icon: BookOpen },
    { id: "collections", label: "Collections", icon: FolderSimpleStar },
  ]},
  { group: "Community", items: [
    { id: "community", label: "Community", icon: Handshake },
    { id: "events", label: "Events & Prizes", icon: Confetti, highlight: true },
  ]},
  // Tutor-only admin tools. `tutorOnly` hides the whole group from A-Worthlings
  // (students) in the sidebar and global search; routes still render if reached
  // directly (soft gate, not a hard block).
  { group: "Manage", tutorOnly: true, items: [
    { id: "aimarker", label: "AI Marker", icon: GraduationCap, highlight: true },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "progress", label: "Progress", icon: ChartLineUp },
    { id: "parentview", label: "Parent View", icon: Eye },
  ]},
  { group: "System", items: [
    { id: "settings", label: "Settings", icon: Gear },
  ]},
];

export const PAGE_TO_PATH = {
  dashboard: "/",
  attendance: "/attendance", progress: "/progress",
  community: "/community", classroom: "/classroom",
  vocab: "/vocab", "example-finder": "/example-finder",
  aimarker: "/ai-marker",
  homework: "/homework",
  "pastpapers-eng": "/past-papers/eng", "pastpapers-gp": "/past-papers/gp",
  "pastpapers-h1econ": "/past-papers/h1econ", "pastpapers-h2econ": "/past-papers/h2econ",
  "pastpapers-omath": "/past-papers/omath", "pastpapers-amath": "/past-papers/amath",
  "pastpapers-ibmyp": "/past-papers/ibmyp",
  parentview: "/parent-view",
  modelessays: "/model-essays",
  calendar: "/calendar",
  aifeedback: "/ai-feedback",
  revisiontimetable: "/revision-timetable",
  mistakes: "/mistake-journal", checklist: "/revision-checklist",
  collections: "/collections",
  events: "/events",
  settings: "/settings",
  // Library: base path + one unique path per subject. Each subject needs its
  // own URL so the URL<->state round-trip preserves the subject (a shared
  // /library collapsed every subject back to the base id and bounced to "/").
  library: "/library",
  "library-eng": "/library/eng", "library-h1econ": "/library/h1econ", "library-h2econ": "/library/h2econ",
  "library-omath": "/library/omath", "library-amath": "/library/amath", "library-ibmyp": "/library/ibmyp",
};

// Auto-generate reverse mapping (paths are unique, so no manual override needed)
export const PATH_TO_PAGE = Object.fromEntries(Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k]));
