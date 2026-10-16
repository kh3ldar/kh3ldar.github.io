import { Avatar, makeStyles, Text, tokens } from '@fluentui/react-components'
import type { EntityMetadata, EntityRecord, FormDefinition } from '../../data/types'
import { registry } from '../../platform/metadata'
import { FieldValue } from '../common/FieldValue'
import { Icon } from '../common/icons'

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    padding: `${tokens.spacingVerticalXS} 0`,
  },
  identity: { display: 'flex', alignItems: 'center', columnGap: tokens.spacingHorizontalM, minWidth: 0 },
  names: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  title: { margin: 0, overflowWrap: 'anywhere' },
  subtitle: { color: tokens.colorNeutralForeground3, display: 'flex', alignItems: 'center', columnGap: '6px' },
  fields: { display: 'flex', flexWrap: 'wrap', gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXXL}` },
  field: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '96px',
    paddingLeft: tokens.spacingHorizontalM,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  fieldValue: { fontWeight: tokens.fontWeightSemibold },
  fieldLabel: { color: tokens.colorNeutralForeground3 },
})

/** Record title, entity and form name on the left; up to four header fields on the right. */
export function FormHeader({ entity, record, form }: { entity: EntityMetadata; record: EntityRecord; form: FormDefinition }) {
  const styles = useStyles()
  const name = registry.getPrimaryName(record)
  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        {entity.recordImage === 'initials' ? (
          <Avatar name={name} size={48} color="colorful" aria-hidden />
        ) : (
          <Avatar size={48} color="brand" shape="square" icon={<Icon name={entity.icon} fontSize={24} />} aria-hidden />
        )}
        <div className={styles.names}>
          <Text as="h1" size={600} weight="semibold" className={styles.title}>
            {name}
          </Text>
          <Text size={200} className={styles.subtitle}>
            <Icon name={entity.icon} fontSize={14} />
            {entity.displayName} · {form.name}
          </Text>
        </div>
      </div>
      {form.header.length > 0 && (
        <dl className={styles.fields} style={{ margin: 0 }}>
          {form.header.map(({ attribute: name }) => {
            const attribute = registry.getAttribute(record.etn, name)
            if (!attribute) return null
            return (
              <div key={name} className={styles.field}>
                {/* Label first in the DOM for screen readers; shown under the value, like the platform does. */}
                <dt className={styles.fieldLabel} style={{ order: 2 }}>
                  <Text size={200}>{attribute.displayName}</Text>
                </dt>
                <dd className={styles.fieldValue} style={{ margin: 0 }}>
                  <FieldValue record={record} attribute={attribute} variant="header" />
                </dd>
              </div>
            )
          })}
        </dl>
      )}
    </header>
  )
}
