/* ━━━ NOTIFICATIONS ━━━ */

export async function requestPushPermission() {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendLocalNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/logo-aworthy.jpeg", badge: "/logo-aworthy.jpeg" });
  }
}

/**
 * Schedule a local notification for a future time.
 * Uses setTimeout — only works while the app/tab is open.
 * @param {string} title
 * @param {string} body
 * @param {number} delayMs — milliseconds from now
 * @returns {number} timeout ID (can be cleared with clearTimeout)
 */
export function scheduleLocalNotification(title, body, delayMs) {
  return setTimeout(() => sendLocalNotification(title, body), delayMs);
}

/**
 * Check if the browser supports push notifications via service worker.
 * @returns {boolean}
 */
export function supportsPushNotifications() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Register the service worker and subscribe to push notifications.
 * This is a preparation step for Firebase Cloud Messaging (FCM).
 * Returns the service worker registration if successful.
 */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (err) {
    console.warn("[notifications] Service worker registration failed:", err);
    return null;
  }
}

/**
 * Send homework deadline reminders as local notifications.
 * @param {Array} homework — array of homework objects with title, dueDate, status
 */
export function sendHomeworkReminders(homework) {
  if (Notification.permission !== "granted") return;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  homework
    .filter(h => h.status === "active" && h.dueDate === tomorrow)
    .forEach(h => {
      sendLocalNotification("Homework Due Tomorrow", `"${h.title}" is due ${h.dueDate}`);
    });
}

/**
 * Send a streak reminder if the user hasn't claimed today.
 * @param {string} lastClaim — ISO date of last claim
 */
export function sendStreakReminder(lastClaim) {
  if (Notification.permission !== "granted") return;
  const today = new Date().toISOString().split("T")[0];
  if (lastClaim !== today) {
    sendLocalNotification("Don't Break Your Streak!", "Log in to claim your daily reward and keep your streak going.");
  }
}
