/* ━━━ SM-2 SPACED REPETITION FOR VOCABULARY ━━━ */

export const SR_STORAGE_KEY = "aworthy-vocab-sr";

/**
 * Initialise a spaced-repetition card from a vocab drill item.
 * @param {{ id: string, word: string, def: string }} vocabItem
 * @returns SR card with default metadata
 */
export function initSRCard(vocabItem) {
  const today = new Date().toISOString().split("T")[0];
  return {
    ...vocabItem,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: today,
  };
}

/**
 * SM-2 algorithm — calculate the next review schedule for a card.
 * @param {{ word: string, easeFactor: number, interval: number, repetitions: number, nextReview: string }} card
 * @param {number} quality  0-5 (0 = complete blackout, 5 = perfect recall)
 * @returns Updated card with new easeFactor, interval, repetitions, nextReview
 */
export function calculateNextReview(card, quality) {
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    /* ── correct response ── */
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;

    /* update ease factor (never below 1.3) */
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  } else {
    /* ── incorrect response — restart ── */
    repetitions = 0;
    interval = 1;
  }

  /* next review = today + interval days (ISO date string) */
  const today = new Date();
  today.setDate(today.getDate() + interval);
  const nextReview = today.toISOString().split("T")[0];

  return { ...card, easeFactor, interval, repetitions, nextReview };
}

/**
 * Return cards that are due for review, sorted most-overdue first.
 * @param {Array} cards  Array of SR cards
 * @returns {Array} Due cards sorted by most overdue
 */
export function getReviewQueue(cards) {
  const today = new Date().toISOString().split("T")[0];
  return cards
    .filter(c => c.nextReview <= today)
    .sort((a, b) => (a.nextReview < b.nextReview ? -1 : a.nextReview > b.nextReview ? 1 : 0));
}

/**
 * Load SR card data from localStorage.
 * @returns {Array} Saved SR cards, or empty array if none found
 */
export function loadSRData() {
  try {
    const raw = localStorage.getItem(SR_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persist SR card data to localStorage.
 * @param {Array} cards
 */
export function saveSRData(cards) {
  localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(cards));
}
