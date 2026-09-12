export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
  totalDays: number;
};

/** Parse a YYYY-MM-DD birthday string as a local date (no timezone drift). */
export function parseBirthday(value: string): { month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { month: Number(match[2]) - 1, day: Number(match[3]) };
}

export function nextBirthday(month: number, day: number, from = new Date()): Date {
  const year = from.getFullYear();
  const candidate = new Date(year, month, day, 0, 0, 0, 0);
  if (candidate.getTime() <= from.getTime() - 1) {
    const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    if (candidate.getTime() === today.getTime()) return candidate;
    return new Date(year + 1, month, day, 0, 0, 0, 0);
  }
  return candidate;
}

export function getCountdown(birthday: string, now = new Date()): Countdown | null {
  const parsed = parseBirthday(birthday);
  if (!parsed) return null;

  const isBirthday = now.getMonth() === parsed.month && now.getDate() === parsed.day;
  const target = isBirthday
    ? new Date(now.getFullYear(), parsed.month, parsed.day + 1)
    : nextBirthday(parsed.month, parsed.day, now);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return {
    days: isBirthday ? 0 : days,
    hours,
    minutes,
    seconds,
    isBirthday,
    totalDays: isBirthday ? 0 : days,
  };
}

export function daysUntilBirthday(birthday: string, now = new Date()): number {
  return getCountdown(birthday, now)?.totalDays ?? 0;
}
