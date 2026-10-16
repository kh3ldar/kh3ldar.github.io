import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  makeStyles,
  MessageBar,
  MessageBarBody,
  mergeClasses,
  Tab,
  TabList,
  tokens,
} from '@fluentui/react-components'
import type { CSSProperties } from 'react'
import type { EntityMetadata, EntityRecord, FormDefinition, FormSection } from '../../data/types'
import { registry } from '../../platform/metadata'
import { navigate } from '../../platform/router/history'
import { routeClickHandler } from '../../platform/router/clicks'
import { buildHref, type Route } from '../../platform/router/routes'
import { matchesAll } from '../../platform/query/filter'
import { ProcessBar } from '../bpf/ProcessBar'
import { PageFrame } from '../shell/PageFrame'
import { FieldSection } from './FieldSection'
import { FormHeader } from './FormHeader'
import { MediaSection } from './MediaSection'
import { SubGrid } from './SubGrid'
import { Timeline } from './Timeline'

type RecordRoute = Extract<Route, { pagetype: 'entityrecord' }>

const useStyles = makeStyles({
  breadcrumb: { marginLeft: `calc(-1 * ${tokens.spacingHorizontalS})` },
  tabs: { borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, overflowX: 'auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'var(--ch-form-columns)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'start',
  },
  collapse2: { '@media (max-width: 900px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  collapse3: { '@media (max-width: 1180px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  column: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalM, minWidth: 0 },
})

function SectionView({ section, record }: { section: FormSection; record: EntityRecord }) {
  switch (section.kind) {
    case 'fields':
      return <FieldSection section={section} record={record} />
    case 'subgrid':
      return <SubGrid section={section} record={record} />
    case 'timeline':
      return <Timeline label={section.label} record={record} />
    case 'media':
      return <MediaSection label={section.label} record={record} emptyText={section.emptyText} />
  }
}

/** A main form: notifications, header, business process flow, tabs, and a column layout per tab. */
export function RecordForm({
  route,
  entity,
  record,
  form,
}: {
  route: RecordRoute
  entity: EntityMetadata
  record: EntityRecord
  form: FormDefinition
}) {
  const styles = useStyles()
  const tab = form.tabs.find((t) => t.id === route.tabid) ?? form.tabs[0]
  const bpf = form.bpfId ? registry.getBpf(form.bpfId) : undefined
  const notifications = (form.notifications ?? []).filter((n) => matchesAll(registry, record, n.when))
  const listRoute: Route = { pagetype: 'entitylist', etn: entity.logicalName }
  const columns = tab.columns.filter((c) => c.sections.length > 0 || tab.columns.length > 1)
  const template = columns.map((c) => `minmax(0, ${c.width ?? 1}fr)`).join(' ')

  return (
    <PageFrame context={{ route }}>
      {notifications.map((n) => (
        <MessageBar key={n.text} intent={n.intent} layout="multiline">
          <MessageBarBody>{n.text}</MessageBarBody>
        </MessageBar>
      ))}
      {entity.defaultViewId && (
        <Breadcrumb aria-label="Breadcrumb" size="small" className={styles.breadcrumb}>
          <BreadcrumbItem>
            <BreadcrumbButton href={buildHref(listRoute)} onClick={routeClickHandler(listRoute)}>
              {entity.displayCollectionName}
            </BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>{registry.getPrimaryName(record)}</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      )}
      <FormHeader entity={entity} record={record} form={form} />
      {bpf && <ProcessBar bpf={bpf} context={{ route }} />}
      {form.tabs.length > 1 && (
        <TabList
          className={styles.tabs}
          selectedValue={tab.id}
          onTabSelect={(_, data) => navigate({ ...route, tabid: String(data.value) }, { replace: true })}
        >
          {form.tabs.map((t) => (
            <Tab key={t.id} value={t.id}>
              {t.label}
            </Tab>
          ))}
        </TabList>
      )}
      <div
        role="tabpanel"
        aria-label={tab.label}
        className={mergeClasses(styles.grid, columns.length >= 3 ? styles.collapse3 : styles.collapse2)}
        style={{ '--ch-form-columns': template } as CSSProperties}
      >
        {columns.map((column, index) => (
          <div key={index} className={styles.column}>
            {column.sections.map((section) => (
              <SectionView key={section.id} section={section} record={record} />
            ))}
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
