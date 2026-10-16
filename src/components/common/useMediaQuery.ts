import { useSyncExternalStore } from 'react'

/** Live result of a CSS media query. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Below this width the sitemap becomes an overlay. */
export const NARROW_QUERY = '(max-width: 1023px)'
/** Below this width the header search collapses into a button. */
export const COMPACT_HEADER_QUERY = '(max-width: 719px)'
