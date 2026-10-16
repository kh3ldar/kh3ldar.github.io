import { Badge, Link, makeStyles, mergeClasses, Text, tokens } from '@fluentui/react-components'
import { Open16Regular } from '@fluentui/react-icons'
import type { AttributeMetadata, EntityRecord } from '../../data/types'
import { formatValue } from '../../platform/format/formatValue'
import { registry } from '../../platform/metadata'
import { RouteLink } from '../../platform/router/RouteLink'
import { getValue, isEmpty, isOptionValue, lookupList } from '../../platform/query/values'
import { RichText } from './RichText'

const useStyles = makeStyles({
  empty: { color: tokens.colorNeutralForeground3 },
  external: { display: 'inline-flex', alignItems: 'center', columnGap: '4px', overflowWrap: 'anywhere' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '4px 8px' },
  badge: { whiteSpace: 'nowrap', flexShrink: 0 },
  gridLink: { display: 'inline-flex', alignItems: 'center', minHeight: '24px' },
  clamp: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
})

export type FieldVariant = 'grid' | 'form' | 'header'

/** Renders one attribute of a record by its metadata type. Shared by grids, forms and headers. */
export function FieldValue({
  record,
  attribute,
  variant,
}: {
  record: EntityRecord
  attribute: AttributeMetadata
  variant: FieldVariant
}) {
  const styles = useStyles()
  const value = getValue(record, attribute)
  const { messages } = registry.bundle.app

  if (isEmpty(value) && attribute.nullLabel === undefined) {
    return variant === 'grid' ? null : <span className={styles.empty}>{messages.emptyValue}</span>
  }

  switch (attribute.type) {
    case 'lookup': {
      const refs = lookupList(value)
      const links = refs.map((ref) => {
        const target = registry.getRecord(ref.etn, ref.id)
        const name = target ? registry.getPrimaryName(target) : ref.id
        return target ? (
          <RouteLink
            key={`${ref.etn}:${ref.id}`}
            className={variant === 'grid' ? styles.gridLink : undefined}
            route={{ pagetype: 'entityrecord', etn: ref.etn, id: ref.id }}
          >
            {name}
          </RouteLink>
        ) : (
          <span key={ref.id}>{name}</span>
        )
      })
      return refs.length > 1 ? <span className={styles.chips}>{links}</span> : <>{links}</>
    }
    case 'url': {
      const href = String(value)
      return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className={mergeClasses(styles.external, variant === 'grid' && styles.gridLink)}>
          {formatValue(registry, attribute, value)}
          {variant !== 'grid' && <Open16Regular aria-label="opens in a new tab" />}
        </Link>
      )
    }
    case 'optionset': {
      const option = isOptionValue(value) ? registry.getOption(attribute, value.value) : undefined
      const label = formatValue(registry, attribute, value)
      if (variant === 'grid' && option?.color) {
        return (
          <Badge appearance="tint" color={option.color} shape="rounded" className={styles.badge}>
            {label}
          </Badge>
        )
      }
      return <>{label}</>
    }
    case 'memo': {
      const text = String(value)
      if (variant === 'form') return <RichText text={text} />
      return (
        <Text className={styles.clamp} title={text}>
          {text.replace(/[*`]/g, '')}
        </Text>
      )
    }
    case 'text':
      if (attribute.format === 'email') {
        return (
          <Link href={`mailto:${String(value)}`} className={styles.external}>
            {String(value)}
          </Link>
        )
      }
      return <>{formatValue(registry, attribute, value)}</>
    default:
      return <>{formatValue(registry, attribute, value)}</>
  }
}
