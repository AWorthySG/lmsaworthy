import {
  House, Broadcast, Notebook, BookOpen, ClipboardText,
  Books, Scroll,
  GraduationCap, Lightbulb,
  Confetti, Handshake,
  CalendarCheck, ChartLineUp, Eye, Medal, Gear,
} from '../icons/icons.jsx';

export const NAV = [
  { group: "Overview", items: [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "classroom", label: "Live Classroom Whiteboard", icon: Broadcast, highlight: true },
  ]},
  { group: "O-Level English", subject: "eng", items: [
    { id: "library-eng", label: "Resources", icon: Books },
    { id: "vocab", label: "Vocabulary", icon: Scroll },
    { id: "pastpapers-eng", label: "Past Papers", icon: Notebook },
  ]},
  { group: "O-Level Mathematics", subject: "omath", items: [
    { id: "library-omath", label: "Resources", icon: Books },
    { id: "pastpapers-omath", label: "Past Papers", icon: Notebook },
  ]},
  { group: "O-Level Add. Maths", subject: "amath", items: [
    { id: "library-amath", label: "Resources", icon: Books },
    { id: "pastpapers-amath", label: "Past Papers", icon: Notebook },
  ]},
  { group: "H1 General Paper", subject: "gp", items: [
    { id: "example-finder", label: "Example Finder", icon: Lightbulb },
    { id: "modelessays", label: "Model Essays", icon: GraduationCap },
    { id: "pastpapers-gp", label: "Past Papers", icon: Notebook },
  ]},
  { group: "H1 Economics", subject: "h1econ", items: [
    { id: "library-h1econ", label: "Resources", icon: Books },
    { id: "pastpapers-h1econ", label: "Past Papers", icon: Notebook },
  ]},
  { group: "H2 Economics", subject: "h2econ", items: [
    { id: "library-h2econ", label: "Resources", icon: Books },
    { id: "pastpapers-h2econ", label: "Past Papers", icon: Notebook },
  ]},
  { group: "IB MYP Mathematics", subject: "ibmyp", items: [
    { id: "library-ibmyp", label: "Resources", icon: Books },
    { id: "pastpapers-ibmyp", label: "Past Papers", icon: Notebook },
  ]},
  { group: "My Work", items: [
    { id: "mistakes", label: "Mistake Journal", icon: BookOpen },
    { id: "checklist", label: "Revision Checklist", icon: ClipboardText },
    { id: "events", label: "Events & Prizes", icon: Confetti, highlight: true },
    { id: "community", label: "Community", icon: Handshake },
  ]},
  { group: "Manage", tutorOnly: true, items: [
    { id: "homework", label: "Homework", icon: ClipboardText },
    { id: "aimarker", label: "AI Marker", icon: GraduationCap, highlight: true },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "certificates", label: "Certificates", icon: Medal },
    { id: "progress", label: "Progress", icon: ChartLineUp },
    { id: "analytics", label: "Analytics", icon: ChartLineUp },
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
  analytics: "/analytics", parentview: "/parent-view",
  modelessays: "/model-essays",
  mistakes: "/mistake-journal", checklist: "/revision-checklist",
  certificates: "/certificates",
  events: "/events",
  settings: "/settings",
  // Subject-suffixed library IDs all map to the shared /library path
  "library-eng": "/library", "library-h1econ": "/library", "library-h2econ": "/library",
  "library-omath": "/library", "library-amath": "/library", "library-ibmyp": "/library",
};

// Auto-generate reverse mapping; /library resolves to unsuffixed base ID
const _autoPath = Object.fromEntries(Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k]));
_autoPath["/library"] = "library";
export const PATH_TO_PAGE = _autoPath;
