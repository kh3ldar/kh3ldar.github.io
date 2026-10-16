import { makeStyles, SearchBox, Text, tokens } from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import type { EntityMetadata, SavedView } from '../data/types'
import { formatValue } from '../platform/format/formatValue'
import { registry } from '../platform/metadata'
import { resolveView } from '../platform/query/resolveView'
import { getValue } from '../platform/query/values'
import type { Route } from '../platform/router/routes'
import { useUi } from '../platform/state/uiStore'
import { EntityGrid } from '../components/grid/EntityGrid'
import { ViewSelector } from '../components/grid/ViewSelector'
import { PageFrame } from '../components/shell/PageFrame'
import { RecordUnavailablePage } from './RecordUnavailablePage'

type ListRoute = Extract<Route, { pagetype: 'entitylist' }>

const useStyles = makeStyles({
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: { minWidth: 0, display: 'flex', flexDirection: 'column' },
  entity: { color: tokens.colorNeutralForeground3, paddingLeft: tokens.spacingHorizontalS },
  search: { width: '260px', maxWidth: '100%' },
  footer: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
  },
})

/** The view to show: the URL's, else the visitor's chosen default, else the system default. */
function pickView(route: ListRoute, personalDefault: string | undefined): SavedView | undefined {
  const fromUrl = route.viewid ? registry.getView(route.viewid) : undefined
  if (route.viewid) return fromUrl?.etn === route.etn ? fromUrl : undefined
  const personal = personalDefault ? registry.getView(personalDefault) : undefined
  return personal?.etn === route.etn ? personal : registry.getDefaultView(route.etn)
}

export function EntityListPage({ route }: { route: ListRoute }) {
  const personalDefault = useUi((s) => s.defaultViews[route.etn])
  const entity = registry.getEntity(route.etn)
  const view = pickView(route, personalDefault)
  if (!entity || !view) return <RecordUnavailablePage route={route} />
  const defaultViewId = personalDefault ?? registry.getDefaultView(route.etn)?.id
  return <EntityListView key={view.id} route={route} entity={entity} view={view} defaultViewId={defaultViewId} />
}

function EntityListView({
  route,
  entity,
  view,
  defaultViewId,
}: {
  route: ListRoute
  entity: EntityMetadata
  view: SavedView
  defaultViewId: string | undefined
}) {
  const styles = useStyles()
  const { messages } = registry.bundle.app
  const resolved = useMemo(() => resolveView(registry, view), [view])
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState(0)

  const rows = useMemo(() => {
    const needle = keyword.trim().toLowerCase()
    if (!needle) return resolved.rows
    return resolved.rows.filter((record) =>
      resolved.columns.some(({ attribute }) =>
        formatValue(registry, attribute, getValue(record, attribute)).toLowerCase().includes(needle),
      ),
    )
  }, [keyword, resolved])

  return (
    <PageFrame context={{ route, viewId: view.id }}>
      <section className={styles.panel} aria-label={view.name}>
        <div className={styles.header}>
          <div className={styles.title}>
            <ViewSelector etn={entity.logicalName} view={view} defaultViewId={defaultViewId} />
            <Text size={200} className={styles.entity}>
              {entity.displayCollectionName}
            </Text>
          </div>
          <SearchBox
            className={styles.search}
            placeholder={messages.filterPlaceholder}
            aria-label={messages.filterPlaceholder}
            value={keyword}
            onChange={(_, data) => setKeyword(data.value)}
          />
        </div>
        <EntityGrid resolved={resolved} rows={rows} ariaLabel={view.name} onSelectionCountChange={setSelected} />
        <div className={styles.footer}>
          <Text size={200}>
            Rows: {rows.length}
            {selected > 0 && ` (${selected} selected)`}
          </Text>
        </div>
      </section>
    </PageFrame>
  )
}
