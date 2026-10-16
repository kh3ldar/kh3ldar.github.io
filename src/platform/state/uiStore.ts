import { useSyncExternalStore } from 'react'
import { readPreference, writePreference } from './preferences'

export type ThemeSetting = 'system' | 'light' | 'dark'

export interface GagContext {
  etn?: string
  recordId?: string
  location: string
}

export type DialogState =
  | { kind: 'gag'; gagId: string; context: GagContext }
  | { kind: 'personalization' }
  | { kind: 'about' }
  | { kind: 'session' }
  | null

export interface UiState {
  theme: ThemeSetting
  /** session changes on every open, so each open starts with an empty form. */
  quickCreate: { etn: string; session: number } | null
  dialog: DialogState
  working: boolean
  /** Bumped by Refresh; the page remounts. */
  refreshKey: number
  /** Overlay sitemap on narrow screens. */
  navOpen: boolean
  /** Icon rail instead of the full sitemap on wide screens. */
  navCollapsed: boolean
  /** Area picked in the area switcher, used when the route alone doesn't decide it. */
  areaId: string | null
  /** Per-entity default view chosen with "Set as default view". */
  defaultViews: Record<string, string>
}

let state: UiState = {
  theme: 'system',
  quickCreate: null,
  dialog: null,
  working: false,
  refreshKey: 0,
  navOpen: false,
  navCollapsed: false,
  areaId: null,
  defaultViews: {},
}
let hydrated = false
const listeners = new Set<() => void>()

function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  state = {
    ...state,
    theme: readPreference<ThemeSetting>('theme', 'system'),
    navCollapsed: readPreference('navCollapsed', false),
    defaultViews: readPreference<Record<string, string>>('defaultViews', {}),
  }
}

export function getUiState(): UiState {
  hydrate()
  return state
}

export function setUiState(patch: Partial<UiState>) {
  hydrate()
  state = { ...state, ...patch }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Selects from UI state. Return primitives or existing references so renders stay stable. */
export function useUi<T>(selector: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getUiState()),
    () => selector(state),
  )
}

export const ui = {
  setTheme(theme: ThemeSetting) {
    setUiState({ theme })
    writePreference('theme', theme)
  },
  openQuickCreate(etn: string) {
    setUiState({ quickCreate: { etn, session: Date.now() }, dialog: null, navOpen: false })
  },
  closeQuickCreate() {
    setUiState({ quickCreate: null })
  },
  openDialog(dialog: Exclude<DialogState, null>) {
    setUiState({ dialog })
  },
  closeDialog() {
    setUiState({ dialog: null })
  },
  setNavOpen(navOpen: boolean) {
    setUiState({ navOpen })
  },
  setNavCollapsed(navCollapsed: boolean) {
    setUiState({ navCollapsed })
    writePreference('navCollapsed', navCollapsed)
  },
  setArea(areaId: string) {
    setUiState({ areaId })
  },
  setDefaultView(etn: string, viewId: string) {
    const defaultViews = { ...getUiState().defaultViews, [etn]: viewId }
    setUiState({ defaultViews })
    writePreference('defaultViews', defaultViews)
  },
  /** Shows "Working on it..." briefly, then remounts the page, like a real refresh. */
  refresh(delayMs = 700) {
    setUiState({ working: true })
    window.setTimeout(() => setUiState({ working: false, refreshKey: getUiState().refreshKey + 1 }), delayMs)
  },
}
