/**
 * The site's "Dataverse" schema. Everything the app shows is described by
 * values of these types under src/data; components only interpret them.
 */
import type { PageType, Route } from '../platform/router/routes'

/** Icon names data may use. src/components/common/icons.tsx maps every one to a Fluent icon. */
export type IconName =
  | 'home'
  | 'dashboard'
  | 'contact'
  | 'account'
  | 'position'
  | 'project'
  | 'skill'
  | 'certification'
  | 'education'
  | 'lead'
  | 'add'
  | 'download'
  | 'refresh'
  | 'share'
  | 'delete'
  | 'flow'
  | 'report'
  | 'excel'
  | 'assign'
  | 'back'
  | 'mail'
  | 'link'
  | 'code'
  | 'settings'
  | 'info'
  | 'apps'
  | 'video'
  | 'open'

export type BadgeColor = 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning'

// ---------------------------------------------------------------- metadata

export type AttributeType = 'text' | 'memo' | 'date' | 'optionset' | 'lookup' | 'url' | 'number' | 'boolean'

/**
 * monthyear/year apply to dates ("Mar 2024", "2011"); email renders text as a
 * mailto link; integer/decimal shape numbers.
 */
export type AttributeFormat = 'monthyear' | 'year' | 'email' | 'integer' | 'decimal'

/** A calculated column. monthsBetween counts calendar months inclusively; an empty end means "now". */
export interface Calculation {
  type: 'monthsBetween'
  start: string
  end: string
}

export interface AttributeMetadata {
  logicalName: string
  displayName: string
  type: AttributeType
  /** optionset: key into the option sets. */
  optionSet?: string
  /** lookup: entities the lookup may point at. */
  targets?: string[]
  /** lookup: holds several references (an N:N in disguise). */
  multiple?: boolean
  format?: AttributeFormat
  /** How an empty value reads, e.g. "Present" for an open end date. Empty dates with a nullLabel sort as ongoing. */
  nullLabel?: string
  /** boolean: labels for [false, true], like a two-option column. */
  booleanLabels?: [string, string]
  calculation?: Calculation
  /** Included in global search. The primary name attribute always is. */
  searchable?: boolean
  /** Shown as a tooltip on the field label. */
  description?: string
}

export interface EntityMetadata {
  logicalName: string
  displayName: string
  displayCollectionName: string
  primaryNameAttribute: string
  icon: IconName
  /** Record header image: initials for people and companies, the table icon otherwise. */
  recordImage?: 'initials' | 'icon'
  attributes: AttributeMetadata[]
  /** Entities without records (lead) need no view. */
  defaultViewId?: string
  defaultFormId: string
  quickCreateFormId?: string
}

export interface OptionMetadata {
  value: number
  label: string
  /** Shown as a badge in grids when set. */
  color?: BadgeColor
}

export interface OptionSetMetadata {
  name: string
  options: OptionMetadata[]
}

// ---------------------------------------------------------------- records

export interface LookupValue {
  etn: string
  id: string
}

export interface OptionValue {
  value: number
}

export type AttributeValue = string | number | boolean | null | OptionValue | LookupValue | LookupValue[]

export interface TimelinePost {
  id: string
  /** auto = system post ("Position created by …"), post = a regular post, note = a note. */
  kind: 'post' | 'note' | 'auto'
  title: string
  body?: string
  /** ISO date or YYYY-MM. Undated posts show no date rather than an invented one. */
  date?: string
}

export interface MediaItem {
  kind: 'video' | 'image'
  src: string
  caption: string
  poster?: string
}

export interface EntityRecord {
  id: string
  etn: string
  attributes: Record<string, AttributeValue>
  timeline?: TimelinePost[]
  media?: MediaItem[]
}

// ---------------------------------------------------------------- views

export type FilterOperator = 'eq' | 'ne' | 'in' | 'contains' | 'null' | 'notnull'

