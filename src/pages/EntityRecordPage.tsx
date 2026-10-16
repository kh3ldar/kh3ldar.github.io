import { registry } from '../platform/metadata'
import type { Route } from '../platform/router/routes'
import { RecordForm } from '../components/form/RecordForm'
import { RecordUnavailablePage } from './RecordUnavailablePage'

type RecordRoute = Extract<Route, { pagetype: 'entityrecord' }>

export function EntityRecordPage({ route }: { route: RecordRoute }) {
  const entity = registry.getEntity(route.etn)
  const record = registry.getRecord(route.etn, route.id)
  const form = registry.getMainForm(route.etn)
  if (!entity || !record || !form || form.formType !== 'main') return <RecordUnavailablePage route={route} />
  return <RecordForm key={`${record.etn}:${record.id}`} route={route} entity={entity} record={record} form={form} />
}
