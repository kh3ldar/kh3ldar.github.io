import type { AttributeValue, EntityRecord, FilterCondition } from '../../data/types'
import type { Registry } from '../metadata/registry'
import { getValue, isEmpty, isOptionValue, lookupList } from './values'

/** Comparable scalars of a value: option values, lookup ids, or the raw value. */
function comparable(value: AttributeValue): Array<string | number | boolean> {
  if (isEmpty(value)) return []
  if (isOptionValue(value)) return [value.value]
  const lookups = lookupList(value)
  if (lookups.length) return lookups.map((l) => l.id)
  return [value as string | number | boolean]
}

export function matchesCondition(
  registry: Registry,
  record: EntityRecord,
  condition: FilterCondition,
  now?: Date,
): boolean {
  const attribute = registry.getAttribute(record.etn, condition.attribute)
  if (!attribute) return false
  const value = getValue(record, attribute, now)
  const scalars = comparable(value)
  const expected = condition.value
  switch (condition.operator) {
    case 'null':
      return scalars.length === 0
    case 'notnull':
      return scalars.length > 0
    case 'eq':
      return scalars.some((s) => s === expected)
    case 'ne':
      return !scalars.some((s) => s === expected)
    case 'in':
      return Array.isArray(expected) && scalars.some((s) => (expected as Array<string | number | boolean>).includes(s))
    case 'contains': {
      const needle = String(expected ?? '').toLowerCase()
      return scalars.some((s) => String(s).toLowerCase().includes(needle))
    }
  }
}

export function matchesAll(
  registry: Registry,
  record: EntityRecord,
  conditions: FilterCondition[] | undefined,
  now?: Date,
): boolean {
  return (conditions ?? []).every((c) => matchesCondition(registry, record, c, now))
}