/** For optionsets compare the option value; for lookups compare the record id. */
export interface FilterCondition {
  attribute: string
  operator: FilterOperator
  value?: string | number | boolean | Array<string | number>
}

export interface ViewColumn {
  attribute: string
  /** Ideal width in px. */
  width?: number
}

export interface SortOrder {
  attribute: string
  direction: 'asc' | 'desc'
}

export interface SavedView {
  id: string
  etn: string
  name: string
  isDefault?: boolean
  /** Subgrid-only views stay out of the view selector. */
  hidden?: boolean
  columns: ViewColumn[]
  sort: SortOrder[]
  /** Conditions are AND-ed. */
  filter?: FilterCondition[]
}

// ---------------------------------------------------------------- forms

/**
 * forward: the form record's lookup attribute lists the related records.
 * reverse: records of the subgrid entity whose lookup attribute points at the form record.
 */
export type Relationship = { kind: 'forward'; attribute: string } | { kind: 'reverse'; attribute: string }

export interface FormField {
  attribute: string
  label?: string
  hideLabel?: boolean
  /** Quick create forms only. */
  required?: boolean
  placeholder?: string
}

export type FormSection =
  | {
      kind: 'fields'
      id: string
      label: string
      hideLabel?: boolean
      /** Drop the whole section when every field in it is empty. */
      hideWhenEmpty?: boolean
      fields: FormField[]
    }
  | {
      kind: 'subgrid'
      id: string
      label: string
      etn: string
      viewId: string
      /** Without a relationship the subgrid shows the whole view. */
      relationship?: Relationship
    }
  | { kind: 'timeline'; id: string; label: string }
  | { kind: 'media'; id: string; label: string; emptyText?: string }

export interface FormColumn {
  /** Relative width (fr units). */
  width?: number
  sections: FormSection[]
}

export interface FormTab {
  id: string
  label: string
  columns: FormColumn[]
}

export interface FormNotification {
  intent: 'info' | 'warning' | 'error' | 'success'
  text: string
  /** Shown only when the record matches. */
  when?: FilterCondition[]
}

export interface FormDefinition {
  id: string
  etn: string
  name: string
  formType: 'main' | 'quickcreate'
  /** Up to four header fields. */
  header: { attribute: string }[]
  tabs: FormTab[]
  bpfId?: string
  notifications?: FormNotification[]
}

// ---------------------------------------------------------------- app chrome

export interface SubArea {
  id: string
  label: string
  icon: IconName
  route: Route
}

export interface SiteMapGroup {
  id: string
  label: string
  subareas: SubArea[]
}

export interface SiteMapArea {
  id: string
  label: string
  icon: IconName
  groups: SiteMapGroup[]
}

export interface SiteMapDefinition {
  areas: SiteMapArea[]
}

export type CommandAction =
  | { type: 'downloadFile'; href: string; fileName: string }
  | { type: 'openUrl'; href: string }
  | { type: 'navigate'; route: Route }
  | { type: 'back' }
  | { type: 'refresh' }
  | { type: 'share' }
  | { type: 'exportExcel' }
  | { type: 'openQuickCreate'; etn: string }
  | { type: 'openDialog'; dialog: 'personalization' | 'about' }
  | { type: 'gag'; gagId: string }

export interface CommandDefinition {
  id: string
  label: string
  icon: IconName
  action: CommandAction
  scope: PageType[]
  /** Limit to these entities (list and record pages). */
  etn?: string[]
  /** Starts in the "…" overflow menu. */
  overflow?: boolean
}

/** A dialog that looks like a platform error. {entity}, {entities} and {record} are filled in. */
export interface GagDefinition {
  id: string
  title: string
  message: string
  errorCode?: string
  /** Offers "Download log file". */
  showLog?: boolean
  primary?: { label: string; action: CommandAction }
}

export interface BpfStep {
  label: string
  value: string
}

