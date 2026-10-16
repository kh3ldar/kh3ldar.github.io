import { Link, type LinkProps } from '@fluentui/react-components'
import type { ReactNode } from 'react'
import { routeClickHandler } from './clicks'
import { buildHref, type Route } from './routes'

export interface RouteLinkProps {
  route: Route
  replace?: boolean
  className?: string
  inline?: boolean
  children?: ReactNode
}

/** A Fluent link to an in-app route. A real href, so it can be opened in a new tab. */
export function RouteLink({ route, replace, ...rest }: RouteLinkProps) {
  const props = { ...rest, as: 'a', href: buildHref(route), onClick: routeClickHandler(route, replace) }
  return <Link {...(props as unknown as LinkProps)} />
}
