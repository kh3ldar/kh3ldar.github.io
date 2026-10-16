import type { EntityRecord, Relationship } from '../../data/types'
import type { Registry } from '../metadata/registry'
import { lookupList } from './values'

/**
 * Records of `etn` related to `record`.
 * forward: the record's own lookup lists them. reverse: their lookup points back at the record.
 * Without a relationship, every record of `etn`.
 */
export function relatedRecords(
  registry: Registry,
  record: EntityRecord,
  etn: string,
  relationship?: Relationship,
): EntityRecord[] {
  if (!relationship) return registry.getRecords(etn)
  if (relationship.kind === 'forward') {
    return lookupList(record.attributes[relationship.attribute]).flatMap((ref) => {
      const target = ref.etn === etn ? registry.getRecord(ref.etn, ref.id) : undefined
      return target ? [target] : []
    })
  }
  return registry
    .getRecords(etn)
    .filter((candidate) =>
      lookupList(candidate.attributes[relationship.attribute]).some((ref) => ref.etn === record.etn && ref.id === record.id),
    )
}
