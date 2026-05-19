import { getStreakReward } from "../data/gamification.js";

/* ━━━ REDUCER ━━━ */
export function appReducer(state, action) {
  switch (action.type) {
    case "SET_PAGE": return { ...state, page: action.payload, subPage: null };
    case "SET_ROLE": return { ...state, role: action.payload };
    case "SET_SUBPAGE": return { ...state, subPage: action.payload };
    case "ADD_RESOURCE": return { ...state, resources: [...state.resources, { ...action.payload, id: state.resources.length + 1, date: new Date().toISOString().split("T")[0] }] };
    case "TOGGLE_CHAPTER_COMPLETE": {
      const lessons = state.videoLessons.map((l) => l.id === action.payload.lessonId ? { ...l, chapters: l.chapters.map((ch) => ch.id === action.payload.chapterId ? { ...ch, completed: !ch.completed } : ch) } : l);
      return { ...state, videoLessons: lessons };
    }
    case "ADD_QUIZ": return { ...state, quizzes: [...state.quizzes, { ...action.payload, id: state.quizzes.length + 1 }] };
    case "MARK_ATTENDANCE": {
      const { sessionId, studentId, status } = action.payload;
      const prev = { ...(state.attendance[sessionId] || {}) };
      if (status === null) delete prev[studentId]; else prev[studentId] = status;
      return { ...state, attendance: { ...state.attendance, [sessionId]: prev } };
    }
    case "ADD_SESSION": {
      const id = Math.max(...state.sessions.map(s => s.id), 0) + 1;
      return { ...state, sessions: [...state.sessions, { ...action.payload, id }], attendance: { ...state.attendance, [id]: {} } };
    }
    case "UPDATE_SESSION_NOTES": {
      return { ...state, sessions: state.sessions.map(s => s.id === action.payload.id ? { ...s, notes: action.payload.notes } : s) };
    }
    case "TOGGLE_BOOKMARK": {
      const bookmarks = new Set(state.bookmarks);
      if (bookmarks.has(action.payload)) bookmarks.delete(action.payload); else bookmarks.add(action.payload);
      return { ...state, bookmarks: [...bookmarks] };
    }
    case "ADD_REPORT": {
      const id = Math.max(...state.reports.map(r => r.id), 0) + 1;
      return { ...state, reports: [...state.reports, { ...action.payload, id, createdAt: new Date().toISOString().split("T")[0], sharedWithParents: false }] };
    }
    case "UPDATE_REPORT": {
      return { ...state, reports: state.reports.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    }
    case "SHARE_REPORT": {
      return { ...state, reports: state.reports.map(r => r.id === action.payload ? { ...r, sharedWithParents: true } : r) };
    }
    case "UNSHARE_REPORT": {
      return { ...state, reports: state.reports.map(r => r.id === action.payload ? { ...r, sharedWithParents: false } : r) };
    }
    case "ADD_TOAST": return { ...state, toasts: [...state.toasts, { id: Date.now() + Math.random(), ...action.payload }] };
    case "REMOVE_TOAST": return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case "ADD_POST": {
      const id = Math.max(...(state.posts || []).map(p => p.id), 0) + 1;
      return { ...state, posts: [{ ...action.payload, id, createdAt: new Date().toISOString().split("T")[0], reactions: {}, comments: [] }, ...(state.posts || [])] };
    }
    case "ADD_COMMENT": {
      const { postId, comment } = action.payload;
      const posts = (state.posts || []).map(p => {
        if (p.id !== postId) return p;
        const maxId = Math.max(...p.comments.map(c => c.id), 0) + 1;
        return { ...p, comments: [...p.comments, { ...comment, id: maxId, createdAt: new Date().toISOString().split("T")[0] }] };
      });
      return { ...state, posts };
    }
    case "TOGGLE_REACTION": {
      const { postId, emoji } = action.payload;
      const posts = (state.posts || []).map(p => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions };
        const curr = reactions[emoji] || [];
        if (curr.includes(0)) {
          const next = curr.filter(id => id !== 0);
          if (next.length === 0) delete reactions[emoji]; else reactions[emoji] = next;
        } else { reactions[emoji] = [...curr, 0]; }
        return { ...p, reactions };
      });
      return { ...state, posts };
    }
    case "PIN_POST": {
      return { ...state, posts: (state.posts || []).map(p => p.id === action.payload ? { ...p, pinned: !p.pinned } : p) };
    }
    case "UPDATE_STUDENT_AVATAR": {
      const { studentId, avatar } = action.payload;
      return { ...state, students: state.students.map(s => s.id === studentId ? { ...s, avatar } : s) };
    }
    case "ADD_HOMEWORK": {
      const hw = action.payload;
      const id = Math.max(...state.homework.map(h => h.id), 0) + 1;
      const newHw = { ...hw, id, createdAt: new Date().toISOString().split("T")[0], status: "active" };
      const assignees = hw.assignedTo === "all" ? state.students.map(s => s.id) : hw.assignedTo;
      const subId = Math.max(...state.submissions.map(s => s.id), 0) + 1;
      const newSubs = assignees.map((sid, i) => ({ id: subId + i, homeworkId: id, studentId: sid, status: "not_started", submittedAt: null, studentNotes: "", grade: null, gradeComment: null, gradedAt: null }));
      return { ...state, homework: [...state.homework, newHw], submissions: [...state.submissions, ...newSubs] };
    }
    case "SUBMIT_HOMEWORK": {
      const { submissionId, studentNotes, fileUrls } = action.payload;
      return { ...state, submissions: state.submissions.map(s => s.id === submissionId ? { ...s, status: "submitted", submittedAt: new Date().toISOString().split("T")[0], studentNotes, fileUrls: fileUrls || s.fileUrls || [] } : s) };
    }
    case "SAVE_HOMEWORK_DRAFT": {
      const { submissionId, studentNotes, fileUrls } = action.payload;
      return { ...state, submissions: state.submissions.map(s => s.id === submissionId ? { ...s, status: "in_progress", studentNotes, fileUrls: fileUrls || s.fileUrls || [] } : s) };
    }
    case "GRADE_SUBMISSION": {
      const { submissionId, grade, gradeComment } = action.payload;
      return { ...state, submissions: state.submissions.map(s => s.id === submissionId ? { ...s, grade, gradeComment, gradedAt: new Date().toISOString().split("T")[0], status: "graded" } : s) };
    }
    case "ARCHIVE_HOMEWORK": {
      return { ...state, homework: state.homework.map(h => h.id === action.payload ? { ...h, status: "archived" } : h) };
    }
    case "ADD_PEER_REVIEW": {
      const { essayId, reviewerId, scores, feedback } = action.payload;
      const reviews = state.peerReviews || [];
      const id = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
      return { ...state, peerReviews: [...reviews, { id, essayId, reviewerId, scores, feedback, createdAt: new Date().toISOString().split("T")[0] }] };
    }
    case "SUBMIT_PEER_ESSAY": {
      const essays = state.peerEssays || [];
      const id = essays.length > 0 ? Math.max(...essays.map(e => e.id)) + 1 : 1;
      return { ...state, peerEssays: [...essays, { ...action.payload, id, createdAt: new Date().toISOString().split("T")[0], status: "pending" }] };
    }
    case "LOG_STUDY_TIME": {
      const logs = state.studyLogs || [];
      return { ...state, studyLogs: [...logs, { ...action.payload, timestamp: Date.now() }].slice(-200) };
    }
    case "ADD_NOTE": {
      const notes = state.notes || [];
      const id = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
      return { ...state, notes: [{ ...action.payload, id, createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0] }, ...notes] };
    }
    case "UPDATE_NOTE": {
      return { ...state, notes: (state.notes || []).map(n => n.id === action.payload.id ? { ...n, ...action.payload, updatedAt: new Date().toISOString().split("T")[0] } : n) };
    }
    case "DELETE_NOTE": {
      return { ...state, notes: (state.notes || []).filter(n => n.id !== action.payload) };
    }
    case "RATE_RESOURCE": {
      const ratings = state.ratings || {};
      return { ...state, ratings: { ...ratings, [action.payload.resourceId]: action.payload.rating } };
    }
    case "SET_ANNOUNCEMENT": {
      return { ...state, announcement: action.payload };
    }
    case "ADD_GOAL": {
      const goals = state.goals || [];
      const id = goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1;
      return { ...state, goals: [...goals, { ...action.payload, id, createdAt: new Date().toISOString().split("T")[0], completed: false }] };
    }
    case "TOGGLE_GOAL": {
      return { ...state, goals: (state.goals || []).map(g => g.id === action.payload ? { ...g, completed: !g.completed } : g) };
    }
    case "DELETE_GOAL": {
      return { ...state, goals: (state.goals || []).filter(g => g.id !== action.payload) };
    }
    case "ADD_MISTAKE": {
      const mistakes = state.mistakes || [];
      const id = mistakes.length > 0 ? Math.max(...mistakes.map(m => m.id)) + 1 : 1;
      return { ...state, mistakes: [...mistakes, { ...action.payload, id, date: new Date().toISOString().split("T")[0], reviewed: false }].slice(-100) };
    }
    case "TOGGLE_MISTAKE_REVIEWED": {
      return { ...state, mistakes: (state.mistakes || []).map(m => m.id === action.payload ? { ...m, reviewed: !m.reviewed } : m) };
    }
    case "TOGGLE_CHECKLIST_ITEM": {
      const checklist = state.revisionChecklist || {};
      const key = action.payload;
      return { ...state, revisionChecklist: { ...checklist, [key]: !checklist[key] } };
    }
    case "CLAIM_DAILY_REWARD": {
      const today = new Date().toISOString().split("T")[0];
      if (state.wallet.lastClaim === today) return state; // already claimed today
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const streakContinues = state.wallet.lastClaim === yesterday;
      const newStreak = streakContinues ? state.wallet.streak + 1 : 1;
      const reward = getStreakReward(newStreak);
      return {
        ...state,
        wallet: {
          coins: state.wallet.coins + reward.coins,
          streak: newStreak,
          lastClaim: today,
          totalClaimed: state.wallet.totalClaimed + 1,
          history: [...state.wallet.history, { date: today, coins: reward.coins, streak: newStreak }].slice(-30),
        },
      };
    }
    case "MERGE_FIREBASE_STATE": {
      return { ...state, ...action.payload };
    }
    default: return state;
  }
}
