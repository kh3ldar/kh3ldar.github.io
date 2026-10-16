import type { EntityMetadata } from '../../data/types'
import { formatValue } from '../format/formatValue'
import type { Registry } from '../metadata/registry'
import { getValue } from './values'

export interface SearchHit {
  etn: string
  id: string
  name: string
  /** Where the match was, when it wasn't the name. */
  matchedAttribute?: string
  snippet?: string
}

export interface SearchGroup {
  entity: EntityMetadata
  hits: SearchHit[]
}

/** Strips the Markdown subset used in memo fields so snippets read as text. */
function plain(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*`]/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function snippetAround(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 40)
  const end = Math.min(text.length, index + length + 60)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

/**
 * Case-insensitive search over primary names and attributes marked searchable.
 * Groups follow entity order; name matches rank above attribute matches.
 */
export function searchRecords(registry: Registry, query: string, limitPerEntity = 5): SearchGroup[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  const groups: SearchGroup[] = []

  for (const entity of registry.bundle.entities) {
    const searchable = entity.attributes.filter((a) => a.searchable && a.logicalName !== entity.primaryNameAttribute)
    const nameHits: SearchHit[] = []
    const otherHits: SearchHit[] = []
    for (const record of registry.getRecords(entity.logicalName)) {
      const name = registry.getPrimaryName(record)
      if (name.toLowerCase().includes(needle)) {
        nameHits.push({ etn: record.etn, id: record.id, name })
        continue
      }
      for (const attribute of searchable) {
        const text = plain(formatValue(registry, attribute, getValue(record, attribute)))
        const index = text.toLowerCase().indexOf(needle)
        if (index >= 0) {
          otherHits.push({
            etn: record.etn,
            id: record.id,
            name,
            matchedAttribute: attribute.displayName,
            snippet: snippetAround(text, index, needle.length),
          })
          break
        }
      }
    }
    const hits = [...nameHits, ...otherHits].slice(0, limitPerEntity)
    if (hits.length) groups.push({ entity, hits })
  }
  return groups
}
