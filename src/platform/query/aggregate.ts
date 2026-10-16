import type { AggregateKind, EntityRecord, FilterCondition } from '../../data/types'
import type { Registry } from '../metadata/registry'
import { matchesAll } from './filter'
import { getValue, isOptionValue, lookupList } from './values'

export interface AggregateQuery {
  etn: string
  aggregate: AggregateKind
  measure?: string
  filter?: FilterCondition[]
}

export interface GroupedValue {
  key: string
  label: string
  value: number
  /** The record behind a lookup group, for drill-through. */
  record?: EntityRecord
}

function measureOf(registry: Registry, record: EntityRecord, measure: string | undefined, now?: Date): number {
  if (!measure) return 0
  const attribute = registry.getAttribute(record.etn, measure)
  const value = attribute ? getValue(record, attribute, now) : null
  return typeof value === 'number' ? value : 0
}

function reduce(registry: Registry, records: EntityRecord[], query: AggregateQuery, now?: Date): number {
  if (query.aggregate === 'count') return records.length
  const values = records.map((r) => measureOf(registry, r, query.measure, now))
  if (query.aggregate === 'max') return values.length ? Math.max(...values) : 0
  return values.reduce((sum, v) => sum + v, 0)
}

function select(registry: Registry, query: AggregateQuery, now?: Date): EntityRecord[] {
  return registry.getRecords(query.etn).filter((r) => matchesAll(registry, r, query.filter, now))
}

export function aggregate(registry: Registry, query: AggregateQuery, now?: Date): number {
  return reduce(registry, select(registry, query, now), query, now)
}

/**
 * Aggregates per group. Option sets keep their option order; lookups and text sort by value, largest first.
 * Groups with nothing in them are left out.
 */
export function groupAggregate(
  registry: Registry,
  query: AggregateQuery & { groupBy: string },
  now?: Date,
): GroupedValue[] {
  const attribute = registry.getAttribute(query.etn, query.groupBy)
  if (!attribute) return []
  const records = select(registry, query, now)
  const groups = new Map<string, EntityRecord[]>()
  const add = (key: string, record: EntityRecord) => groups.set(key, [...(groups.get(key) ?? []), record])

  for (const record of records) {
    const value = getValue(record, attribute, now)
    if (attribute.type === 'optionset') {
      if (isOptionValue(value)) add(String(value.value), record)
    } else if (attribute.type === 'lookup') {
      for (const ref of lookupList(value)) add(`${ref.etn}:${ref.id}`, record)
    } else if (value !== null) {
      add(String(value), record)
    }
  }

  if (attribute.type === 'optionset') {
    const options = attribute.optionSet ? (registry.getOptionSet(attribute.optionSet)?.options ?? []) : []
    return options
      .filter((o) => groups.has(String(o.value)))
      .map((o) => ({ key: String(o.value), label: o.label, value: reduce(registry, groups.get(String(o.value)) ?? [], query, now) }))
  }

  const result = [...groups.entries()].map(([key, members]) => {
    if (attribute.type === 'lookup') {
      const [etn, id] = key.split(':')
      const target = registry.getRecord(etn, id)
      return { key, label: target ? registry.getPrimaryName(target) : id, value: reduce(registry, members, query, now), record: target }
    }
    return { key, label: key, value: reduce(registry, members, query, now) }
  })
  return result.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
}
