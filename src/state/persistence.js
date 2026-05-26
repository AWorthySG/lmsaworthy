import {
  initialResources,
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
  exams: initialExams,
  pastPaperDocs: [],
  students: initialStudents,
  sessions: initialSessions,
  attendance: initialAttendanceRecords,
  reports: initialReports,
  bookmarks: [],
  toasts: [],
  posts: initialPosts,
  homework: initialHomework,
  submissions: initialSubmissions,
  studyLogs: [],
  announcement: null,
  mistakes: [],
  revisionChecklist: {},
  myAvatar: null,
  studentAvatars: {},
};

// Persist key parts of state to localStorage
export const PERSIST_KEYS = [
  "bookmarks", "attendance", "submissions", "homework",
  "pastPaperDocs", "studyLogs",
  "announcement", "mistakes", "revisionChecklist",
  "posts", "reports", "myAvatar", "studentAvatars", "students",
  "sessions",
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
