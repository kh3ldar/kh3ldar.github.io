import {
  Button,
  Card,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  ToggleButton,
  tokens,
  Tooltip,
} from '@fluentui/react-components'
import { DataBarHorizontal20Regular, TableSimple20Regular } from '@fluentui/react-icons'
import { useMemo, useState, type ReactNode } from 'react'
import type { DashboardTile } from '../../data/types'
import { executeAction } from '../../platform/commands/execute'
import { registry } from '../../platform/metadata'
import { RouteLink } from '../../platform/router/RouteLink'
import { aggregate, groupAggregate, type GroupedValue } from '../../platform/query/aggregate'
import { resolveView } from '../../platform/query/resolveView'
import { chartSeriesColor, useResolvedTheme } from '../../theme/themes'
import { Icon } from '../common/icons'
import { RichText } from '../common/RichText'
import { EntityGrid } from '../grid/EntityGrid'
import { BarList } from './BarList'

const useStyles = makeStyles({
  card: { height: '100%', boxSizing: 'border-box', rowGap: tokens.spacingVerticalM, minWidth: 0 },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, minHeight: '32px' },
  title: { margin: 0 },
  kpiValue: { fontSize: '40px', lineHeight: '48px', fontWeight: tokens.fontWeightSemibold, letterSpacing: '-0.5px' },
  caption: { color: tokens.colorNeutralForeground3 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  welcome: { maxWidth: '900px' },
  chartBox: { minHeight: '120px' },
})

function TileFrame({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const styles = useStyles()
  return (
    <Card className={styles.card} appearance="filled" role="region" aria-label={title}>
      <div className={styles.head}>
        <Text as="h2" weight="semibold" size={400} className={styles.title}>
          {title}
        </Text>
        {actions}
      </div>
      {children}
    </Card>
  )
}

type Tile<K extends DashboardTile['kind']> = Extract<DashboardTile, { kind: K }>

export function KpiTile({ tile }: { tile: Tile<'kpi'> }) {
  const styles = useStyles()
  const source = tile.source
  let value: string
  if (source.type === 'static') {
    value = source.value
  } else {
    const raw = aggregate(registry, source) * (source.scale ?? 1)
    value = raw.toLocaleString('en-US', { maximumFractionDigits: source.decimals ?? 0, minimumFractionDigits: source.decimals ?? 0 }) + (source.suffix ?? '')
  }
  return (
    <TileFrame title={tile.title}>
      <Text className={styles.kpiValue}>{value}</Text>
      {tile.caption && (
        <Text size={200} className={styles.caption}>
          {tile.caption}
        </Text>
      )}
    </TileFrame>
  )
}

function GroupTable({ data, label, unit }: { data: GroupedValue[]; label: string; unit?: string }) {
  return (
    <Table size="small" aria-label={label}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>{label}</TableHeaderCell>
          <TableHeaderCell>{unit ? unit[0].toUpperCase() + unit.slice(1) : 'Value'}</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d) => (
          <TableRow key={d.key}>
            <TableCell>{d.label}</TableCell>
            <TableCell>{d.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ChartTile({ tile }: { tile: Tile<'chart'> }) {
  const styles = useStyles()
  const theme = useResolvedTheme()
  const [asTable, setAsTable] = useState(false)
  const data = useMemo(() => groupAggregate(registry, tile), [tile])
  const groupLabel = registry.getAttribute(tile.etn, tile.groupBy)?.displayName ?? tile.groupBy

  return (
    <TileFrame
      title={tile.title}
      actions={
        <Tooltip content={asTable ? 'Show chart' : 'Show as table'} relationship="label">
          <ToggleButton
            appearance="subtle"
            size="small"
            checked={asTable}
            icon={asTable ? <DataBarHorizontal20Regular /> : <TableSimple20Regular />}
            onClick={() => setAsTable((v) => !v)}
          />
        </Tooltip>
      }
    >
      <div className={styles.chartBox}>
        {asTable ? (
          <GroupTable data={data} label={groupLabel} unit={tile.unit} />
        ) : (
          <BarList label={tile.title} data={data} unit={tile.unit} color={chartSeriesColor[theme]} />
        )}
      </div>
    </TileFrame>
  )
}

export function ListTile({ tile }: { tile: Tile<'list'> }) {
  const view = registry.getView(tile.viewId)
  const resolved = useMemo(() => (view ? resolveView(registry, view) : undefined), [view])
  if (!resolved) return null
  const listRoute = { pagetype: 'entitylist', etn: tile.etn, viewid: view?.hidden ? undefined : view?.id } as const
  return (
    <TileFrame title={tile.title} actions={<RouteLink route={listRoute}>View all</RouteLink>}>
      <EntityGrid resolved={resolved} compact maxRows={tile.maxRows} ariaLabel={tile.title} />
    </TileFrame>
  )
}

export function WebResourceTile({ tile }: { tile: Tile<'webresource'> }) {
  const styles = useStyles()
  return (
    <TileFrame title={tile.title}>
      <RichText text={tile.content} className={styles.welcome} />
      {tile.actions && (
        <div className={styles.actions}>
          {tile.actions.map((a) => (
            <Button
              key={a.label}
              appearance={a.appearance ?? 'secondary'}
              icon={<Icon name={a.icon} />}
              onClick={() => void executeAction(a.action, { route: { pagetype: 'dashboard' } })}
            >
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </TileFrame>
  )
}
