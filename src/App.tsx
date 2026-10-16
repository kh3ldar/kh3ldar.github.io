import { FluentProvider, Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from '@fluentui/react-components'
import { lazy, Suspense, useEffect, useState } from 'react'
import { registerToastDispatcher } from './platform/commands/toast'
import { registry } from './platform/metadata'
import { useRoute } from './platform/router/history'
import type { Route } from './platform/router/routes'
import { getUiState, ui, useUi } from './platform/state/uiStore'
import { themes, useResolvedTheme } from './theme/themes'
import { WorkingOnIt } from './components/dialogs/WorkingOnIt'
import { AppShell } from './components/shell/AppShell'

// Each page type, and the surfaces that only open on demand, load as their own chunks.
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const EntityListPage = lazy(() => import('./pages/EntityListPage').then((m) => ({ default: m.EntityListPage })))
const EntityRecordPage = lazy(() => import('./pages/EntityRecordPage').then((m) => ({ default: m.EntityRecordPage })))
const QuickCreateDrawer = lazy(() => import('./components/quickcreate/QuickCreateDrawer').then((m) => ({ default: m.QuickCreateDrawer })))
const GlobalDialogs = lazy(() => import('./components/dialogs/GlobalDialogs').then((m) => ({ default: m.GlobalDialogs })))

/** True from the first time `value` is true; keeps a lazily loaded surface mounted for its close animation. */
function useLatch(value: boolean): boolean {
  const [latched, setLatched] = useState(value)
  if (value && !latched) setLatched(true)
  return latched || value
}

function Page({ route }: { route: Route }) {
  switch (route.pagetype) {
    case 'dashboard':
      return <DashboardPage route={route} />
    case 'entitylist':
      return <EntityListPage route={route} />
    case 'entityrecord':
      return <EntityRecordPage route={route} />
  }
}

/** "Contact: Barış Kuzu · Career Hub", the way the platform titles its tabs. */
function pageTitle(route: Route, defaultViews: Record<string, string>): string {
  const { appName } = registry.bundle.app
  if (route.pagetype === 'dashboard') return `${registry.getDashboard(route.id)?.name ?? 'Dashboard'} · ${appName}`
  const entity = registry.getEntity(route.etn)
  if (route.pagetype === 'entitylist') {
    const view = registry.getView(route.viewid ?? defaultViews[route.etn] ?? '') ?? registry.getDefaultView(route.etn)
    return `${view?.etn === route.etn ? view.name : (entity?.displayCollectionName ?? 'Records')} · ${appName}`
  }
  const record = registry.getRecord(route.etn, route.id)
  return entity && record ? `${entity.displayName}: ${registry.getPrimaryName(record)} · ${appName}` : `Record is unavailable · ${appName}`
}

function ToastBridge({ toasterId }: { toasterId: string }) {
  const { dispatchToast } = useToastController(toasterId)
  useEffect(
    () =>
      registerToastDispatcher(({ title, body, intent = 'info' }) =>
        dispatchToast(
          <Toast>
            <ToastTitle>{title}</ToastTitle>
            {body && <ToastBody>{body}</ToastBody>}
          </Toast>,
          { intent, timeout: 4000 },
        ),
      ),
    [dispatchToast],
  )
  return null
}

/** Opens the session-expiry dialog after a stretch without input, unless the tab is hidden or busy. */
function useIdleSession(minutes: number) {
  useEffect(() => {
    let timer = 0
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(fire, minutes * 60_000)
    }
    const fire = () => {
      const state = getUiState()
      if (document.hidden || state.dialog || state.quickCreate) return schedule()
      ui.openDialog({ kind: 'session' })
    }
    let last = 0
    const activity = () => {
      const now = Date.now()
      if (now - last < 1000) return
      last = now
      schedule()
    }
    const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'] as const
    for (const e of events) window.addEventListener(e, activity, { passive: true, capture: true })
    document.addEventListener('visibilitychange', activity)
    schedule()
    return () => {
      window.clearTimeout(timer)
      for (const e of events) window.removeEventListener(e, activity, { capture: true })
      document.removeEventListener('visibilitychange', activity)
    }
  }, [minutes])
}

export function App() {
  const route = useRoute()
  const theme = useResolvedTheme()
  const refreshKey = useUi((s) => s.refreshKey)
  const defaultViews = useUi((s) => s.defaultViews)
  const toasterId = useId('toaster')
  const quickCreateUsed = useLatch(useUi((s) => s.quickCreate !== null))
  const dialogsUsed = useLatch(useUi((s) => s.dialog !== null))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    document.title = pageTitle(route, defaultViews)
  }, [route, defaultViews])
  useIdleSession(registry.bundle.app.idleMinutes)

  return (
    <FluentProvider theme={themes[theme]}>
      <ToastBridge toasterId={toasterId} />
      <AppShell route={route}>
        <Suspense fallback={null}>
          <Page key={refreshKey} route={route} />
        </Suspense>
      </AppShell>
      <Suspense fallback={null}>
        {quickCreateUsed && <QuickCreateDrawer />}
        {dialogsUsed && <GlobalDialogs />}
      </Suspense>
      <WorkingOnIt />
      <Toaster toasterId={toasterId} position="top-end" pauseOnHover pauseOnWindowBlur offset={{ vertical: 56 }} />
    </FluentProvider>
  )
}
