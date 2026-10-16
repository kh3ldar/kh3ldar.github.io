import { InfoLabel, makeStyles, Text, tokens, Tooltip } from '@fluentui/react-components'
import { LockClosed12Regular } from '@fluentui/react-icons'
import type { EntityRecord, FormSection } from '../../data/types'
import { registry } from '../../platform/metadata'
import { getValue, isEmpty } from '../../platform/query/values'
import { FieldValue } from '../common/FieldValue'
import { FormSectionCard } from './FormSectionCard'

const useStyles = makeStyles({
  rows: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalM },
  row: {
    display: 'grid',
    gridTemplateColumns: 'minmax(110px, 38%) minmax(0, 1fr)',
    columnGap: tokens.spacingHorizontalM,
    alignItems: 'baseline',
    '@media (max-width: 480px)': { gridTemplateColumns: '1fr', rowGap: '2px' },
  },
  full: { minWidth: 0 },
  label: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
    color: tokens.colorNeutralForeground2,
    minWidth: 0,
  },
  lock: { color: tokens.colorNeutralForeground3, flexShrink: 0 },
  value: { minWidth: 0, overflowWrap: 'anywhere' },
})

type FieldsSection = Extract<FormSection, { kind: 'fields' }>

/** A form section of read-only fields: label on the left with a lock, value on the right. */
export function FieldSection({ section, record }: { section: FieldsSection; record: EntityRecord }) {
  const styles = useStyles()
  const { messages } = registry.bundle.app
  const fields = section.fields.flatMap((field) => {
    const attribute = registry.getAttribute(record.etn, field.attribute)
    return attribute ? [{ field, attribute }] : []
  })
  if (section.hideWhenEmpty && fields.every(({ attribute }) => isEmpty(getValue(record, attribute)))) return null

  return (
    <FormSectionCard label={section.label} hideLabel={section.hideLabel}>
      <div className={styles.rows}>
        {fields.map(({ field, attribute }) => {
          const label = field.label ?? attribute.displayName
          if (field.hideLabel) {
            return (
              <div key={field.attribute} className={styles.full}>
                <FieldValue record={record} attribute={attribute} variant="form" />
              </div>
            )
          }
          return (
            <div key={field.attribute} className={styles.row}>
              <span className={styles.label}>
                <Tooltip content={messages.readOnlyField} relationship="description">
                  <LockClosed12Regular className={styles.lock} tabIndex={-1} />
                </Tooltip>
                {attribute.description ? (
                  <InfoLabel size="medium" info={attribute.description}>
                    {label}
                  </InfoLabel>
                ) : (
                  <Text>{label}</Text>
                )}
              </span>
              <div className={styles.value}>
                <FieldValue record={record} attribute={attribute} variant="form" />
              </div>
            </div>
          )
        })}
      </div>
    </FormSectionCard>
  )
}
