import { utils, writeFile } from 'xlsx'
import type { SavedView } from '../../data/types'
import { formatValue } from '../format/formatValue'
import type { Registry } from '../metadata/registry'
import { resolveView } from '../query/resolveView'
import { getValue } from '../query/values'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** "Active Positions 10-16-2026 3-04-09 PM.xlsx", the way the platform names exports. */
export function exportFileName(viewName: string, now: Date): string {
  const hours = now.getHours() % 12 || 12
  const ampm = now.getHours() < 12 ? 'AM' : 'PM'
  const date = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}`
  const time = `${hours}-${pad(now.getMinutes())}-${pad(now.getSeconds())} ${ampm}`
  return `${viewName.replace(/[\\/:*?"<>|]/g, '')} ${date} ${time}.xlsx`
}

/** Builds the sheet rows for a view: display-name headers, formatted values, numbers kept numeric. */
export function viewToRows(registry: Registry, view: SavedView, now = new Date()): Array<Array<string | number>> {
  const resolved = resolveView(registry, view, { now })
  const header = resolved.columns.map((c) => c.attribute.displayName)
  const rows = resolved.rows.map((record) =>
    resolved.columns.map(({ attribute }) => {
      const value = getValue(record, attribute, now)
      return typeof value === 'number' ? value : formatValue(registry, attribute, value)
    }),
  )
  return [header, ...rows]
}

/** Writes the view to an .xlsx download and returns the number of data rows. */
export function exportViewToExcel(registry: Registry, view: SavedView, now = new Date()): number {
  const rows = viewToRows(registry, view, now)
  const sheet = utils.aoa_to_sheet(rows)
  sheet['!cols'] = view.columns.map((c) => ({ wch: Math.max(12, Math.round((c.width ?? 120) / 7)) }))
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, view.name.replace(/[[\]:*?/\\]/g, '').slice(0, 31) || 'Export')
  writeFile(book, exportFileName(view.name, now))
  return rows.length - 1
}
