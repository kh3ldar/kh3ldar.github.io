import { webDarkTheme, webLightTheme, type Theme } from '@fluentui/react-components'
import { useEffect, useState } from 'react'
import { useUi } from '../platform/state/uiStore'

export type ResolvedTheme = 'light' | 'dark'

export const themes: Record<ResolvedTheme, Theme> = {
  light: webLightTheme,
  dark: webDarkTheme,
}

/**
 * Chart series colour per theme: slot 1 of the validated data-viz palette,
 * checked against each theme's card surface (#ffffff and #292929).
 */
export const chartSeriesColor: Record<ResolvedTheme, string> = {
  light: '#2a78d6',
  dark: '#3987e5',
}

const DARK_QUERY = '(prefers-color-scheme: dark)'

function systemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

/** The theme in effect: the visitor's choice, or the OS setting when they chose "system". */
export function useResolvedTheme(): ResolvedTheme {
  const setting = useUi((s) => s.theme)
  const [system, setSystem] = useState<ResolvedTheme>(systemTheme)
  useEffect(() => {
    const media = window.matchMedia?.(DARK_QUERY)
    if (!media) return
    const onChange = () => setSystem(media.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return setting === 'system' ? system : setting
}
