/* Date helpers. All parse/normalize defensively and never throw. */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
const DAY_MS = 86400000;

const pad = (n) => String(n).padStart(2, '0');

/* Accepts Date | ISO string | 'YYYY-MM-DD' | timestamp. Returns Date or null. */
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
    if (iso) {
      const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function toISODate(d) {
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';
}

/* Parses strictly 'YYYY-MM-DD' strings (no timezone shifting). */
export function parseISODate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(Number(s.slice(0, 4)), Number(s.slice(5, 7)) - 1, Number(s.slice(8, 10)));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function todayISO(now = new Date()) {
  return toISODate(now);
}

export function addDays(d, n) {
  const c = new Date(d.getTime());
  c.setDate(c.getDate() + n);
  return c;
}

export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a, b) {
  const da = toDate(a);
  const db = toDate(b);
  return Boolean(da && db && toISODate(da) === toISODate(db));
}

/* Signed whole-day difference (positive when `to` is in the future). */
export function diffInDays(from, to) {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

export function isoDaysAgo(n, now = new Date()) {
  return toISODate(addDays(now, -n));
}

export function isoDaysAhead(n, now = new Date()) {
  return toISODate(addDays(now, n));
}

/* Full ISO timestamp n days ago (for createdAt fields in demo data). */
export function stampDaysAgo(n, now = new Date()) {
  return addDays(now, -n).toISOString();
}

/* ------------------------------ formatting -------------------------------- */

export function formatDate(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/* e.g. "20 September" — used for upcoming dates/birthdays. */
export function formatMonthDay(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/* 'HH:MM' 24h input → '2:30 PM' display. */
export function formatTime(t) {
  if (!t) return '';
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t));
  if (!m) return '';
  const h = Number(m[1]);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${suffix}`;
}

export function timeAgo(value, now = new Date()) {
  const d = toDate(value);
  if (!d) return '';
  const diff = now.getTime() - d.getTime();
  if (diff < 45000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/* --------------------------- recurring dates ------------------------------- */

/* Next occurrence of a yearly date (birthday/anniversary) on/after `now`. */
export function nextOccurrence(dateStr, now = new Date()) {
  const d = toDate(dateStr);
  if (!d) return null;
  const candidate = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if (startOfDay(candidate).getTime() < startOfDay(now).getTime()) {
    candidate.setFullYear(now.getFullYear() + 1);
  }
  return candidate;
}

export function daysUntilNext(dateStr, now = new Date()) {
  const next = nextOccurrence(dateStr, now);
  return next ? diffInDays(now, next) : null;
}

/* ------------------------------ event buckets ------------------------------ */
/* 'past' | 'today' | 'week' (next 7 days) | 'later' */
export function eventBucket(value, now = new Date()) {
  const d = toDate(value);
  if (!d) return 'later';
  const days = diffInDays(now, d);
  if (days < 0) return 'past';
  if (days === 0) return 'today';
  if (days <= 7) return 'week';
  return 'later';
}

export function monthKey(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export const MONTH_NAMES = MONTHS;
export const MONTH_SHORT = MONTHS_SHORT;
