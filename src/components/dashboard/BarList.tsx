import { makeStyles, Text, tokens, Tooltip } from '@fluentui/react-components'
import type { GroupedValue } from '../../platform/query/aggregate'
import { RouteLink } from '../../platform/router/RouteLink'

/**
 * A horizontal bar chart in plain HTML: one series, one colour, value labels at
 * the bar ends, no gridlines. Rows are the hover/focus target, so the hit area
 * is far larger than the 16px mark. Lookup groups link to their record.
 */
const useStyles = makeStyles({
  list: { display: 'flex', flexDirection: 'column', rowGap: '4px', margin: 0, padding: 0, listStyle: 'none' },
  row: {
    display: 'grid',
    gridTemplateColumns: 'minmax(84px, 32%) minmax(0, 1fr)',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    minHeight: '32px',
    borderRadius: tokens.borderRadiusMedium,
    ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover },
    ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '1px' },
  },
  label: {
    textAlign: 'right',
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    height: '32px',
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  bar: { height: '16px', borderRadius: '0 4px 4px 0', minWidth: '2px', flexShrink: 0 },
  value: { color: tokens.colorNeutralForeground1, fontWeight: tokens.fontWeightSemibold },
  unit: { display: 'block', color: tokens.colorNeutralForeground3, textAlign: 'right', marginTop: tokens.spacingVerticalXS },
})

export interface BarListProps {
  label: string
  data: GroupedValue[]
  unit?: string
  color: string
}

export function BarList({ label, data, unit, color }: BarListProps) {
  const styles = useStyles()
  const max = Math.max(1, ...data.map((d) => d.value))
  const suffix = unit ? ` ${unit}` : ''
  return (
    <figure style={{ margin: 0 }}>
      <ul className={styles.list} aria-label={label}>
        {data.map((d) => {
          const text = `${d.label}: ${d.value}${suffix}`
          return (
            <Tooltip key={d.key} content={text} relationship="description" positioning="above" withArrow>
              <li className={styles.row} tabIndex={0} aria-label={text}>
                <span className={styles.label} title={d.label}>
                  {d.record ? (
                    <RouteLink route={{ pagetype: 'entityrecord', etn: d.record.etn, id: d.record.id }}>{d.label}</RouteLink>
                  ) : (
                    d.label
                  )}
                </span>
                <span className={styles.track} aria-hidden>
                  <span className={styles.bar} style={{ width: `calc((100% - 48px) * ${d.value / max})`, backgroundColor: color }} />
                  <span className={styles.value}>{d.value}</span>
                </span>
              </li>
            </Tooltip>
          )
        })}
      </ul>
      {unit && (
        <Text as="p" size={200} className={styles.unit}>
          {unit[0].toUpperCase() + unit.slice(1)}
        </Text>
      )}
    </figure>
  )
}
