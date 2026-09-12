import { daysUntilBirthday } from "./birthday";

const STORAGE_KEY = "tulip-birthday-daily-reminder";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export function reminderEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "on";
}

export function setReminderEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported" as const;
  return await Notification.requestPermission();
}

function next6am(from = new Date()) {
  const target = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 6, 0, 0, 0);
  if (target.getTime() <= from.getTime()) target.setDate(target.getDate() + 1);
  return target;
}

export function nextReminderTime() {
  return next6am();
}

export function showBirthdayNotification(firstName: string, birthday: string) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  const days = daysUntilBirthday(birthday);
  const body =
    days === 0
      ? `Happy Birthday, ${firstName}! 🎂 Today is your special day.`
      : `Good morning ${firstName}! ${days} day${days === 1 ? "" : "s"} until your birthday. 🌷`;
  new Notification("Tulip Birthday Reminder", { body, icon: "/favicon.ico" });
}

/**
 * Schedules a 6:00 AM local-time reminder while the app is open,
 * re-arming itself every 24 hours.
 */
export function scheduleDailyReminder(firstName: string, birthday: string) {
  if (typeof window === "undefined") return () => {};
  let timer: ReturnType<typeof setTimeout>;

  const arm = () => {
    const delay = next6am().getTime() - Date.now();
    timer = setTimeout(() => {
      if (reminderEnabled()) showBirthdayNotification(firstName, birthday);
      arm();
    }, delay);
  };

  arm();
  return () => clearTimeout(timer);
}
