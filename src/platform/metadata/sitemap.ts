import type { SiteMapArea, SiteMapDefinition, SubArea } from '../../data/types'
import { buildHref, type Route } from '../router/routes'

export interface SiteMapMatch {
  area: SiteMapArea
  subarea: SubArea
}

function allSubareas(sitemap: SiteMapDefinition): SiteMapMatch[] {
  return sitemap.areas.flatMap((area) => area.groups.flatMap((g) => g.subareas.map((subarea) => ({ area, subarea }))))
}

/**
 * The subarea a route belongs to: an exact match first, then the list of the
 * same entity (a position record highlights "Positions").
 */
export function matchSubarea(sitemap: SiteMapDefinition, route: Route): SiteMapMatch | undefined {
  const all = allSubareas(sitemap)
  const href = buildHref(route)
  const exact = all.find((m) => buildHref(m.subarea.route) === href)
  if (exact) return exact
  if (route.pagetype === 'dashboard') return all.find((m) => m.subarea.route.pagetype === 'dashboard')
  return all.find((m) => m.subarea.route.pagetype === 'entitylist' && m.subarea.route.etn === route.etn)
}

/** The area to show: the route's area, else the one last picked, else the first. */
export function resolveArea(sitemap: SiteMapDefinition, route: Route, pickedAreaId: string | null): SiteMapArea {
  const fromRoute = matchSubarea(sitemap, route)?.area
  if (fromRoute && (!pickedAreaId || fromRoute.id === pickedAreaId)) return fromRoute
  return sitemap.areas.find((a) => a.id === pickedAreaId) ?? fromRoute ?? sitemap.areas[0]
}
