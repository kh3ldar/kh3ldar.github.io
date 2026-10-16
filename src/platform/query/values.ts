import type { AttributeMetadata, AttributeValue, EntityRecord, LookupValue, OptionValue } from '../../data/types'
import { monthsBetween } from '../format/dates'

export function isOptionValue(value: AttributeValue | undefined): value is OptionValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'value' in value
}

export function isLookupValue(value: unknown): value is LookupValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'etn' in value && 'id' in value
}

/** Lookup references in a value, whether it holds one or many. */
export function lookupList(value: AttributeValue | undefined): LookupValue[] {
  if (Array.isArray(value)) return value
  return isLookupValue(value) ? [value] : []
}

export function isEmpty(value: AttributeValue | undefined): boolean {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
}

/** The value of an attribute on a record, evaluating calculated columns. */
export function getValue(record: EntityRecord, attribute: AttributeMetadata, now: Date = new Date()): AttributeValue {
  const calc = attribute.calculation
  if (calc?.type === 'monthsBetween') {
    const start = record.attributes[calc.start]
    const end = record.attributes[calc.end]
    if (typeof start !== 'string') return null
    return monthsBetween(start, typeof end === 'string' ? end : null, now) ?? null
  }
  return record.attributes[attribute.logicalName] ?? null
}
