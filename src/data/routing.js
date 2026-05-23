import {
  House, Broadcast, Notebook, Target, BookOpen, ClipboardText,
  Books, VideoCamera, Scroll, BookmarkSimple,
  Sparkle, GraduationCap, Lightbulb, Hash,
  Confetti, Handshake,
  CalendarCheck, ChartLineUp, Eye, Medal, Gear,
} from '../icons/icons.jsx';

export const NAV = [
  { group: "Home", items: [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "classroom", label: "Live Classroom", icon: Broadcast, highlight: true },
    { id: "notes", label: "My Notes", icon: Notebook },
    { id: "mistakes", label: "Mistake Journal", icon: BookOpen },
    { id: "checklist", label: "Revision Checklist", icon: ClipboardText },
  ]},
  { group: "O-Level English", subject: "eng", items: [
    { id: "library-eng", label: "Resources", icon: Books },
    { id: "videos-eng", label: "Video Lessons", icon: VideoCamera },
    { id: "practice-eng", label: "Practice Drills", icon: Target },
    { id: "vocab", label: "Vocabulary", icon: Scroll },
    { id: "pastpapers-eng", label: "Past Papers", icon: Notebook },
    { id: "micro-eng", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "O-Level Mathematics", subject: "omath", items: [
    { id: "library-omath", label: "Resources", icon: Books },
    { id: "videos-omath", label: "Video Lessons", icon: VideoCamera },
    { id: "practice-omath", label: "Practice Drills", icon: Target },
    { id: "formulas-omath", label: "Formula Cards", icon: Hash },
    { id: "pastpapers-omath", label: "Past Papers", icon: Notebook },
    { id: "micro-omath", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "O-Level Add. Maths", subject: "amath", items: [
    { id: "library-amath", label: "Resources", icon: Books },
    { id: "videos-amath", label: "Video Lessons", icon: VideoCamera },
    { id: "practice-amath", label: "Practice Drills", icon: Target },
    { id: "formulas-amath", label: "Formula Cards", icon: Hash },
    { id: "pastpapers-amath", label: "Past Papers", icon: Notebook },
    { id: "micro-amath", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "H1 General Paper", subject: "gp", items: [
    { id: "infographics", label: "Infographics", icon: Sparkle },
    { id: "essaygrader", label: "Essay Grader", icon: GraduationCap },
    { id: "example-finder", label: "Example Finder", icon: Lightbulb },
    { id: "modelessays", label: "Model Essays", icon: GraduationCap },
    { id: "pastpapers-gp", label: "Past Papers", icon: Notebook },
  ]},
  { group: "H1 Economics", subject: "h1econ", items: [
    { id: "library-h1econ", label: "Resources", icon: Books },
    { id: "videos-h1econ", label: "Video Lessons", icon: VideoCamera },
    { id: "practice-h1econ", label: "Practice Drills", icon: Target },
    { id: "pastpapers-h1econ", label: "Past Papers", icon: Notebook },
    { id: "micro-h1econ", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "H2 Economics", subject: "h2econ", items: [
    { id: "library-h2econ", label: "Resources", icon: Books },
    { id: "videos-h2econ", label: "Video Lessons", icon: VideoCamera },
    { id: "formulas", label: "Formula Cards", icon: Hash },
    { id: "pastpapers-h2econ", label: "Past Papers", icon: Notebook },
    { id: "micro-h2econ", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "IB MYP Mathematics", subject: "ibmyp", items: [
    { id: "library-ibmyp", label: "Resources", icon: Books },
    { id: "videos-ibmyp", label: "Video Lessons", icon: VideoCamera },
    { id: "practice-ibmyp", label: "Practice Drills", icon: Target },
    { id: "formulas-ibmyp", label: "Formula Cards", icon: Hash },
    { id: "pastpapers-ibmyp", label: "Past Papers", icon: Notebook },
    { id: "micro-ibmyp", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "Engage", items: [
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
  dashboard: "/", library: "/library", videos: "/videos",
  attendance: "/attendance", progress: "/progress",
  community: "/community", classroom: "/classroom",
  infographics: "/infographics",
  "practice-eng": "/practice/eng", "practice-h1econ": "/practice/h1econ",
  vocab: "/vocab", "example-finder": "/example-finder", essaygrader: "/essay-grader",
  aimarker: "/ai-marker",
  homework: "/homework", pastpapers: "/past-papers", microlearning: "/microlearning",
  "pastpapers-eng": "/past-papers/eng", "pastpapers-gp": "/past-papers/gp",
  "pastpapers-h1econ": "/past-papers/h1econ", "pastpapers-h2econ": "/past-papers/h2econ",
  "pastpapers-omath": "/past-papers/omath", "pastpapers-amath": "/past-papers/amath",
  "pastpapers-ibmyp": "/past-papers/ibmyp",
  "practice-omath": "/practice/omath", "practice-amath": "/practice/amath",
  "practice-ibmyp": "/practice/ibmyp",
  "micro-eng": "/quick-lessons/eng",
  "micro-h1econ": "/quick-lessons/h1econ", "micro-h2econ": "/quick-lessons/h2econ",
  "micro-omath": "/quick-lessons/omath", "micro-amath": "/quick-lessons/amath",
  "micro-ibmyp": "/quick-lessons/ibmyp",
  "formulas-omath": "/formula-cards/omath", "formulas-amath": "/formula-cards/amath",
  "formulas-ibmyp": "/formula-cards/ibmyp",
  analytics: "/analytics", parentview: "/parent-view",
  notes: "/notes", modelessays: "/model-essays",
  mistakes: "/mistake-journal", checklist: "/revision-checklist",
  formulas: "/formula-cards",
  certificates: "/certificates",
  events: "/events",
  settings: "/settings",
  // Subject-suffixed IDs mapping to shared pages
  "library-eng": "/library", "library-h1econ": "/library", "library-h2econ": "/library",
  "library-omath": "/library", "library-amath": "/library", "library-ibmyp": "/library",
  "videos-eng": "/videos", "videos-h1econ": "/videos", "videos-h2econ": "/videos",
  "videos-omath": "/videos", "videos-amath": "/videos", "videos-ibmyp": "/videos",
};

// Auto-generate reverse mapping; for shared paths the base ID (without subject suffix) wins
const _autoPath = Object.fromEntries(Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k]));
// Override shared paths so they resolve to the unsuffixed base page ID
_autoPath["/library"] = "library";
_autoPath["/videos"] = "videos";
export const PATH_TO_PAGE = _autoPath;
