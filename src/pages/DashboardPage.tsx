import {
  makeStyles,
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'
import type { DashboardTile } from '../data/types'
import { registry } from '../platform/metadata'
import { navigate } from '../platform/router/history'
import type { Route } from '../platform/router/routes'
import { ChartTile, KpiTile, ListTile, WebResourceTile } from '../components/dashboard/tiles'
import { PageFrame } from '../components/shell/PageFrame'
import { RecordUnavailablePage } from './RecordUnavailablePage'

type DashboardRoute = Extract<Route, { pagetype: 'dashboard' }>

const useStyles = makeStyles({
  title: { fontSize: tokens.fontSizeBase500, fontWeight: tokens.fontWeightSemibold, paddingLeft: tokens.spacingHorizontalXS, alignSelf: 'flex-start' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 1199px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '@media (max-width: 639px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
  span1: { gridColumn: 'span 1' },
  span2: { gridColumn: 'span 2', '@media (max-width: 639px)': { gridColumn: 'span 1' } },
  span4: {
    gridColumn: 'span 4',
    '@media (max-width: 1199px)': { gridColumn: 'span 2' },
    '@media (max-width: 639px)': { gridColumn: 'span 1' },
  },
})

function TileView({ tile }: { tile: DashboardTile }) {
  switch (tile.kind) {
    case 'kpi':
      return <KpiTile tile={tile} />
    case 'chart':
      return <ChartTile tile={tile} />
    case 'list':
      return <ListTile tile={tile} />
    case 'webresource':
      return <WebResourceTile tile={tile} />
  }
}

export function DashboardPage({ route }: { route: DashboardRoute }) {
  const styles = useStyles()
  const dashboard = registry.getDashboard(route.id)
  if (!dashboard) return <RecordUnavailablePage route={route} />
  const spanClass = (span = 1) => (span >= 4 ? styles.span4 : span >= 2 ? styles.span2 : styles.span1)

  return (
    <PageFrame context={{ route }}>
      <Menu
        checkedValues={{ dashboard: [dashboard.id] }}
        onCheckedValueChange={(_, data) => {
          const id = data.checkedItems[0]
          if (id && id !== dashboard.id) navigate({ pagetype: 'dashboard', id })
        }}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="transparent" size="large" className={styles.title}>
            {dashboard.name}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {registry.bundle.dashboards.map((d) => (
              <MenuItemRadio key={d.id} name="dashboard" value={d.id}>
                {d.name}
              </MenuItemRadio>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
      <div className={styles.grid}>
        {dashboard.tiles.map((tile) => (
          <div key={tile.id} className={mergeClasses(spanClass(tile.span))}>
            <TileView tile={tile} />
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
