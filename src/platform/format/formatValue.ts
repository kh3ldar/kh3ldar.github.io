import type { AttributeMetadata, AttributeValue } from '../../data/types'
import type { Registry } from '../metadata/registry'
import { isEmpty, isOptionValue, lookupList } from '../query/values'
import { dateSortKey, formatDate } from './dates'

/** Plain-text rendering of a value: for sorting, searching, exporting and simple cells. */
export function formatValue(registry: Registry, attribute: AttributeMetadata, value: AttributeValue | undefined): string {
  if (isEmpty(value)) return attribute.nullLabel ?? ''
  switch (attribute.type) {
    case 'date':
      return typeof value === 'string'
        ? formatDate(value, attribute.format === 'year' || attribute.format === 'monthyear' ? attribute.format : undefined)
        : ''
    case 'optionset':
      return isOptionValue(value) ? (registry.getOption(attribute, value.value)?.label ?? String(value.value)) : ''
    case 'lookup':
      return lookupList(value)
        .map((ref) => {
          const target = registry.getRecord(ref.etn, ref.id)
          return target ? registry.getPrimaryName(target) : ref.id
        })
        .join(', ')
    case 'number':
      return typeof value === 'number'
        ? new Intl.NumberFormat('en-US', {
            maximumFractionDigits: attribute.format === 'integer' ? 0 : 2,
          }).format(value)
        : ''
    case 'boolean': {
      const [no, yes] = attribute.booleanLabels ?? ['No', 'Yes']
      return value === true ? yes : no
    }
    case 'url':
      return typeof value === 'string' ? value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : ''
    default:
      return typeof value === 'string' ? value : String(value)
  }
}

/** Sort comparator for two values of the same attribute. Empty values sort first, except open-ended dates. */
export function compareValues(
  registry: Registry,
  attribute: AttributeMetadata,
  a: AttributeValue | undefined,
  b: AttributeValue | undefined,
): number {
  const emptyA = isEmpty(a)
  const emptyB = isEmpty(b)
  if (emptyA || emptyB) {
    if (emptyA && emptyB) return 0
    // An empty end date with a nullLabel ("Present") is the latest date there is.
    const ongoing = attribute.type === 'date' && attribute.nullLabel !== undefined
    return (emptyA ? -1 : 1) * (ongoing ? -1 : 1)
  }
  switch (attribute.type) {
    case 'number':
      return (a as number) - (b as number)
    case 'date':
      return dateSortKey(a as string) - dateSortKey(b as string)
    case 'optionset':
      return (isOptionValue(a) ? a.value : 0) - (isOptionValue(b) ? b.value : 0)
    case 'boolean':
      return Number(a) - Number(b)
    default:
      return formatValue(registry, attribute, a).localeCompare(formatValue(registry, attribute, b), 'en', {
        sensitivity: 'base',
      })
  }
}
