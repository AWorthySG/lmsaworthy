import {
  initialResources,
  initialVideoLessons,
  initialQuizzes,
  initialExams,
  initialStudents,
  initialSessions,
  initialAttendanceRecords,
  initialReports,
  initialPosts,
  initialHomework,
  initialSubmissions,
} from "../data/seedData.js";

export const DEFAULT_STATE = {
  page: "dashboard",
  subPage: null,
  role: "tutor",
  resources: initialResources,
  videoLessons: initialVideoLessons,
  quizzes: initialQuizzes,
  exams: initialExams,
  students: initialStudents,
  sessions: initialSessions,
  attendance: initialAttendanceRecords,
  reports: initialReports,
  bookmarks: [],
  toasts: [],
  posts: initialPosts,
  homework: initialHomework,
  submissions: initialSubmissions,
  wallet: { coins: 0, streak: 0, lastClaim: null, totalClaimed: 0, history: [] },
  peerEssays: [],
  peerReviews: [],
  studyLogs: [],
  notes: [],
  ratings: {},
  announcement: null,
  goals: [],
  mistakes: [],
  revisionChecklist: {},
};

// Persist key parts of state to localStorage
export const PERSIST_KEYS = [
  "wallet", "bookmarks", "attendance", "submissions", "homework", "role",
  "peerEssays", "peerReviews", "studyLogs", "notes", "ratings",
  "announcement", "goals", "mistakes", "revisionChecklist",
];

export function loadPersistedState() {
  try {
    const saved = localStorage.getItem("aworthy-lms-state");
    if (!saved) return DEFAULT_STATE;
    const parsed = JSON.parse(saved);
    // Merge persisted fields into default state (so new fields are always present)
    const merged = { ...DEFAULT_STATE };
    PERSIST_KEYS.forEach(k => { if (parsed[k] !== undefined) merged[k] = parsed[k]; });
    return merged;
  } catch { return DEFAULT_STATE; }
}

export function savePersistedState(state) {
  try {
    const toSave = {};
    PERSIST_KEYS.forEach(k => { toSave[k] = state[k]; });
    localStorage.setItem("aworthy-lms-state", JSON.stringify(toSave));
  } catch { /* quota exceeded — silently fail */ }
}

export const initialState = loadPersistedState();
