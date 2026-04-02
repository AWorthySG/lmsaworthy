import { SUBJECTS } from "../data/subjects.js";
import { SUBJ_THEME, T } from "../theme/theme.js";

export function getSubject(id) { return SUBJECTS.find((s) => s.id === id); }
export function getSubjectTheme(id) { return SUBJ_THEME[id] || T.eng; }
export function formatDate(d) { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }

export function detectQuestionType(text, GP1_QTYPES) {
  if (!text.trim()) return [];
  const lower = text.toLowerCase();
  const scores = GP1_QTYPES.map(qt => {
    let score = 0;
    qt.triggers.forEach(t => {
      const tl = t.toLowerCase();
      if (lower.includes(tl)) score += tl.length;
    });
    return { id: qt.id, score };
  });
  return scores.filter(s => s.score > 0).sort((a, b) => b.score - a.score);
}

/* ━━━ EXAM COUNTDOWN & DAILY CHALLENGES ━━━ */
const EXAM_DATES = [
  { name: "O-Level English Paper 1", date: "2026-10-19", subject: "eng", paper: "Paper 1" },
  { name: "O-Level English Paper 2", date: "2026-10-20", subject: "eng", paper: "Paper 2" },
  { name: "A-Level GP Paper 1", date: "2026-11-09", subject: "gp", paper: "Paper 1" },
  { name: "A-Level GP Paper 2", date: "2026-11-10", subject: "gp", paper: "Paper 2" },
  { name: "A-Level H1 Econ", date: "2026-11-16", subject: "h1econ", paper: "Paper 1" },
  { name: "A-Level H2 Econ Paper 1", date: "2026-11-17", subject: "h2econ", paper: "Paper 1" },
  { name: "A-Level H2 Econ Paper 2", date: "2026-11-18", subject: "h2econ", paper: "Paper 2" },
];

export function getExamCountdowns() {
  const now = new Date();
  return EXAM_DATES.map(e => {
    const diff = Math.ceil((new Date(e.date) - now) / 86400000);
    return { ...e, daysLeft: diff };
  }).filter(e => e.daysLeft > 0).sort((a, b) => a.daysLeft - b.daysLeft);
}

const DAILY_CHALLENGES = [
  { subject: "eng", question: "Identify the tone and purpose of the following passage extract. What language features support your analysis?", type: "Comprehension" },
  { subject: "eng", question: "Write a compelling opening paragraph for the topic: 'Should social media platforms be banned for under-16s?'", type: "Argumentative" },
  { subject: "gp", question: "Evaluate the claim: 'Science and technology always improve quality of life.' Provide one argument FOR and one AGAINST with examples.", type: "Essay Planning" },
  { subject: "gp", question: "Identify the logical fallacy: 'Everyone I know thinks the policy is wrong, so it must be a bad policy.'", type: "Critical Thinking" },
  { subject: "h1econ", question: "Explain how a rise in oil prices affects the macroeconomy through cost-push inflation. Include a diagram description.", type: "Macro Policy" },
  { subject: "h2econ", question: "A new tax is imposed on sugary drinks. Using demand and supply analysis, explain the effect on equilibrium price and quantity.", type: "Market Mechanism" },
  { subject: "h2econ", question: "Compare the pricing behaviour of a monopolist vs a firm in perfect competition. Which is more allocatively efficient?", type: "Market Structures" },
  { subject: "eng", question: "Rewrite this sentence to improve clarity: 'The fact that the government has decided to implement measures which are designed to help people who are struggling is good.'", type: "Summary Writing" },
  { subject: "gp", question: "A news headline reads: 'SHOCKING Study PROVES Phones Cause Cancer!' Identify 3 red flags that suggest this is unreliable.", type: "Media Literacy" },
  { subject: "h1econ", question: "Explain why a subsidy on electric vehicles may lead to government failure. Consider information gaps and unintended consequences.", type: "Market Failure" },
];

export function getDailyChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

/* ━━━ WEEKLY PROGRESS SUMMARY ━━━ */
export function getWeeklyProgress(state) {
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().split("T")[0];
  const hwCompleted = (state.submissions || []).filter(s => s.submittedAt && s.submittedAt >= weekStr).length;
  const quizzesTaken = 0; // Would track from quiz results
  const notesCreated = (state.notes || []).filter(n => n.createdAt >= weekStr).length;
  const reviewsGiven = (state.peerReviews || []).filter(r => r.createdAt >= weekStr).length;
  const streakDays = state.wallet.streak;
  const coinsEarned = (state.wallet.history || []).filter(h => h.date >= weekStr).reduce((a, h) => a + h.coins, 0);
  return { hwCompleted, quizzesTaken, notesCreated, reviewsGiven, streakDays, coinsEarned };
}

