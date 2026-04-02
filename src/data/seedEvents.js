// Events seed data
export const initialEvents = [
  {
    id: 1, title: "GP Essay Sprint Challenge", status: "active",
    emoji: "✍️", color: "#EF8354",
    startDate: "2026-03-20", endDate: "2026-03-27",
    description: "Write the best GP Paper 1 essay using the Timed Writer tool. Your essay will be graded by Mr Jeremy. Top 3 essays win prizes! Use any question type — marks awarded for thesis clarity, example quality, and structural coherence.",
    howToParticipate: "Go to Timed Writer → complete a full 90-minute essay → submit. Your best attempt counts.",
    prizes: [
      { place: "1st", reward: "150 Coins + $20 GrabFood Voucher + 'Essay Champion' Badge", emoji: "🥇" },
      { place: "2nd", reward: "100 Coins + $10 GrabFood Voucher", emoji: "🥈" },
      { place: "3rd", reward: "75 Coins + 'Rising Writer' Badge", emoji: "🥉" },
    ],
    criteria: ["Thesis clarity and sustained argument (30%)", "Example quality — specific, evaluated, not just cited (30%)", "Structure — correct framework for question type (20%)", "Language sophistication and Band 5 vocabulary (20%)"],
    participants: [
      { studentId: 1, joined: "2026-03-20", score: 87, submission: "Completed — awaiting final grading" },
      { studentId: 3, joined: "2026-03-21", score: null, submission: "In progress" },
    ],
    maxParticipants: null,
  },
  {
    id: 3, title: "Practice Drills Speed Run", status: "upcoming",
    emoji: "⚡", color: "#D4940A",
    startDate: "2026-03-28", endDate: "2026-04-04",
    description: "Score the highest on a 25-question Practice Drill. Fastest time with highest accuracy wins. Can you identify all 6 question types, structures, and frameworks perfectly?",
    howToParticipate: "Go to Practice Drills → select 25 questions → complete the drill. Your best score + time is recorded.",
    prizes: [
      { place: "1st", reward: "125 Coins + 'Speed Analyst' Badge", emoji: "🥇" },
      { place: "Perfect Score", reward: "75 Bonus Coins (any participant)", emoji: "💯" },
    ],
    criteria: ["Score = correct fields / total fields (out of 75)", "Tiebreaker: fastest completion time", "Multiple attempts allowed — best score counts"],
    participants: [],
    maxParticipants: null,
  },
  {
    id: 4, title: "Vocabulary Challenge — 7-Day Streak", status: "upcoming",
    emoji: "📚", color: "#024F94",
    startDate: "2026-04-01", endDate: "2026-04-07",
    description: "Complete at least one Vocabulary Builder session every day for 7 consecutive days. Build your Paper 1 & 2 language arsenal while earning prizes for consistency.",
    howToParticipate: "Go to Vocabulary → complete any quiz (Synonym Match or Upgrade) each day for 7 days straight.",
    prizes: [
      { place: "7-Day Streak", reward: "100 Coins + 'Word Smith' Badge", emoji: "🔥" },
      { place: "Perfect Scores (all 7 days)", reward: "50 Bonus Coins", emoji: "💯" },
    ],
    criteria: ["Must complete at least 1 session per day", "Missing a day breaks the streak", "Score 80%+ on each session for the perfect score bonus"],
    participants: [],
    maxParticipants: null,
  },
];

