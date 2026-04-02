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