/* ━━━ VOCAB WORD OF THE DAY ━━━ */
const WORDS_OF_THE_DAY = [
  { word: "Paradigm", def: "A typical example or model; a worldview underlying theories.", usage: "The discovery shifted the paradigm of how scientists understood climate change.", subject: "gp" },
  { word: "Ubiquitous", def: "Found everywhere; omnipresent.", usage: "Smartphones have become ubiquitous in modern classrooms, raising concerns about distraction.", subject: "eng" },
  { word: "Allocative Efficiency", def: "When resources are distributed to maximise total welfare (P = MC).", usage: "Perfect competition achieves allocative efficiency because firms produce where price equals marginal cost.", subject: "h2econ" },
  { word: "Juxtapose", def: "Place side by side for comparison or contrast.", usage: "The author juxtaposes the tranquility of nature with the chaos of urban life.", subject: "eng" },
  { word: "Exacerbate", def: "Make a problem or situation worse.", usage: "The government's inaction has exacerbated the housing affordability crisis.", subject: "gp" },
  { word: "Crowding Out", def: "When government borrowing drives up interest rates, reducing private investment.", usage: "Fiscal expansion funded by borrowing may lead to crowding out, partially offsetting the stimulus.", subject: "h1econ" },
  { word: "Rhetoric", def: "The art of persuasive speaking or writing.", usage: "The politician's rhetoric appealed to emotions rather than evidence.", subject: "gp" },
  { word: "Externality", def: "A cost or benefit that affects a party not directly involved in a transaction.", usage: "Pollution from factories is a negative externality borne by the surrounding community.", subject: "h1econ" },
  { word: "Nuanced", def: "Characterised by subtle distinctions and variations.", usage: "A nuanced argument acknowledges complexity rather than presenting a simplistic view.", subject: "eng" },
  { word: "Comparative Advantage", def: "Ability to produce a good at a lower opportunity cost than another producer.", usage: "Singapore has a comparative advantage in financial services due to its skilled workforce and strategic location.", subject: "h2econ" },
  { word: "Pernicious", def: "Having a harmful effect, especially in a gradual or subtle way.", usage: "The pernicious influence of misinformation on social media undermines democratic processes.", subject: "gp" },
  { word: "Deadweight Loss", def: "Loss of economic efficiency when equilibrium is not achieved (e.g., from taxes or monopoly).", usage: "The monopolist's restriction of output creates a deadweight loss to society.", subject: "h2econ" },
  { word: "Dichotomy", def: "A division into two opposing parts.", usage: "The dichotomy between tradition and modernity is a recurring theme in Singapore's cultural identity.", subject: "gp" },
  { word: "Inelastic", def: "Demand that responds proportionally less to price changes (PED < 1).", usage: "Demand for insulin is highly inelastic because it is a medical necessity with no substitutes.", subject: "h2econ" },
];

export function getWordOfTheDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}

export function getAdaptiveDifficulty(studentHistory) {
  if (!studentHistory || studentHistory.length < 3) return "Standard";
  const recent = studentHistory.slice(-5);
  const avgScore = recent.reduce((a, b) => a + b, 0) / recent.length;
  if (avgScore >= 85) return "Challenging";
  if (avgScore >= 65) return "Standard";
  return "Foundation";
}

export function generateStudyPlan(state) {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = ["eng", "gp", "h1econ", "h2econ"];
  const subjectNames = { eng: "English", gp: "General Paper", h1econ: "H1 Economics", h2econ: "H2 Economics" };
  const activities = [
    { type: "Practice Drills", duration: "25 min", icon: "🎯" },
    { type: "Example Review", duration: "15 min", icon: "🧠" },
    { type: "Essay Practice", duration: "45 min", icon: "✍️" },
    { type: "Video Lesson", duration: "20 min", icon: "📺" },
    { type: "Game Session", duration: "15 min", icon: "🎮" },
    { type: "Past Paper", duration: "60 min", icon: "📝" },
  ];
  const plan = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dayName = days[date.getDay()];
    const subj = subjects[d % subjects.length];
    const acts = [activities[d % activities.length], activities[(d + 2) % activities.length]];
    plan.push({ day: dayName, date: date.toLocaleDateString("en-SG", { month: "short", day: "numeric" }), subject: subjectNames[subj], subjectId: subj, tasks: acts });
  }
  return plan;
}
