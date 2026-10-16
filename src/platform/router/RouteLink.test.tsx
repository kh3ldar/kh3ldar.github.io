// @vitest-environment jsdom
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from './history'
import { RouteLink } from './RouteLink'

beforeEach(() => window.history.replaceState(null, '', '/?appid=career&pagetype=dashboard'))
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderLink() {
  render(
    <FluentProvider theme={webLightTheme}>
      <RouteLink route={{ pagetype: 'entitylist', etn: 'skill' }}>Skills</RouteLink>
    </FluentProvider>,
  )
  return screen.getByRole('link', { name: 'Skills' })
}

describe('RouteLink', () => {
  it('navigates in-app with pushState on a plain click', () => {
    const push = vi.spyOn(window.history, 'pushState')
    const link = renderLink()
    expect(link.getAttribute('href')).toBe('/?appid=career&pagetype=entitylist&etn=skill')
    fireEvent.click(link)
    expect(push).toHaveBeenCalledTimes(1)
    expect(window.location.search).toBe('?appid=career&pagetype=entitylist&etn=skill')
  })

  it('leaves modified clicks to the browser', () => {
    const push = vi.spyOn(window.history, 'pushState')
    const link = renderLink()
    fireEvent.click(link, { ctrlKey: true })
    expect(push).not.toHaveBeenCalled()
  })

  it('updates subscribers of useRoute', () => {
    const { result } = renderHook(() => useRoute())
    expect(result.current).toEqual({ pagetype: 'dashboard' })
    const link = renderLink()
    act(() => {
      fireEvent.click(link)
    })
    expect(result.current).toEqual({ pagetype: 'entitylist', etn: 'skill' })
  })
})
