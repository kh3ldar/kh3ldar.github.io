/**
 * D365-style URLs: everything lives on "/" with query parameters, like
 * main.aspx?appid=...&pagetype=entityrecord&etn=contact&id=... in a real app.
 * GitHub Pages serves index.html for "/", so deep links need no SPA fallback.
 */
export type Route =
  | { pagetype: 'dashboard'; id?: string }
  | { pagetype: 'entitylist'; etn: string; viewid?: string }
  | { pagetype: 'entityrecord'; etn: string; id: string; tabid?: string }

export type PageType = Route['pagetype']

export const APP_ID = 'career'

const MAX_PARAM_LENGTH = 100

function param(params: URLSearchParams, name: string): string | undefined {
  const value = params.get(name)?.trim()
  return value && value.length <= MAX_PARAM_LENGTH ? value : undefined
}

/** Parses a location.search string. Anything unrecognised lands on the default dashboard. */
export function parseRoute(search: string): Route {
  const params = new URLSearchParams(search)
  const pagetype = param(params, 'pagetype')?.toLowerCase()
  const etn = param(params, 'etn')?.toLowerCase()

  if (pagetype === 'entitylist' && etn) {
    const viewid = param(params, 'viewid')
    return viewid ? { pagetype, etn, viewid } : { pagetype, etn }
  }
  if (pagetype === 'entityrecord' && etn) {
    const id = param(params, 'id')
    if (id) {
      const tabid = param(params, 'tabid')
      return tabid ? { pagetype, etn, id, tabid } : { pagetype, etn, id }
    }
  }
  if (pagetype === 'dashboard') {
    const id = param(params, 'id')
    return id ? { pagetype, id } : { pagetype }
  }
  return { pagetype: 'dashboard' }
}

/** Builds the canonical href for a route. Parameter order is stable so hrefs compare as strings. */
export function buildHref(route: Route): string {
  const params = new URLSearchParams()
  params.set('appid', APP_ID)
  params.set('pagetype', route.pagetype)
  switch (route.pagetype) {
    case 'dashboard':
      if (route.id) params.set('id', route.id)
      break
    case 'entitylist':
      params.set('etn', route.etn)
      if (route.viewid) params.set('viewid', route.viewid)
      break
    case 'entityrecord':
      params.set('etn', route.etn)
      params.set('id', route.id)
      if (route.tabid) params.set('tabid', route.tabid)
      break
  }
  return `/?${params.toString()}`
}

export function sameRoute(a: Route, b: Route): boolean {
  return buildHref(a) === buildHref(b)
}
