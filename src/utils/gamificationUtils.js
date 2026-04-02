import { LEVELS, BADGE_DEFS } from "../data/gamification.js";

export function calcStudentXP(student, state) {
  let xp = 0;
  (student.quizResults || []).forEach(r => {
    xp += r.score * 10;
    if (r.score === r.total) xp += 50; // perfect score bonus
  });
  Object.values(state.attendance || {}).forEach(rec => {
    if (rec[student.id] === "present") xp += 20;
    else if (rec[student.id] === "late") xp += 10;
  });
  xp += (student.materialsAccessed || []).length * 5;
  return xp;
}

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) { if (xp >= LEVELS[i].min) return LEVELS[i]; }
  return LEVELS[0];
}

export function getLevelProgress(xp) {
  const lv = getLevel(xp);
  if (lv.level === 5) return 100;
  return Math.round(((xp - lv.min) / (lv.max - lv.min + 1)) * 100);
}

export function getStudentBadges(student, state) {
  const xp = calcStudentXP(student, state);
  const badges = [];
  const def = (id) => BADGE_DEFS.find(b => b.id === id);
  if ((student.quizResults || []).length > 0) badges.push(def("first_quiz"));
  if ((student.quizResults || []).some(r => r.score === r.total)) badges.push(def("perfect_score"));
  if ((student.materialsAccessed || []).length >= 5) badges.push(def("bookworm"));
  const pcts = (student.quizResults || []).map(r => r.score / r.total);
  if (pcts.length >= 2 && pcts[pcts.length - 1] > pcts[pcts.length - 2]) badges.push(def("rising_star"));
  const presentCount = Object.values(state.attendance || {}).filter(rec => rec[student.id] === "present").length;
  if (presentCount >= 5) badges.push(def("on_fire"));
  if (xp >= 300) badges.push(def("scholar"));
  if (xp >= 600) badges.push(def("expert"));
  if (state.students && state.students.every(st => st.id === student.id || calcStudentXP(st, state) <= xp)) badges.push(def("top_performer"));
  return badges.filter(Boolean);
}
