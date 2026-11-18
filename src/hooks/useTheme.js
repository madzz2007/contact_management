/* Theme resolution (light / dark / system). Applied to <html data-theme>. */

export function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(theme) {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themeMode = theme === 'system' ? 'system' : 'manual';
  }
  return resolved;
}

/* Keeps the resolved theme in sync when the OS scheme flips in "system" mode. */
export function watchSystemTheme(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia || typeof window.matchMedia !== 'function') return null;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (event) => {
    onChange(event.matches ? 'dark' : 'light');
  };
  if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler);
  else if (typeof mql.addListener === 'function') mql.addListener(handler);
  return { mql, handler };
}

export function unwatchSystemTheme(watched) {
  if (!watched) return;
  if (typeof watched.mql.removeEventListener === 'function') watched.mql.removeEventListener('change', watched.handler);
  else if (typeof watched.mql.removeListener === 'function') watched.mql.removeListener(watched.handler);
}