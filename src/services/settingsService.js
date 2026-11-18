/* User preferences (theme, default list density). */

import { KEYS, readJSON, writeJSON } from './storage.js';

export const DEFAULT_SETTINGS = Object.freeze({
  theme: 'system',
  defaultView: 'list', /* 'list' | 'compact' */
  notify: {
    birthdays: true,
    events: true,
    followUps: true,
    incomplete: true,
  },
});

export function sanitizeSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const theme = ['light', 'dark', 'system'].includes(s.theme) ? s.theme : DEFAULT_SETTINGS.theme;
  const defaultView = ['list', 'compact'].includes(s.defaultView) ? s.defaultView : DEFAULT_SETTINGS.defaultView;
  const notify = s.notify && typeof s.notify === 'object' ? s.notify : {};
  return {
    theme,
    defaultView,
    notify: {
      birthdays: notify.birthdays !== false,
      events: notify.events !== false,
      followUps: notify.followUps !== false,
      incomplete: notify.incomplete !== false,
    },
  };
}

export function getSettings() {
  return sanitizeSettings(readJSON(KEYS.settings, null));
}

export function updateSettings(patch = {}) {
  const next = sanitizeSettings({ ...getSettings(), ...patch });
  writeJSON(KEYS.settings, next);
  return next;
}