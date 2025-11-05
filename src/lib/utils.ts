import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function weekTokenCET(d = new Date()) {
  const tz = 'Europe/Copenhagen';
  const iso = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(d);
  const date = new Date(`${iso}T00:00:00`);
  return formatISOWeek(date);
}

function formatISOWeek(date: Date) {
  const tmp = new Date(date.getTime());
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  const week1 = new Date(tmp.getFullYear(), 0, 4);
  const week = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${tmp.getFullYear()}W${String(week).padStart(2,'0')}`;
}
