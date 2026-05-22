import {
  House, Broadcast, Notebook, Target, BookOpen, ClipboardText,
  Books, VideoCamera, Lightning, Scroll, BookmarkSimple,
  Sparkle, GraduationCap, Timer, Lightbulb, Hash,
  Confetti, PencilSimpleLine, Handshake,
  CalendarCheck, ChartLineUp, Eye, Scales, Medal, Gear,
} from '../icons/icons.jsx';

export const NAV = [
  { group: "Home", items: [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "classroom", label: "Live Classroom", icon: Broadcast, highlight: true },
    { id: "notes", label: "My Notes", icon: Notebook },
    { id: "goals", label: "Goals", icon: Target },
    { id: "mistakes", label: "Mistake Journal", icon: BookOpen },
    { id: "checklist", label: "Revision Checklist", icon: ClipboardText },
  ]},
  { group: "O-Level English", subject: "eng", items: [
    { id: "library-eng", label: "Resources", icon: Books },
    { id: "videos-eng", label: "Video Lessons", icon: VideoCamera },
    { id: "quizzes-eng", label: "Quizzes", icon: Lightning },
    { id: "practice-eng", label: "Practice Drills", icon: Target },
    { id: "vocab", label: "Vocabulary", icon: Scroll },
    { id: "pastpapers-eng", label: "Past Papers", icon: Notebook },
    { id: "micro-eng", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "H1 General Paper", subject: "gp", items: [
    { id: "infographics", label: "Infographics", icon: Sparkle },
    { id: "practice-gp", label: "Practice Drills", icon: Target },
    { id: "essaygrader", label: "Essay Grader", icon: GraduationCap },
    { id: "timedwrite", label: "Timed Writer", icon: Timer },
    { id: "example-finder", label: "Example Finder", icon: Lightbulb },
    { id: "modelessays", label: "Model Essays", icon: GraduationCap },
    { id: "pastpapers-gp", label: "Past Papers", icon: Notebook },
    { id: "micro-gp", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "H1 Economics", subject: "h1econ", items: [
    { id: "library-h1econ", label: "Resources", icon: Books },
    { id: "videos-h1econ", label: "Video Lessons", icon: VideoCamera },
    { id: "quizzes-h1econ", label: "Quizzes", icon: Lightning },
    { id: "practice-h1econ", label: "Practice Drills", icon: Target },
    { id: "exams-h1econ", label: "Mock Exams", icon: Scales },
    { id: "pastpapers-h1econ", label: "Past Papers", icon: Notebook },
    { id: "micro-h1econ", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "H2 Economics", subject: "h2econ", items: [
    { id: "library-h2econ", label: "Resources", icon: Books },
    { id: "videos-h2econ", label: "Video Lessons", icon: VideoCamera },
    { id: "quizzes-h2econ", label: "Quizzes", icon: Lightning },
    { id: "practice-h2econ", label: "Practice Drills", icon: Target },
    { id: "exams-h2econ", label: "Mock Exams", icon: Scales },
    { id: "formulas", label: "Formula Cards", icon: Hash },
    { id: "pastpapers-h2econ", label: "Past Papers", icon: Notebook },
    { id: "micro-h2econ", label: "Quick Lessons", icon: BookmarkSimple },
  ]},
  { group: "Engage", items: [
    { id: "events", label: "Events & Prizes", icon: Confetti, highlight: true },
    { id: "peerreview", label: "Peer Review", icon: PencilSimpleLine },
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
  dashboard: "/", library: "/library", videos: "/videos", quizzes: "/quizzes",
  exams: "/exams", attendance: "/attendance", progress: "/progress",
  community: "/community", classroom: "/classroom",
  infographics: "/infographics",
  "practice-gp": "/practice/gp", "practice-eng": "/practice/eng",
  "practice-h1econ": "/practice/h1econ", "practice-h2econ": "/practice/h2econ",
  timedwrite: "/timed-writer",
  vocab: "/vocab", "example-finder": "/example-finder", essaygrader: "/essay-grader",
  aimarker: "/ai-marker",
  homework: "/homework", pastpapers: "/past-papers", microlearning: "/microlearning",
  "pastpapers-eng": "/past-papers/eng", "pastpapers-gp": "/past-papers/gp",
  "pastpapers-h1econ": "/past-papers/h1econ", "pastpapers-h2econ": "/past-papers/h2econ",
  "micro-eng": "/quick-lessons/eng", "micro-gp": "/quick-lessons/gp",
  "micro-h1econ": "/quick-lessons/h1econ", "micro-h2econ": "/quick-lessons/h2econ",
  peerreview: "/peer-review", analytics: "/analytics", parentview: "/parent-view",
  notes: "/notes", modelessays: "/model-essays",
  goals: "/goals", mistakes: "/mistake-journal", checklist: "/revision-checklist",
  formulas: "/formula-cards",
  certificates: "/certificates",
  events: "/events",
  settings: "/settings",
  // Subject-suffixed IDs mapping to shared pages
  "library-eng": "/library", "library-h1econ": "/library", "library-h2econ": "/library",
  "videos-eng": "/videos", "videos-h1econ": "/videos", "videos-h2econ": "/videos",
  "quizzes-eng": "/quizzes", "quizzes-h1econ": "/quizzes", "quizzes-h2econ": "/quizzes",
  "exams-h1econ": "/exams", "exams-h2econ": "/exams",
};

// Auto-generate reverse mapping; for shared paths the base ID (without subject suffix) wins
const _autoPath = Object.fromEntries(Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k]));
// Override shared paths so they resolve to the unsuffixed base page ID
_autoPath["/library"] = "library";
_autoPath["/videos"] = "videos";
_autoPath["/quizzes"] = "quizzes";
_autoPath["/exams"] = "exams";
export const PATH_TO_PAGE = _autoPath;
