import type { CommandAction } from '../../data/types'
import { fillTemplate } from '../format/template'
import { registry } from '../metadata'
import { goBack, navigate } from '../router/history'
import type { Route } from '../router/routes'
import { ui } from '../state/uiStore'
import { showToast } from './toast'

/** Where a command runs: the page route and, on lists, the view being shown. */
export interface CommandContext {
  route: Route
  viewId?: string
}

export function triggerDownload(href: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function backFallback(route: Route): Route {
  return route.pagetype === 'entityrecord' ? { pagetype: 'entitylist', etn: route.etn } : { pagetype: 'dashboard' }
}

async function exportCurrentView(context: CommandContext) {
  const { messages } = registry.bundle.app
  if (context.route.pagetype !== 'entitylist') return
  const view = (context.viewId && registry.getView(context.viewId)) || registry.getDefaultView(context.route.etn)
  const entity = registry.getEntity(context.route.etn)
  if (!view || !entity) return
  const { exportViewToExcel } = await import('../export/exportExcel')
  const count = exportViewToExcel(registry, view)
  showToast({
    intent: 'success',
    title: count
      ? fillTemplate(messages.exported, {
          count: String(count),
          entities: (count === 1 ? entity.displayName : entity.displayCollectionName).toLowerCase(),
        })
      : messages.exportEmpty,
  })
}

/** Runs a command action. Every button, tile action and dialog action ends up here. */
export async function executeAction(action: CommandAction, context: CommandContext): Promise<void> {
  const { messages } = registry.bundle.app
  switch (action.type) {
    case 'downloadFile':
      triggerDownload(action.href, action.fileName)
      return
    case 'openUrl':
      window.open(action.href, '_blank', 'noopener,noreferrer')
      return
    case 'navigate':
      ui.closeDialog()
      navigate(action.route)
      return
    case 'back':
      goBack(backFallback(context.route))
      return
    case 'refresh':
      ui.refresh()
      return
    case 'share': {
      const copied = await copyText(window.location.href)
      showToast(copied ? { intent: 'success', title: messages.linkCopied } : { intent: 'warning', title: messages.linkCopyFailed })
      return
    }
    case 'exportExcel':
      await exportCurrentView(context)
      return
    case 'openQuickCreate':
      ui.openQuickCreate(action.etn)
      return
    case 'openDialog':
      ui.openDialog({ kind: action.dialog })
      return
    case 'gag': {
      const { route } = context
      ui.openDialog({
        kind: 'gag',
        gagId: action.gagId,
        context: {
          etn: route.pagetype === 'dashboard' ? undefined : route.etn,
          recordId: route.pagetype === 'entityrecord' ? route.id : undefined,
          location: window.location.href,
        },
      })
      return
    }
  }
}
