// @vitest-environment jsdom
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { registry } from '../../platform/metadata'
import { resolveView } from '../../platform/query/resolveView'
import { EntityGrid } from './EntityGrid'

afterEach(cleanup)

function renderGrid(viewId: string) {
  const view = registry.getView(viewId)
  if (!view) throw new Error(`missing view ${viewId}`)
  const resolved = resolveView(registry, view)
  render(
    <FluentProvider theme={webLightTheme}>
      <EntityGrid resolved={resolved} ariaLabel={view.name} />
    </FluentProvider>,
  )
  return screen.getByRole('grid', { name: view.name })
}

function firstDataRow(grid: HTMLElement): string {
  const rows = within(grid).getAllByRole('row')
  return rows[1].textContent ?? ''
}

describe('EntityGrid', () => {
  it('renders the columns of the saved view, in order', () => {
    const grid = renderGrid('position-all')
    const headers = within(grid)
      .getAllByRole('columnheader')
      .map((h) => h.textContent?.trim())
      .filter(Boolean)
    expect(headers).toEqual(['Position', 'Account', 'Start Date', 'End Date', 'Tenure (Months)', 'Status'])
  })

  it('starts in the view sort and re-sorts from the header', () => {
    const grid = renderGrid('position-all')
    expect(firstDataRow(grid)).toContain('Dynamics 365 Developer')
    const startDate = within(grid).getByRole('columnheader', { name: /Start Date/ })
    fireEvent.click(within(startDate).getByRole('button'))
    expect(firstDataRow(grid)).toContain('Operations Team Manager')
  })

  it('links the primary name to the record', () => {
    const grid = renderGrid('position-all')
    const link = within(grid).getByRole('link', { name: 'Dynamics 365 Developer' })
    expect(link.getAttribute('href')).toBe('/?appid=career&pagetype=entityrecord&etn=position&id=emind-d365-developer')
  })
})