export interface BpfStage {
  id: string
  label: string
  status: 'completed' | 'active'
  caption?: string
  steps: BpfStep[]
}

export interface BpfDefinition {
  id: string
  name: string
  etn: string
  caption?: string
  stages: BpfStage[]
  finish: { label: string; action: CommandAction }
}

// ---------------------------------------------------------------- dashboards

export type AggregateKind = 'count' | 'sum' | 'max'

export type KpiSource =
  | { type: 'static'; value: string }
  | {
      type: 'aggregate'
      etn: string
      aggregate: AggregateKind
      measure?: string
      filter?: FilterCondition[]
      /** Multiply the result (1/12 turns months into years). */
      scale?: number
      decimals?: number
      suffix?: string
    }

export interface TileAction {
  label: string
  icon: IconName
  action: CommandAction
  appearance?: 'primary' | 'secondary'
}

export type DashboardTile =
  | { kind: 'kpi'; id: string; title: string; caption?: string; source: KpiSource; span?: number }
  | {
      kind: 'chart'
      id: string
      title: string
      /** Horizontal bars, one series. */
      chart: 'bar'
      etn: string
      groupBy: string
      aggregate: AggregateKind
      measure?: string
      filter?: FilterCondition[]
      /** Axis or legend unit, e.g. "months". */
      unit?: string
      span?: number
    }
  | { kind: 'list'; id: string; title: string; etn: string; viewId: string; maxRows?: number; span?: number }
  /** A "web resource" tile: short Markdown text with buttons. */
  | { kind: 'webresource'; id: string; title: string; content: string; actions?: TileAction[]; span?: number }

export interface DashboardDefinition {
  id: string
  name: string
  isDefault?: boolean
  tiles: DashboardTile[]
}

// ---------------------------------------------------------------- app

export interface AppDefinition {
  appId: string
  appName: string
  ownerName: string
  ownerTitle: string
  /** The owner's own record, opened from the profile menu. */
  profileRoute: Route
  helpUrl: string
  /** Minutes without input before the session-expiry dialog. */
  idleMinutes: number
  contact: {
    email: string
    linkedin: string
    github: string
    cvHref: string
    cvFileName: string
    /** {subject}, {fullname}, {companyname}, {emailaddress1}, {description} are filled from the lead form. */
    mailSubjectTemplate: string
    mailBodyTemplate: string
    cardTitle: string
    cardBody: string
  }
  launcher: {
    title: string
    apps: { label: string; description: string; icon: IconName; href: string; current?: boolean }[]
  }
  messages: {
    linkCopied: string
    linkCopyFailed: string
    /** {count} and {entities}. */
    exported: string
    exportEmpty: string
    requiredField: string
    invalidEmail: string
    working: string
    noData: string
    readOnlyField: string
    emptyValue: string
    searchPlaceholder: string
    searchNoResults: string
    filterPlaceholder: string
    recordUnavailableTitle: string
    recordUnavailableBody: string
    setDefaultView: string
    defaultViewSaved: string
    signOutToast: string
    emailCopied: string
  }
  session: { title: string; body: string; continueLabel: string; signOutLabel: string }
  about: { title: string; lines: { label: string; value: string }[] }
  personalization: {
    title: string
    themeLabel: string
    themeOptions: { system: string; light: string; dark: string }
    languageLabel: string
    languageValue: string
    languageNote: string
  }
  /** Body of the "Download log file" text: {title}, {message}, {errorCode}, {activityId}, {timestamp}, {location}. */
  errorLogTemplate: string
}

export interface MetadataBundle {
  app: AppDefinition
  entities: EntityMetadata[]
  optionSets: OptionSetMetadata[]
  views: SavedView[]
  forms: FormDefinition[]
  records: EntityRecord[]
  sitemap: SiteMapDefinition
  dashboards: DashboardDefinition[]
  commands: CommandDefinition[]
  gags: GagDefinition[]
  bpfs: BpfDefinition[]
}
