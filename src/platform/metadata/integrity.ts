import type { CommandAction, FormSection, MetadataBundle } from '../../data/types'
import type { Route } from '../router/routes'
import { isLookupValue, isOptionValue, lookupList } from '../query/values'
import { createRegistry } from './registry'

/**
 * Cross-checks a metadata bundle: every reference resolves, every record fits its entity.
 * Returns human-readable problems; an empty list means the bundle is consistent.
 */
export function checkIntegrity(bundle: MetadataBundle): string[] {
  const registry = createRegistry(bundle)
  const problems: string[] = []
  const report = (where: string, message: string) => problems.push(`${where}: ${message}`)

  const duplicates = (kind: string, ids: string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) report(kind, `duplicate id "${id}"`)
      seen.add(id)
    }
  }
  duplicates('entities', bundle.entities.map((e) => e.logicalName))
  duplicates('views', bundle.views.map((v) => v.id))
  duplicates('forms', bundle.forms.map((f) => f.id))
  duplicates('option sets', bundle.optionSets.map((o) => o.name))
  duplicates('records', bundle.records.map((r) => `${r.etn}:${r.id}`))
  duplicates('commands', bundle.commands.map((c) => c.id))
  duplicates('gags', bundle.gags.map((g) => g.id))
  duplicates('dashboards', bundle.dashboards.flatMap((d) => [d.id, ...d.tiles.map((t) => `${d.id}/${t.id}`)]))

  const attributeExists = (where: string, etn: string, name: string) => {
    if (!registry.getAttribute(etn, name)) report(where, `unknown attribute ${etn}.${name}`)
    return registry.getAttribute(etn, name)
  }

  const checkRoute = (where: string, route: Route) => {
    if (route.pagetype === 'dashboard') {
      if (route.id && !bundle.dashboards.some((d) => d.id === route.id)) report(where, `unknown dashboard ${route.id}`)
    } else if (route.pagetype === 'entitylist') {
      if (!registry.getEntity(route.etn)) report(where, `unknown entity ${route.etn}`)
      else if (!registry.getDefaultView(route.etn)) report(where, `entity ${route.etn} has no view to list`)
      if (route.viewid && registry.getView(route.viewid)?.etn !== route.etn) report(where, `view ${route.viewid} is not a ${route.etn} view`)
    } else if (!registry.getRecord(route.etn, route.id)) {
      report(where, `unknown record ${route.etn}:${route.id}`)
    }
  }

  const checkAction = (where: string, action: CommandAction) => {
    if (action.type === 'gag' && !registry.getGag(action.gagId)) report(where, `unknown gag ${action.gagId}`)
    if (action.type === 'openQuickCreate' && !registry.getQuickCreateForm(action.etn))
      report(where, `entity ${action.etn} has no quick create form`)
    if (action.type === 'navigate') checkRoute(where, action.route)
  }

  // Entities and attributes
  for (const entity of bundle.entities) {
    const where = `entity ${entity.logicalName}`
    attributeExists(where, entity.logicalName, entity.primaryNameAttribute)
    const mainForm = registry.getForm(entity.defaultFormId)
    if (!mainForm || mainForm.etn !== entity.logicalName) report(where, `default form ${entity.defaultFormId} missing or for another entity`)
    if (entity.defaultViewId && registry.getView(entity.defaultViewId)?.etn !== entity.logicalName)
      report(where, `default view ${entity.defaultViewId} missing or for another entity`)
    if (entity.quickCreateFormId && registry.getForm(entity.quickCreateFormId)?.formType !== 'quickcreate')
      report(where, `quick create form ${entity.quickCreateFormId} missing or not a quick create form`)
    if (registry.getRecords(entity.logicalName).length && !entity.defaultViewId)
      report(where, 'has records but no default view')
    for (const attribute of entity.attributes) {
      const at = `${where}.${attribute.logicalName}`
      if (attribute.type === 'optionset' && !(attribute.optionSet && registry.getOptionSet(attribute.optionSet)))
        report(at, `unknown option set ${attribute.optionSet}`)
      if (attribute.type === 'lookup') {
        if (!attribute.targets?.length) report(at, 'lookup without targets')
        for (const target of attribute.targets ?? []) if (!registry.getEntity(target)) report(at, `unknown target ${target}`)
      }
      if (attribute.calculation) {
        attributeExists(at, entity.logicalName, attribute.calculation.start)
        attributeExists(at, entity.logicalName, attribute.calculation.end)
      }
    }
  }

  // Records
  for (const record of bundle.records) {
    const where = `record ${record.etn}:${record.id}`
    const entity = registry.getEntity(record.etn)
    if (!entity) {
      report(where, 'unknown entity')
      continue
    }
    if (!record.attributes[entity.primaryNameAttribute]) report(where, 'primary name is empty')
    for (const [name, value] of Object.entries(record.attributes)) {
      const attribute = registry.getAttribute(record.etn, name)
      if (!attribute) {
        report(where, `unknown attribute ${name}`)
        continue
      }
      if (attribute.calculation) report(where, `${name} is calculated and must not be stored`)
      if (value === null) continue
      if (attribute.type === 'optionset') {
        if (!isOptionValue(value) || !registry.getOption(attribute, value.value)) report(where, `${name} has an invalid option`)
      } else if (attribute.type === 'lookup') {
        const valid = attribute.multiple
          ? Array.isArray(value) && value.length > 0 && value.every(isLookupValue)
          : isLookupValue(value)
        if (!valid) report(where, `${name} has an invalid lookup value`)
        for (const ref of lookupList(value)) {
          if (!attribute.targets?.includes(ref.etn)) report(where, `${name} points at disallowed entity ${ref.etn}`)
          else if (!registry.getRecord(ref.etn, ref.id)) report(where, `${name} points at missing ${ref.etn}:${ref.id}`)
        }
      } else if (['text', 'memo', 'url', 'date'].includes(attribute.type) && typeof value !== 'string') {
        report(where, `${name} should be a string`)
      } else if (attribute.type === 'boolean' && typeof value !== 'boolean') {
        report(where, `${name} should be a boolean`)
      } else if (attribute.type === 'number' && typeof value !== 'number') {
        report(where, `${name} should be a number`)
      }
    }
    for (const media of record.media ?? []) if (!media.src.startsWith('/')) report(where, `media ${media.src} must be a site path`)
  }

  // Views
  for (const view of bundle.views) {
    const where = `view ${view.id}`
    if (!registry.getEntity(view.etn)) {
      report(where, `unknown entity ${view.etn}`)
      continue
    }
    if (!view.columns.length) report(where, 'has no columns')
    for (const c of view.columns) attributeExists(where, view.etn, c.attribute)
    for (const s of view.sort) attributeExists(where, view.etn, s.attribute)
    for (const f of view.filter ?? []) attributeExists(where, view.etn, f.attribute)
  }

  // Forms
  const checkSection = (where: string, etn: string, section: FormSection) => {
    if (section.kind === 'fields') {
      for (const field of section.fields) attributeExists(where, etn, field.attribute)
    } else if (section.kind === 'subgrid') {
      if (!registry.getEntity(section.etn)) report(where, `unknown subgrid entity ${section.etn}`)
      if (registry.getView(section.viewId)?.etn !== section.etn) report(where, `subgrid view ${section.viewId} is not a ${section.etn} view`)
      const rel = section.relationship
      if (rel?.kind === 'forward') {
        const attribute = attributeExists(where, etn, rel.attribute)
        if (attribute && !(attribute.type === 'lookup' && attribute.targets?.includes(section.etn)))
          report(where, `${rel.attribute} is not a lookup to ${section.etn}`)
      } else if (rel?.kind === 'reverse') {
        const attribute = attributeExists(where, section.etn, rel.attribute)
        if (attribute && !(attribute.type === 'lookup' && attribute.targets?.includes(etn)))
          report(where, `${section.etn}.${rel.attribute} is not a lookup to ${etn}`)
      }
    }
  }
  for (const form of bundle.forms) {
    const where = `form ${form.id}`
    if (!registry.getEntity(form.etn)) {
      report(where, `unknown entity ${form.etn}`)
      continue
    }
    if (form.header.length > 4) report(where, 'more than four header fields')
    for (const h of form.header) attributeExists(where, form.etn, h.attribute)
    if (!form.tabs.length) report(where, 'has no tabs')
    duplicates(`${where} tabs`, form.tabs.map((t) => t.id))
    for (const tab of form.tabs) for (const column of tab.columns) for (const section of column.sections) checkSection(`${where}/${tab.id}`, form.etn, section)
    for (const n of form.notifications ?? []) for (const c of n.when ?? []) attributeExists(where, form.etn, c.attribute)
    if (form.bpfId) {
      const bpf = registry.getBpf(form.bpfId)
      if (!bpf) report(where, `unknown business process flow ${form.bpfId}`)
      else if (bpf.etn !== form.etn) report(where, `business process flow ${bpf.id} is for ${bpf.etn}`)
    }
  }

  // Business process flows
  for (const bpf of bundle.bpfs) {
    const where = `bpf ${bpf.id}`
    if (!registry.getEntity(bpf.etn)) report(where, `unknown entity ${bpf.etn}`)
    if (bpf.stages.filter((s) => s.status === 'active').length !== 1) report(where, 'needs exactly one active stage')
    checkAction(where, bpf.finish.action)
  }

  // Sitemap
  duplicates('sitemap areas', bundle.sitemap.areas.map((a) => a.id))
  duplicates('sitemap subareas', bundle.sitemap.areas.flatMap((a) => a.groups.flatMap((g) => g.subareas.map((s) => s.id))))
  for (const area of bundle.sitemap.areas)
    for (const group of area.groups) for (const sub of group.subareas) checkRoute(`subarea ${sub.id}`, sub.route)

  // Dashboards
  if (!bundle.dashboards.length) report('dashboards', 'none defined')
  for (const dashboard of bundle.dashboards) {
    for (const tile of dashboard.tiles) {
      const where = `tile ${dashboard.id}/${tile.id}`
      if (tile.kind === 'chart') {
        if (!registry.getEntity(tile.etn)) report(where, `unknown entity ${tile.etn}`)
        attributeExists(where, tile.etn, tile.groupBy)
        if (tile.measure) attributeExists(where, tile.etn, tile.measure)
        for (const f of tile.filter ?? []) attributeExists(where, tile.etn, f.attribute)
      } else if (tile.kind === 'kpi' && tile.source.type === 'aggregate') {
        const source = tile.source
        if (!registry.getEntity(source.etn)) report(where, `unknown entity ${source.etn}`)
        if (source.measure) attributeExists(where, source.etn, source.measure)
        for (const f of source.filter ?? []) attributeExists(where, source.etn, f.attribute)
      } else if (tile.kind === 'list') {
        if (registry.getView(tile.viewId)?.etn !== tile.etn) report(where, `view ${tile.viewId} is not a ${tile.etn} view`)
      } else if (tile.kind === 'webresource') {
        for (const a of tile.actions ?? []) checkAction(where, a.action)
      }
    }
  }

  // App
  checkRoute('app profileRoute', bundle.app.profileRoute)

  // Commands and gags
  for (const command of bundle.commands) checkAction(`command ${command.id}`, command.action)
  for (const gag of bundle.gags) if (gag.primary) checkAction(`gag ${gag.id}`, gag.primary.action)

  return problems
}
