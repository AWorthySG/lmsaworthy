/* ━━━ GAMIFICATION CONSTANTS ━━━ */
export const LEVELS = [
  { level: 1, name: "Newcomer",  min: 0,    max: 99,       color: "#6C7A99", bg: "#EEF2FB", emoji: "🌱" },
  { level: 2, name: "Learner",   min: 100,  max: 299,      color: "#216ef4", bg: "#E4EFFE", emoji: "📖" },
  { level: 3, name: "Scholar",   min: 300,  max: 599,      color: "#6660B9", bg: "#EEEAFF", emoji: "🎓" },
  { level: 4, name: "Expert",    min: 600,  max: 999,      color: "#E07800", bg: "#FFF3D9", emoji: "⭐" },
  { level: 5, name: "Champion",  min: 1000, max: Infinity,  color: "#C08A00", bg: "#FFF8D6", emoji: "👑" },
];

export const BADGE_DEFS = [
  { id: "first_quiz",     emoji: "⚡", name: "First Quiz",      desc: "Completed your first quiz" },
  { id: "perfect_score",  emoji: "💯", name: "Perfect Score",   desc: "Got 100% on any quiz" },
  { id: "bookworm",       emoji: "📚", name: "Bookworm",        desc: "Accessed 5+ resources" },
  { id: "rising_star",    emoji: "📈", name: "Rising Star",     desc: "Improved quiz score" },
  { id: "on_fire",        emoji: "🔥", name: "On Fire",         desc: "Present at 5+ sessions" },
  { id: "scholar",        emoji: "🎓", name: "Scholar",         desc: "Reached 300+ XP" },
  { id: "expert",         emoji: "⭐", name: "Expert",          desc: "Reached 600+ XP" },
  { id: "top_performer",  emoji: "👑", name: "Top Performer",   desc: "Highest XP in class" },
];

export const COMMUNITY_REACTIONS = ["👍", "🔥", "⭐", "💡", "🤝"];

/* ━━━ DAILY LOGIN REWARD SYSTEM ━━━ */
export const DAILY_REWARDS = [
  { day: 1, coins: 10, bonus: null, emoji: "🪙" },
  { day: 2, coins: 15, bonus: null, emoji: "🪙" },
  { day: 3, coins: 20, bonus: null, emoji: "🪙" },
  { day: 4, coins: 25, bonus: null, emoji: "💰" },
  { day: 5, coins: 35, bonus: "5 bonus XP", emoji: "💰" },
  { day: 6, coins: 40, bonus: null, emoji: "💰" },
  { day: 7, coins: 75, bonus: "Streak Badge + 20 XP", emoji: "🏆" },
];

export function getStreakReward(streak) {
  const day = ((streak - 1) % 7) + 1; // cycles every 7 days
  const multiplier = Math.floor((streak - 1) / 7) + 1; // 1x first week, 2x second, etc. (capped at 3x)
  const base = DAILY_REWARDS[day - 1];
  return { ...base, day, coins: base.coins * Math.min(multiplier, 3), streak, multiplier: Math.min(multiplier, 3) };
}

/* ━━━ AVATAR OPTIONS ━━━ */
export const AVATAR_OPTIONS = [
  { id: "butterfly", emoji: "🦋", bg: "#E8EEFF", ring: "#4455CC" },
  { id: "tiger",     emoji: "🐯", bg: "#FFF7ED", ring: "#EA580C" },
  { id: "star",      emoji: "🌟", bg: "#FEFCE8", ring: "#CA8A04" },
  { id: "fox",       emoji: "🦊", bg: "#FEF3C7", ring: "#D97706" },
  { id: "panda",     emoji: "🐼", bg: "#F0FDF4", ring: "#16A34A" },
  { id: "dolphin",   emoji: "🐬", bg: "#DBEAFE", ring: "#2563EB" },
  { id: "unicorn",   emoji: "🦄", bg: "#FDF4FF", ring: "#A855F7" },
  { id: "dragon",    emoji: "🐲", bg: "#DCFCE7", ring: "#15803D" },
  { id: "eagle",     emoji: "🦅", bg: "#FFF7ED", ring: "#B45309" },
  { id: "wolf",      emoji: "🐺", bg: "#F1F5F9", ring: "#475569" },
  { id: "lion",      emoji: "🦁", bg: "#FFFBEB", ring: "#B45309" },
  { id: "rocket",    emoji: "🚀", bg: "#F0F9FF", ring: "#0284C7" },
  { id: "phoenix",   emoji: "🔥", bg: "#FEF2F2", ring: "#DC2626" },
  { id: "crown",     emoji: "👑", bg: "#FFFBEB", ring: "#D97706" },
  { id: "lightning", emoji: "⚡", bg: "#EEEAFF", ring: "#5D58A8" },
  { id: "gem",       emoji: "💎", bg: "#E0F2FE", ring: "#0369A1" },
];
