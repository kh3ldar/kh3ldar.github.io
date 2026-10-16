import { useMemo, useSyncExternalStore } from 'react'
import { buildHref, parseRoute, type Route } from './routes'

/**
 * A tiny router over the History API. Each entry remembers its index and the
 * scroll position of the main pane, so Back can tell whether there is an
 * in-app page to return to and restore where the reader was.
 */
interface EntryState {
  idx: number
  scrollTop?: number
}

export type NavigationKind = 'initial' | 'push' | 'replace' | 'pop'

const listeners = new Set<() => void>()
let lastKind: NavigationKind = 'initial'
let scrollContainer: HTMLElement | null = null

function entryState(): EntryState {
  const state = window.history.state as Partial<EntryState> | null
  return { idx: typeof state?.idx === 'number' ? state.idx : 0, scrollTop: state?.scrollTop }
}

function emit() {
  for (const listener of listeners) listener()
}

function onPopState() {
  lastKind = 'pop'
  emit()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('popstate', onPopState)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('popstate', onPopState)
  }
}

function getSearch() {
  return window.location.search
}

/** Registers the element that scrolls page content, for scroll save and restore. */
export function setScrollContainer(element: HTMLElement | null) {
  scrollContainer = element
}

function saveScroll() {
  if (!scrollContainer) return
  window.history.replaceState({ ...entryState(), scrollTop: scrollContainer.scrollTop }, '')
}

export function navigate(route: Route, options: { replace?: boolean } = {}) {
  const href = buildHref(route)
  const current = window.location.pathname + window.location.search
  if (href === current) return
  if (options.replace) {
    window.history.replaceState(entryState(), '', href)
    lastKind = 'replace'
  } else {
    saveScroll()
    window.history.pushState({ idx: entryState().idx + 1 } satisfies EntryState, '', href)
    lastKind = 'push'
  }
  emit()
}

/** Goes back if this tab has an in-app page to go back to; otherwise navigates to the fallback. */
export function goBack(fallback: Route) {
  if (entryState().idx > 0) window.history.back()
  else navigate(fallback, { replace: true })
}

/** How the current entry was reached, and the scroll position to restore for a Back/Forward. */
export function getNavigationInfo(): { kind: NavigationKind; scrollTop: number } {
  return { kind: lastKind, scrollTop: entryState().scrollTop ?? 0 }
}

export function useRoute(): Route {
  const search = useSyncExternalStore(subscribe, getSearch, () => '')
  return useMemo(() => parseRoute(search), [search])
}

/** Normalises the address bar to the canonical href on first load, keeping the entry. */
export function canonicaliseLocation() {
  const route = parseRoute(window.location.search)
  const href = buildHref(route)
  if (window.location.pathname + window.location.search !== href) {
    window.history.replaceState(entryState(), '', href)
  }
  window.history.scrollRestoration = 'manual'
}
