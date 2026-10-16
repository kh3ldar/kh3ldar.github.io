import type { EntityRecord } from '../types'

/**
 * Memo fields accept a small Markdown subset: paragraphs, "- " bullets,
 * **bold**, `code`, [links](https://…) and ``` fenced blocks.
 * Public project text is condensed from each repository's README.
 */
export const projectRecords: EntityRecord[] = [
  {
    id: 'productgrid',
    etn: 'project',
    attributes: {
      name: 'ProductGrid',
      tagline: 'View-driven editable grid for Dynamics 365',
      typecode: { value: 1 },
      statuscode: { value: 1 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/ProductGrid',
      publishedon: '2026-07-15',
      license: 'MIT',
      stack: 'TypeScript 5.8 (strict) · React 16.14 · Fluent UI 8 · SheetJS · PCF · webpack 5',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'fluent-ui' },
        { etn: 'skill', id: 'dataverse-web-api' },
        { etn: 'skill', id: 'fetchxml' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'A view-driven PCF grid for Dynamics 365 / Dataverse, replacing the stock subgrid where the platform offers no client-side extension point. Columns come from a saved view, resolved from Dataverse metadata at runtime.\n\n' +
        'Which view, which child entity, which buttons appear, which fields are editable, and what has to be true before a write lands are a JSON entry per parent entity, not a code change. English and Turkish localized.',
      features:
        '- **Validation before the write, not after.** Rules compare the changed value, another field on the row, a field on a related record reached through a lookup, or a constant. The bad value never reaches the server.\n' +
        '- **Delete guards.** Scoped to "this would delete the last remaining line", and gated on the parent record if needed.\n' +
        '- **A command bar that calls your code.** New, Edit, Delete, Refresh and Export are configurable per entity. Export writes a real .xlsx via SheetJS. Custom buttons call functions from D365 web resources.\n' +
        '- **Variants.** One parent entity picks a different view, form and button set from the value of one of its own fields.\n' +
        '- **Editing, as table stakes.** Typed renderers per column type, optimistic updates, and rollback to the last known-good value on failure.',
      problem:
        'Dynamics ships an editable grid, and it edits inline perfectly well. That was never the problem. The problem is that there is nowhere to put client-side logic.\n\n' +
        "- **Business rules** only fire when the conditional column is also on the grid, and they don't cross tables.\n" +
        '- **Editable-grid JavaScript events** belong to the classic Editable Grid, which is deprecated in favour of the Power Apps grid control.\n' +
        '- **The Power Apps grid customizer API** swaps the cell renderer and must stay pure. It is a rendering hook, not a behaviour hook.\n\n' +
        'That leaves a plugin, with a server round-trip and a generic error after the fact, or hand-written script per entity. So this control owns the render path. Once the grid is yours, "quantity may not exceed the available stock" is a JSON entry instead of a fork.',
      highlights:
        '**Validation rules are data.** `ValidationService` evaluates a small declarative grammar, `{ lhs, operator, rhs }`, where each operand is the changed value, a row field, a related field reached through a lookup, or a constant. Related records are pre-fetched in parallel and de-duplicated.\n\n' +
        '**Everything that varies per entity is JSON.** `entities.json`, `buttons.json` and `fields.json` declare it; `ConfigService` resolves them at runtime, including variant selection from the parent record.\n\n' +
        '**Renderer registry, not a switch.** Dataverse `AttributeType` maps to a renderer, editability and sortability. Unmapped types degrade to read-only rather than throwing.\n\n' +
        "**Views are read, not reimplemented.** `ViewService` reads the saved view's FetchXML and LayoutXML and resolves each column's metadata, so the view stays the source of truth.\n\n" +
        "**Metadata straight from the Web API.** PCF's `getEntityMetadata()` returns an unreliable attribute collection, so `MetadataService` calls the Web API directly behind a TTL cache.\n\n" +
        '**PATCH logic lives in exactly one place.** One handler owns optimistic UI and the rollback baseline; one owns every write and its errors. Keeping them apart is what keeps rollback correct.',
      architecture:
        '```\n' +
        'index.ts                    PCF entry: reads form context, mounts React\n' +
        '└── GridErrorBoundary       a render crash degrades, not blanks\n' +
        '    └── ViewDrivenGrid      orchestrator: services, state, save/delete, command bar\n' +
        '        ├── command-bar/    button assembly, selection gating, custom dispatch\n' +
        '        ├── GridRow         row shell: saving shimmer, saved/error banners\n' +
        '        │   └── GridCell\n' +
        '        │       └── renderers/   one per Dataverse AttributeType\n' +
        '        └── FieldPopoverWrapper  hover callout with copy-to-clipboard\n' +
        '```\n\n' +
        'Services are constructed once and passed to renderers by props: `ViewService`, `MetadataService`, `OptionSetService`, `ConfigService`, `ValidationService`, `CacheService`, `LoggingService` and `WebResourceLoader`.\n\n' +
        'The control sits on a form where a subgrid would normally go, and reads its parent from `context.page`. Full write-up in the [README](https://github.com/kh3ldar/ProductGrid#readme).',
    },
    media: [
      {
        kind: 'video',
        src: '/media/productgrid-demo.mp4',
        caption:
          'The grid in use: inline editing from the form, config-driven validation on the way to the server, and a command bar assembled per entity.',
      },
    ],
  },
  {
    id: 'productaddgrid',
    etn: 'project',
    attributes: {
      name: 'ProductAddGrid',
      tagline: 'Multi-entity product entry dialog',
      typecode: { value: 1 },
      statuscode: { value: 1 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/ProductAddGrid',
      publishedon: '2026-07-15',
      license: 'MIT',
      stack: 'TypeScript 5.8 (strict) · React 16.14 · Fluent UI 8 · PCF · Custom Pages · webpack 5',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'fluent-ui' },
        { etn: 'skill', id: 'dataverse-web-api' },
        { etn: 'skill', id: 'fetchxml' },
        { etn: 'skill', id: 'plugins-custom-apis' },
        { etn: 'skill', id: 'power-fx' },
        { etn: 'skill', id: 'javascript' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'A configurable PCF control for adding products to Dataverse records (opportunities, quotes, orders, or any custom table) from one multi-tab dialog. Built as an extended replica of the out-of-the-box Enhanced Product Add Grid experience.\n\n' +
        'It is hosted on a Custom Page and opened as a dialog, which is what lets one control serve every parent entity. Supporting a new parent entity is a JSON entry, not a code change.',
      features:
        'The dialog stages products in memory and writes nothing until the basket is committed in one save.\n\n' +
        '- **Catalog tab.** Search by name or code, filter by configured categories, page through results, and edit quantity inline. Rows stage themselves once their required fields are filled.\n' +
        "- **Write-in tab.** Products that aren't in the catalog. The grid grows a blank row as you fill the last one.\n" +
        '- **Product requests tab.** Price or acquisition requests through a Dataverse Custom API.\n' +
        '- **Staging that survives a reload.** The basket persists to localStorage, debounced, with a 7-day TTL.',
      problem: null,
      highlights:
        '**Entity-agnostic by construction.** No per-entity branching in the components. `entities.config.json` declares the parent entity, its detail entity, the views and the field mappings; `ConfigService` resolves the rest.\n\n' +
        '**Suffix matching for publisher prefixes.** Config names fields without a prefix, so `quantity` matches `crcad_quantity` or `emd_quantity` alike, and the same config survives different publishers.\n\n' +
        '**Two-layer config with explicit failure.** Global defaults, and per-entity mappings that inherit from them. Setting a field to `null` opts out. Missing config raises instead of falling back silently.\n\n' +
        '**Metadata-driven columns.** `ColumnService` reads saved-query and attribute metadata at runtime to resolve display names, types and option sets.\n\n' +
        '**Entity variants.** One entity can carry several configs picked by a runtime key, so a price request and an acquisition order get different views and rules without a second entry.\n\n' +
        '**Declarative business rules.** Auto-set rules at staging and field conversions at save are config, including wildcard matches and copy-through values.',
      architecture:
        '```\n' +
        'index.ts                          PCF entry point: parses inputs, exposes outputs\n' +
        '└── ProductAddGrid.tsx            StagingProvider wrapper\n' +
        '    └── ProductAddGridContainer   orchestrator: tabs, save, toasts, conditional fields\n' +
        '        ├── CatalogTabManager     ─┐\n' +
        '        ├── WriteInTabManager      ├─ extend BaseTabManager\n' +
        '        └── ProductRequestsManager ─┘\n' +
        '```\n\n' +
        'The control is not placed on a form. A ribbon or form script opens a Custom Page as a dialog, and the page binds the inputs and closes on a signal:\n\n' +
        '```\n' +
        'Ribbon / form button\n' +
        "   │  Xrm.Navigation.navigateTo({ pageType: 'custom', ... }, { target: 2 })\n" +
        '   ▼\n' +
        'Custom Page  ──binds──►  PCF inputs   (parentEntityName, parentRecordId)\n' +
        '   ▲                     PCF outputs  (dataOutput, dialogAction)\n' +
        '   │  If(ProductAddGrid.dialogAction = "close", Back())\n' +
        '   └── closes\n' +
        '```\n\n' +
        'Services: `ConfigService`, `DataService`, `RecordOperationsService`, `ProductQueryService` (FetchXML search), `ColumnService`, `MetadataService`, `CustomApiService`, `StagingPersistenceService`, `CacheService` and `LocalizationService`. Full write-up in the [README](https://github.com/kh3ldar/ProductAddGrid#readme).',
    },
    media: [
      {
        kind: 'video',
        src: '/media/productaddgrid-demo.mp4',
        caption: 'Adding products end to end: catalog search, inline detail editing, staging, and one committed save.',
      },
      {
        kind: 'video',
        src: '/media/productaddgrid-staging.mp4',
        caption:
          "Conditional fields and staging that survives a reload: extra fields appear for the products that need them, and a half-built basket persists, so refreshing mid-flow doesn't lose the work.",
      },
    ],
  },
  {
    id: 'emind-sales-service',
    etn: 'project',
    attributes: {
      name: 'Sales & Customer Service implementation',
      tagline: 'Dynamics 365 CE end to end, as the sole technical owner',
      typecode: { value: 2 },
      statuscode: { value: 1 },
      visibilitycode: { value: 2 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: null,
      publishedon: null,
      license: null,
      stack: 'C# · TypeScript · JavaScript · React · Power Automate · PAC CLI',
      skills: [
        { etn: 'skill', id: 'model-driven-apps' },
        { etn: 'skill', id: 'csharp' },
        { etn: 'skill', id: 'plugins-custom-apis' },
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'javascript' },
        { etn: 'skill', id: 'oauth2-rest' },
        { etn: 'skill', id: 'erp-sync' },
        { etn: 'skill', id: 'power-automate' },
        { etn: 'skill', id: 'git' },
        { etn: 'skill', id: 'pac-cli' },
        { etn: 'skill', id: 'managed-environments' },
      ],
      summary:
        'A full Dynamics 365 Sales & Customer Service implementation, owned end to end across dev and production environments: plugins, PCF controls, form scripting, ERP integration, automation and ALM.\n\n' +
        'The specifics belong to the organization, so this record stays at the architecture level.',
      features:
        '- 30+ C# plugin assemblies with a shared services layer, shipped as Dataverse plugin packages.\n' +
        '- Production PCF controls in React and TypeScript, configuration-driven to serve multiple entities from one codebase. See ProductGrid and ProductAddGrid.\n' +
        '- JavaScript form extensions for client-side logic and validation across the solution.\n' +
        '- Real-time stock and order synchronization with an external ERP over OAuth2 / REST.\n' +
        '- Business process automation with Power Automate and Power Query dataflows.\n' +
        '- Solution ALM with source control, Managed Environments, and PAC CLI export / import.',
      problem: null,
      highlights:
        '**One technical owner, every layer.** Server-side plugins, client-side controls and scripts, the integration and the deployment pipeline all sit with one person.\n\n' +
        '**Plugin packages, not merged assemblies.** The plugin assemblies share a services layer and ship as Dataverse plugin packages, which replaced ILRepack merging.\n\n' +
        '**Config over code, in production.** The PCF controls serve multiple entities from a single codebase, the same principle this site is built on.\n\n' +
        '**An operations background.** Years of running KPIs and SLAs keep technical decisions aligned with how the organization actually works.',
      architecture:
        '```\n' +
        'Model-driven apps   Sales, Customer Service\n' +
        '├── Forms           JavaScript: client-side logic and validation\n' +
        '└── PCF controls    React + TypeScript, configured per entity\n' +
        'Dataverse\n' +
        '├── Plugins         30+ C# assemblies + shared services, as plugin packages\n' +
        '├── Automation      Power Automate, Power Query dataflows\n' +
        '└── Integration     OAuth2 / REST  ◄──►  external ERP (stock, orders)\n' +
        'ALM                 source control → Managed Environments → PAC CLI export / import\n' +
        '```',
    },
  },
]
