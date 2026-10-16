import { CounterBadge } from '@fluentui/react-components'
import { useMemo } from 'react'
import type { EntityRecord, FormSection } from '../../data/types'
import { registry } from '../../platform/metadata'
import { relatedRecords } from '../../platform/query/relations'
import { resolveView } from '../../platform/query/resolveView'
import { EntityGrid } from '../grid/EntityGrid'
import { FormSectionCard } from './FormSectionCard'

type SubgridSection = Extract<FormSection, { kind: 'subgrid' }>

/** A subgrid: a saved view run over the records related to the form's record. */
export function SubGrid({ section, record }: { section: SubgridSection; record: EntityRecord }) {
  const view = registry.getView(section.viewId)
  const resolved = useMemo(() => {
    if (!view) return undefined
    const source = relatedRecords(registry, record, section.etn, section.relationship)
    return resolveView(registry, view, { source })
  }, [view, record, section.etn, section.relationship])
  if (!resolved) return null

  return (
    <FormSectionCard
      label={section.label}
      actions={<CounterBadge count={resolved.rows.length} appearance="ghost" color="informative" showZero aria-label={`${resolved.rows.length} rows`} />}
    >
      <EntityGrid resolved={resolved} compact ariaLabel={section.label} />
    </FormSectionCard>
  )
}
