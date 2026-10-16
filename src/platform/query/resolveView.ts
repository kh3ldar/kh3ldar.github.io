import type { AttributeMetadata, EntityMetadata, EntityRecord, SavedView, SortOrder } from '../../data/types'
import { compareValues } from '../format/formatValue'
import type { Registry } from '../metadata/registry'
import { matchesAll } from './filter'
import { getValue } from './values'

export interface ResolvedView {
  view: SavedView
  entity: EntityMetadata
  columns: { attribute: AttributeMetadata; width?: number }[]
  rows: EntityRecord[]
}

export function sortRecords(
  registry: Registry,
  etn: string,
  records: EntityRecord[],
  sort: SortOrder[],
  now?: Date,
): EntityRecord[] {
  const orders = sort
    .map((s) => ({ attribute: registry.getAttribute(etn, s.attribute), sign: s.direction === 'desc' ? -1 : 1 }))
    .filter((s): s is { attribute: AttributeMetadata; sign: 1 | -1 } => s.attribute !== undefined)
  return [...records].sort((a, b) => {
    for (const { attribute, sign } of orders) {
      const result = compareValues(registry, attribute, getValue(a, attribute, now), getValue(b, attribute, now))
      if (result !== 0) return result * sign
    }
    return 0
  })
}

/**
 * Applies a saved view: its filter, then its sort, then its columns.
 * Pass `source` to run the view over a subset (a subgrid's related records).
 */
export function resolveView(
  registry: Registry,
  view: SavedView,
  options: { source?: EntityRecord[]; now?: Date } = {},
): ResolvedView {
  const entity = registry.getEntity(view.etn)
  if (!entity) throw new Error(`View ${view.id} targets unknown entity ${view.etn}`)
  const source = options.source ?? registry.getRecords(view.etn)
  const filtered = source.filter((r) => r.etn === view.etn && matchesAll(registry, r, view.filter, options.now))
  const columns = view.columns.flatMap((c) => {
    const attribute = registry.getAttribute(view.etn, c.attribute)
    return attribute ? [{ attribute, width: c.width }] : []
  })
  return { view, entity, columns, rows: sortRecords(registry, view.etn, filtered, view.sort, options.now) }
}
