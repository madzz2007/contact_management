/*
 * Single, safe gateway to localStorage.
 * Components never touch localStorage directly — they go through
 * services/, which use these helpers.
 */

const PREFIX = 'contactvault.v1';

export const KEYS = {
  contacts: `${PREFIX}.contacts`,
  interactions: `${PREFIX}.interactions`,
  events: `${PREFIX}.events`,
  settings: `${PREFIX}.settings`,
  recent: `${PREFIX}.recentlyViewed`,
  activity: `${PREFIX}.activity`,
  seeded: `${PREFIX}.seededAt`,
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (err) {
    console.warn(`[storage] failed to read "${key}"`, err);
    return fallback;
  }
}

/* Returns true on success; false when quota/private-mode errors occur. */
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] failed to write "${key}"`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function clearAppStorage() {
  Object.values(KEYS).forEach(removeKey);
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/* Rough footprint of app keys in bytes (UTF-16 ⇒ ×2). */
export function storageUsage() {
  let bytes = 0;
  Object.values(KEYS).forEach((k) => {
    try {
      bytes += (localStorage.getItem(k) || '').length * 2;
    } catch {
      /* ignore */
    }
  });
  return bytes;
}

export function formatBytes(n) {
  if (!n) return '0 KB';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
