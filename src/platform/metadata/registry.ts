import type {
  AttributeMetadata,
  BpfDefinition,
  CommandDefinition,
  DashboardDefinition,
  EntityMetadata,
  EntityRecord,
  FormDefinition,
  GagDefinition,
  MetadataBundle,
  OptionMetadata,
  OptionSetMetadata,
  SavedView,
} from '../../data/types'
import type { PageType } from '../router/routes'

/** Read-only lookups over a metadata bundle. Built once; the bundle never changes at runtime. */
export interface Registry {
  bundle: MetadataBundle
  getEntity(etn: string): EntityMetadata | undefined
  getAttribute(etn: string, name: string): AttributeMetadata | undefined
  getOptionSet(name: string): OptionSetMetadata | undefined
  getOption(attribute: AttributeMetadata, value: number): OptionMetadata | undefined
  getView(id: string): SavedView | undefined
  /** Views offered in the view selector: not hidden, default first. */
  getSelectableViews(etn: string): SavedView[]
  getDefaultView(etn: string): SavedView | undefined
  getForm(id: string): FormDefinition | undefined
  getMainForm(etn: string): FormDefinition | undefined
  getQuickCreateForm(etn: string): FormDefinition | undefined
  getRecords(etn: string): EntityRecord[]
  getRecord(etn: string, id: string): EntityRecord | undefined
  getPrimaryName(record: EntityRecord): string
  getDashboard(id?: string): DashboardDefinition | undefined
  getBpf(id: string): BpfDefinition | undefined
  getGag(id: string): GagDefinition | undefined
  getCommands(pagetype: PageType, etn?: string): CommandDefinition[]
}

function indexBy<T>(items: T[], key: (item: T) => string): Map<string, T> {
  return new Map(items.map((item) => [key(item), item]))
}

export function createRegistry(bundle: MetadataBundle): Registry {
  const entities = indexBy(bundle.entities, (e) => e.logicalName)
  const attributes = new Map(
    bundle.entities.map((e) => [e.logicalName, indexBy(e.attributes, (a) => a.logicalName)] as const),
  )
  const optionSets = indexBy(bundle.optionSets, (o) => o.name)
  const views = indexBy(bundle.views, (v) => v.id)
  const forms = indexBy(bundle.forms, (f) => f.id)
  const bpfs = indexBy(bundle.bpfs, (b) => b.id)
  const gags = indexBy(bundle.gags, (g) => g.id)
  const recordsByEtn = new Map<string, EntityRecord[]>()
  const recordIndex = new Map<string, EntityRecord>()
  for (const record of bundle.records) {
    const list = recordsByEtn.get(record.etn) ?? []
    list.push(record)
    recordsByEtn.set(record.etn, list)
    recordIndex.set(`${record.etn}:${record.id}`, record)
  }

  const registry: Registry = {
    bundle,
    getEntity: (etn) => entities.get(etn),
    getAttribute: (etn, name) => attributes.get(etn)?.get(name),
    getOptionSet: (name) => optionSets.get(name),
    getOption: (attribute, value) =>
      attribute.optionSet ? optionSets.get(attribute.optionSet)?.options.find((o) => o.value === value) : undefined,
    getView: (id) => views.get(id),
    getSelectableViews: (etn) => {
      const list = bundle.views.filter((v) => v.etn === etn && !v.hidden)
      return [...list.filter((v) => v.isDefault), ...list.filter((v) => !v.isDefault)]
    },
    getDefaultView: (etn) => {
      const entity = entities.get(etn)
      return (entity?.defaultViewId ? views.get(entity.defaultViewId) : undefined) ?? registry.getSelectableViews(etn)[0]
    },
    getForm: (id) => forms.get(id),
    getMainForm: (etn) => {
      const entity = entities.get(etn)
      return entity ? forms.get(entity.defaultFormId) : undefined
    },
    getQuickCreateForm: (etn) => {
      const entity = entities.get(etn)
      return entity?.quickCreateFormId ? forms.get(entity.quickCreateFormId) : undefined
    },
    getRecords: (etn) => recordsByEtn.get(etn) ?? [],
    getRecord: (etn, id) => recordIndex.get(`${etn}:${id}`),
    getPrimaryName: (record) => {
      const entity = entities.get(record.etn)
      const value = entity ? record.attributes[entity.primaryNameAttribute] : undefined
      return typeof value === 'string' && value ? value : record.id
    },
    getDashboard: (id) =>
      (id ? bundle.dashboards.find((d) => d.id === id) : undefined) ??
      bundle.dashboards.find((d) => d.isDefault) ??
      bundle.dashboards[0],
    getBpf: (id) => bpfs.get(id),
    getGag: (id) => gags.get(id),
    getCommands: (pagetype, etn) =>
      bundle.commands.filter((c) => c.scope.includes(pagetype) && (!c.etn || (etn !== undefined && c.etn.includes(etn)))),
  }
  return registry
}
