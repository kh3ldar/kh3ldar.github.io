/**
 * Per-browser conveniences (theme, default views, nav state). Storage can be
 * missing or throw (private windows, blocked site data), so every access is
 * guarded and the app works without it.
 */
const PREFIX = 'careerhub.'

export function readPreference<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writePreference<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Not persisted; the in-memory state still applies for this visit.
  }
}
