import type { MouseEvent } from 'react'
import { navigate } from './history'
import type { Route } from './routes'

/** True for a plain left click: modified clicks should keep opening tabs and windows. */
export function isPlainLeftClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

/** Click handler for any anchor that should navigate in-app. */
export function routeClickHandler(route: Route, replace = false) {
  return (event: MouseEvent) => {
    if (event.defaultPrevented || !isPlainLeftClick(event)) return
    event.preventDefault()
    navigate(route, { replace })
  }
}
