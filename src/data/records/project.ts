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
        '**Suffix matching for publisher prefixes.** Config names fields without a prefix, so `quantity` matches `kh_quantity` or `new_quantity` alike, and the same config survives different publishers.\n\n' +
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
    id: 'dataversepluginkit',
    etn: 'project',
    attributes: {
      name: 'DataversePluginKit',
      tagline: 'Dataverse plugins with a fixed lifecycle and registrations in code',
      typecode: { value: 3 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/DataversePluginKit',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'C# · .NET Framework 4.6.2 and .NET 10 · xUnit · NetArchTest · Microsoft.CrmSdk.CoreAssemblies · plugin packages',
      skills: [
        { etn: 'skill', id: 'csharp' },
        { etn: 'skill', id: 'plugins-custom-apis' },
      ],
      summary:
        'A small kit for writing Dataverse plugins with a fixed lifecycle, registrations declared in code, and tests that keep both honest. It comes with a sample on out-of-the-box tables (opportunity, account, task), split into domain, adapters and plugin hosts.\n\n' +
        'A clean, generic rewrite of patterns built for a production Dynamics 365 implementation, not an extract of that code.',
      features:
        '- **Sealed lifecycle.** `PluginBase` implements `IPlugin` with bind, check registration, authorise, validate, execute and compensate. A plugin overrides the hooks it needs.\n' +
        '- **`[PluginStep]`.** Declares message, table, stage, mode, filtering attributes and images on the plugin class. The base class compares the live context with the declarations before any hook runs.\n' +
        '- **`PluginRun`.** Carries the context, an organization service, a `PluginTrace` that starts every line with the correlation id, and per-execution state.\n' +
        '- **Generated `STEPS.md`.** A test fails when it is stale. Another fails when a plugin has no tests class.\n' +
        '- **Layering as tests.** Architecture rules run through NetArchTest.',
      problem:
        'Most plugin code is one `IPlugin.Execute` that unpacks the context, checks a few things, calls the service, and grows from there. Authorisation, validation and clean-up end up interleaved with the work, in a different order in every plugin.\n\n' +
        'The step registration lives only in the environment, so a wrong message, stage or missing image shows up at runtime, if at all.',
      highlights:
        '**Authorise before validate.** `Execute` is not virtual, and authorise runs first, so a refused caller never reaches the validation rules. Compensate runs only when execute throws; if compensation throws too, the original exception still wins.\n\n' +
        '**Registrations as code.** The check covers message, table, stage and mode, and that a declared image is present. Filtering attributes are declared for `STEPS.md` only, because the execution context does not carry them. A plugin with no `[PluginStep]` fails instead of running unchecked.\n\n' +
        '**No state in fields.** The platform caches and reuses a plugin instance, so `PluginRun.State` carries a value from execute to compensate.\n\n' +
        '**A pure domain.** `Sample.Domain` references nothing, not even packages. Adapters hold the SDK calls, and hosts are sealed. One test runs the base-class rule against a deliberately bad fixture, to show the rule can fail.\n\n' +
        '**One source, two builds.** It targets `net462`, the lowest .NET Framework version Dataverse supports for plug-in assemblies, and `net10.0`, so the tests run without .NET Framework. Built and tested on Windows only.',
      architecture:
        '```\n' +
        'src/\n' +
        '  PluginKit/        PluginBase, PluginRun, PluginTrace, [PluginStep]\n' +
        '  Sample.Domain/    pure rules and ports                  (netstandard2.0)\n' +
        '  Sample.Adapters/  organization-service calls\n' +
        '  Sample.Plugins/   plugin hosts\n' +
        'tests/\n' +
        '  PluginKit.Testing/   hand-rolled fakes, STEPS.md generator\n' +
        '  PluginKit.Tests/     lifecycle tests\n' +
        '  Sample.Tests/        domain, adapter, plugin tests, two manifest gates\n' +
        '  Architecture.Tests/  layering rules\n' +
        '```\n\n' +
        'Nothing was run against a live Dataverse org: everything is verified offline against hand-written fakes, and the plugin package was not registered anywhere. Full write-up in the [README](https://github.com/kh3ldar/DataversePluginKit#readme).',
    },
  },
  {
    id: 'formscriptkit',
    etn: 'project',
    attributes: {
      name: 'FormScriptKit',
      tagline: 'Test harness for Dynamics 365 form scripts, no dependencies',
      typecode: { value: 4 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/FormScriptKit',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'JavaScript (ES2017 web resources, CommonJS harness) · Node 20+ · node:test · node:vm · no dependencies',
      skills: [
        { etn: 'skill', id: 'javascript' },
        { etn: 'skill', id: 'model-driven-apps' },
        { etn: 'skill', id: 'plugins-custom-apis' },
      ],
      summary:
        'A zero-dependency harness for testing Dynamics 365 model-driven form scripts. The classic JavaScript web resources you ship to a form run unchanged in a Node `vm` sandbox, against a hand-written fake of the Xrm client API, under Node\'s built-in test runner.\n\n' +
        'Five worked examples sit on top, each a platform trap or a recurring chore written down as code and tests. The patterns come from a production Dynamics 365 implementation; the code is a fresh, generic rewrite.',
      features:
        '- **Loads web resources the way a form does.** Several files in one sandbox, in form-library order, sharing globals.\n' +
        '- **Binds handlers by the names typed into the form editor.** A name that does not resolve fails the test and names the handler, the missing segment and the loaded files.\n' +
        '- **A fake Client API.** Typed attributes, controls, notifications, tabs, the save pipeline, `Xrm.WebApi`, `Xrm.Navigation` and more, with deterministic timers and Web Storage.\n' +
        '- **Runs HTML web resources.** The inline script of a page runs against a small DOM built from its own markup.\n' +
        '- **Five worked examples.** An OnSave handler that needs a Custom API answer, a dialog that hands a result back to the form, form-script helpers, a Custom Page launcher, and ribbon enable rules.',
      problem:
        'Form scripts usually get tested by clicking through a form, which is slow, and nobody does it the same way twice. A classic web resource is not a module: it assumes globals such as `Xrm` and `window`, and the form editor binds events to its handler names as strings.\n\n' +
        'The usual workarounds change what ships: rewrite as modules, or copy the logic into a file a test can import. Then the tests pass against something that is not on the form.',
      highlights:
        '**The code under test is the file on disk.** It is read as UTF-8 and run with `vm.runInContext`. No wrapping, no transform, no cache.\n\n' +
        '**Loud fakes.** An unscripted Web API call, confirm dialog or navigation rejects with a message naming the call. A wrong value type throws. `Xrm.Page` does not exist, so a script that reaches for it fails in the test.\n\n' +
        '**The save pipeline follows Microsoft\'s docs where they say something.** OnSave handlers run in registration order, and `preventDefault()` counts only while that loop runs. A save started during another is rejected, modelled as an observation and marked as one.\n\n' +
        '**Every ribbon rule says what "don\'t know" means.** Each rule has a declared policy, fail open or fail closed, and a thrown error takes the same answer. The rules answer synchronously; a poll refreshes the ribbon only when an answer changes.\n\n' +
        '**Declared choices.** Where Microsoft\'s docs are silent, the fake picks a behaviour and lists it in the README.',
      architecture:
        '```\n' +
        'harness/\n' +
        '  sandbox.js    one vm context per form\n' +
        '  open-form.js  sandbox + form + Xrm + timers, handlers bound by name\n' +
        '  form.js       controls, ui, tabs, entity, save pipeline\n' +
        '  xrm.js        WebApi, Navigation, Utility, App\n' +
        '  dom.js        fake DOM built from markup\n' +
        '  timers.js     deterministic setTimeout / setInterval\n' +
        'examples/       five worked examples (A to E)\n' +
        'tests/          harness tests, example tests, fixtures\n' +
        '```\n\n' +
        'Everything was verified with the test suite alone. No Dataverse environment was used, and the examples were not deployed. The fake is written from the docs, not extracted from the platform. Full write-up in the [README](https://github.com/kh3ldar/FormScriptKit#readme).',
    },
  },
  {
    id: 'addresspicker',
    etn: 'project',
    attributes: {
      name: 'AddressPicker',
      tagline: 'Cascading address picker with Turkish-aware search',
      typecode: { value: 1 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/PCFControls/tree/main/AddressPicker',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'TypeScript 5.9 (strict) · React 16.14 · Fluent UI 8 (Callout only) · PCF · webpack 5 · node:test',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'fluent-ui' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'A PCF field control that turns single-line text address columns into a cascading picker: country, then city, district and neighbourhood. One instance per column; each level offers only the values that fit the level above, loaded lazily from JSON web resources.\n\n' +
        'A generic rewrite of a control built for a production Dynamics 365 implementation, with neutral names and sample data. Part of the PCFControls repo.',
      features:
        '- **Four levels, one control per column.** Parent columns are bound read-only, so the district instance sees the city without writing it.\n' +
        '- **Pick-only where the data has a list, free text where it does not.** Unknown parents, other countries and missing data files fall back to an ordinary text box.\n' +
        '- **Search the way Turkish users type.** Dotted and dotless I stay apart, prefix matches come first, and a lenient second pass finds `ISTANBUL` typed on an English keyboard.\n' +
        '- **Commits on Enter, blur or a click.** Typed text resolves to the listed spelling. Nothing is written per keystroke.\n' +
        '- **Clears only what it set.** Values typed by hand, loaded with the record or written by an integration are never wiped.',
      problem:
        'Address columns are free text, so one city arrives as `İstanbul`, `Istanbul`, `ISTANBUL` and `istanbul`, and reports split them. Turning the columns into choices or lookups changes the schema every form, flow and integration writes to.\n\n' +
        "JavaScript's default casing gets Turkish wrong: `'I'.toLowerCase()` is `i`, not `ı`. And a naive cascade clears the district whenever the city changes, which also wipes a district an integration wrote in the same update.",
      highlights:
        '**Two keys for one string.** `searchKey` applies Turkish casing by hand for typing; `matchKey` folds all four I letters for identity. Options and saved text are never changed.\n\n' +
        '**Ownership, not a parent-change rule.** A small reducer tracks whether the control set the value. Only a pick from the list does. Anything that casts doubt clears ownership, and an unowned value is never cleared.\n\n' +
        '**The data constrains only what it lists.** A missing or empty list means free text, never a dead end. Neighbourhoods are keyed by province and then district, because district names repeat.\n\n' +
        '**Cached web resources, the supported way.** The URL comes from `getWebResourceUrl`, which carries a caching token. Each file is fetched once per page and shared by every instance.\n\n' +
        '**Pure core, thin adapter.** Every decision, down to the listbox\'s open, typed and highlighted state, is a plain function in `core/` with unit tests. The component turns events into intents and renders what comes back. The sample data is not authoritative.',
      architecture:
        '```\n' +
        'index.ts                         PCF entry: parameters, reducer, data, render, commit\n' +
        '├── components/AddressField.tsx  input + Callout listbox; events become list intents\n' +
        '└── core/\n' +
        '    turkishText.ts   searchKey, matchKey, compareTr\n' +
        '    ranking.ts       prefix tiers; strict pass, lenient fallback\n' +
        '    commit.ts        what typed text becomes on Enter or blur\n' +
        '    listState.ts     list rows, key-to-intent map, open / draft / highlight\n' +
        '    levels.ts        a level\'s options from its parents and data\n' +
        '    ownership.ts     the cascade reducer\n' +
        '    geoData.ts       JSON parsing, indexing, lookups\n' +
        '    countries.ts     English country names from Intl.DisplayNames\n' +
        '    webResource.ts   versioned URL, fetch, one load per file\n' +
        '```\n\n' +
        'Instances coordinate only through the form\'s column values. Source in the [PCFControls repo](https://github.com/kh3ldar/PCFControls/tree/main/AddressPicker#readme).',
    },
  },
  {
    id: 'addressbook',
    etn: 'project',
    attributes: {
      name: 'AddressBook',
      tagline: 'Address book with approval, split shipment and an approval panel',
      typecode: { value: 1 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/PCFControls/tree/main/AddressBook',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'TypeScript 5.9 (strict) · PCF · no UI framework · webpack 5 · node:test',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'dataverse-web-api' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'One record, three PCF controls that share one core: an address book for an account\'s addresses with an approval state, a split-shipment grid that divides order-line quantities across the approved ones, and an approval panel for a manager to approve or deny an address with a reason.\n\n' +
        'Built on the out-of-the-box `customeraddress` table, in framework-free TypeScript. A generic rewrite of controls built for a production Dynamics 365 implementation, with neutral names and sample data.',
      features:
        '- **Address book.** `manage` mode on the account form lists, adds and edits addresses with a state tag and submits a Draft for approval. `select` mode on the order form lists the same addresses and lets only an approved one be picked.\n' +
        '- **Split-shipment grid.** Per order line, rows give a quantity to an approved address. Save is offered only when every unit of every line is assigned.\n' +
        '- **Approval panel.** On the address form, a member of the approver team sees Approve and Deny. Deny requires a reason.\n' +
        '- **Lifecycle.** Draft, Pending, Approved or Denied. An edit that changes the address text sends it back to Draft.',
      problem:
        'When an address has to be vetted before anything ships to it, the vetting needs a state, a person who decides, and a form that only offers addresses that passed. An address that changes after approval is a new question for the approver; letting the old approval stand is the usual bug.\n\n' +
        "Splitting an order line across addresses invites quantities that don't add up. And an order form's customer lookup holds the user's unsaved change, which a server read of the order does not.",
      highlights:
        '**One core, three controls.** Models, the Web API service, approval rules and a DOM helper live in `core/`. The three controls build as one project and share it by relative import.\n\n' +
        '**The remainder is derived, never stored.** A line\'s remainder is its quantity minus its shares, computed on every read, so over-assigning cannot be typed. Save frees units before taking them: deletes, then updates that keep or lower a share, then updates that raise one, then creates.\n\n' +
        '**An unsaved customer can still switch the book.** A server read of the order sees only the saved customer, so the book and the grid also take the customer lookup as an optional bound property. Microsoft Learn lists `Lookup.Customer` as not currently supported; that the binding works rests on the author\'s experience, and without it the controls use the saved customer.\n\n' +
        '**The decision rides the form\'s own save.** The panel returns the state and reason through bound outputs, so the form\'s dirty tracking and audit apply.\n\n' +
        '**Fails closed or open on purpose.** A failed approver-team read hides the buttons; a failed read of the record\'s state leaves the views editable.\n\n' +
        '**Approval is not enforced here.** The team check only hides buttons; real enforcement is a plugin or column security.',
      architecture:
        '```\n' +
        'core/                  types, approval rules, addressService, host, format, dom\n' +
        'AddressBookControl/    manifest, shell, book.ts   (modes: manage, select)\n' +
        'ShipmentSplitGrid/     manifest, shell, split.ts, splitService.ts, grid.ts\n' +
        'ApprovalPanel/         manifest, shell, panel.ts\n' +
        '```\n\n' +
        'The state rules are plain functions; the views only ask them. Text reaches the DOM through `textContent`, never `innerHTML`. Source in the [PCFControls repo](https://github.com/kh3ldar/PCFControls/tree/main/AddressBook#readme).',
    },
  },
  {
    id: 'holdsignalspanel',
    etn: 'project',
    attributes: {
      name: 'HoldSignalsPanel',
      tagline: 'Manager panel that turns hold events into signals',
      typecode: { value: 1 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/PCFControls/tree/main/HoldSignalsPanel',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'TypeScript 5.9 (strict) · React 16.14 (no UI library) · PCF dataset control · webpack 5 · node:test',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'A read-only PCF dataset control over a view of hold events (placed, extended, moved, released, cancelled, converted). It turns the stream into four behavioural signals, a hand-drawn SVG map of who moves holds to whom, and a heatmap of open holds by age.\n\n' +
        'A generic rewrite of a pattern built for a production Dynamics 365 implementation, with a neutral table and synthetic sample data.',
      features:
        '- **Four signals.** Low conversion per user, a hold cancelled and placed again on the same record within 24 hours, an old hold kept open by repeated extensions, and a late move that never converted. Each is a pure function, with thresholds in one object.\n' +
        '- **Movement map.** People on a circle, one arrow per giver and receiver pair with the move count. Solid means every move ended in conversion, dashed means at least one did not.\n' +
        '- **Age heatmap.** Open holds per placing user in four columns: overdue, due within 2 days, placed over 10 days ago, recent.\n' +
        '- **Attribution per signal.** Extensions stay with whoever placed the hold, even after a move. A late move belongs to the giver, and a cancel-and-replace to the person who did both.',
      problem:
        'Plugins can log every step of a lifecycle, but a table of events is not something a manager reads. The questions they ask, such as who keeps extending the same hold, are answers over many rows.\n\n' +
        'A hold moved to a colleague is logged as two rows, so counting rows double counts. Doing this in views or charts means FetchXML rules, one per question.',
      highlights:
        '**Pairing by move id, not by order.** The giver\'s row and the receiver\'s row share a move id. Timestamps are never compared, since both halves can be written a moment apart.\n\n' +
        '**The clock as it stood.** The late-move detector reads the expiry on the giver\'s row, which is the expiry before the move.\n\n' +
        '**Everything testable is outside React.** `core/` has no PCF or DOM imports, including the map geometry, which returns node positions and SVG path strings.\n\n' +
        '**A row that cannot be read is skipped and counted,** and the panel says how many.\n\n' +
        '**No colours of its own.** Shades follow the host\'s text colour, and every colour cue has a text twin: a written severity badge, a legend, printed counts.\n\n' +
        '**Heuristics, not findings.** The thresholds were picked so the sample reads clearly, not tuned on real data.',
      architecture:
        '```\n' +
        'index.ts           PCF entry: reads the dataset, pages through it, parses rows, renders\n' +
        '├── components/    Panel, SignalList, MovementMap, Heatmap\n' +
        '├── core/          read, holds, movement, detectors, heatmap, mapLayout, format\n' +
        '└── sample/        seeded synthetic events, one planted case per signal\n' +
        '```\n\n' +
        'It is bound to a view of one table with eight columns, and writes nothing back. Source in the [PCFControls repo](https://github.com/kh3ldar/PCFControls/tree/main/HoldSignalsPanel#readme).',
    },
  },
  {
    id: 'salesdesk',
    etn: 'project',
    attributes: {
      name: 'SalesDesk',
      tagline: 'Sales rep landing screen and goal planner',
      typecode: { value: 1 },
      statuscode: { value: 2 },
      visibilitycode: { value: 1 },
      positionid: { etn: 'position', id: 'emind-d365-developer' },
      githuburl: 'https://github.com/kh3ldar/PCFControls/tree/main/SalesDesk',
      publishedon: '2026-10-17',
      license: 'MIT',
      stack: 'TypeScript 5.9 (strict) · React 16.14 (no UI library) · PCF dataset control · Web API · webpack 5 · node:test',
      skills: [
        { etn: 'skill', id: 'pcf' },
        { etn: 'skill', id: 'typescript' },
        { etn: 'skill', id: 'react' },
        { etn: 'skill', id: 'dataverse-web-api' },
        { etn: 'skill', id: 'fetchxml' },
        { etn: 'skill', id: 'model-driven-apps' },
      ],
      summary:
        'A PCF dataset control that replaces the home grid of a custom table with a landing screen for a sales rep: one card per work queue, laid out with the columns of the org\'s saved views, in an order each user can change. A second tab plans a fiscal quarter\'s goals and writes standard Goal records.\n\n' +
        'A generic rewrite of a control built for a production Dynamics 365 implementation, with neutral names and out-of-the-box tables.',
      features:
        '- **Work-queue cards.** Five cards over lead, opportunity, quote, order and account, each showing the current user\'s records, five rows at a time.\n' +
        '- **Layouts from saved views.** Columns come from the view\'s `layoutxml`, with the card\'s own fallback columns if the view cannot be read.\n' +
        '- **Card order that sticks.** Move-earlier and move-later buttons; the order is saved as JSON in one row owned by the user.\n' +
        '- **A goal planner.** Owners down the side, metrics across the top, one fiscal quarter at a time. Saving keeps at most three writes in flight, then calls the bound `Recalculate` action on each goal it created.\n' +
        '- **A configurable fiscal calendar.** A standard calendar from a chosen start month, or a 4-4-5 calendar of 52 or 53 weeks.',
      problem:
        "A rep's day starts with the same five questions, each a different table and a different view. A card's columns are best defined once, in the saved view, and its rule too: \"open\" in the view and \"open\" in the card must be the same word.\n\n" +
        'When the card sends OData but the rule lives in a view\'s FetchXML, the two can drift unnoticed. And quarterly targets are entered a few dozen at a time, which the standard goal forms do one record at a time.',
      highlights:
        '**A dataset control that never reads its dataset.** The host grid is the seat the control occupies; everything it shows comes through `context.webAPI`.\n\n' +
        '**A test that keeps cards and views honest.** Each card\'s filter is split into a view-derived half and an extra half. A test translates a FetchXML snapshot of the view to OData and fails if it differs. The snapshots are hand-written, so the test catches code drifting from them, not an org editing a view.\n\n' +
        '**A translator that refuses.** An `or` group, a nested filter, a linked table or an unknown operator makes it throw, because an approximation would hide the drift the test exists to find.\n\n' +
        '**Pure planner, injected API.** A blank cell never deletes a goal and never writes zero, and saving twice is harmless. The tests drive it with a stub.\n\n' +
        '**Two calendars, one interface.** The 4-4-5 calendar puts the extra week of a 53-week year at the end of Q4. A test checks five calendars for every fiscal year from 1980 to 2120: each quarter starts the day after the previous one ends.\n\n' +
        '**A guard against the network in tests.** A preload replaces `fetch` with a function that throws and names the URL.',
      architecture:
        '```\n' +
        'index.ts                PCF entry: settings, Web API adapters, render\n' +
        '├── components/         SalesDesk, CardTile, Planner\n' +
        '└── core/\n' +
        '    cards.ts       the card registry\n' +
        '    views.ts       FetchXML snapshots, translator, drift check\n' +
        '    queries.ts     tokens, filter, query string\n' +
        '    layout.ts      layoutxml to columns, with fallback\n' +
        '    metadata.ts    reads getEntityMetadata defensively\n' +
        '    cardData.ts    columns once, rows, retry with fallback\n' +
        '    cardOrder.ts   encode, decode, arrange, shift, the saving store\n' +
        '    fiscal.ts      standard and 4-4-5 calendars\n' +
        '    planner.ts     grid, typed numbers, gated writes, Recalculate\n' +
        '    dates.ts       UTC day arithmetic\n' +
        '```\n\n' +
        'Two JSON properties configure the calendar and the planner metrics. Source in the [PCFControls repo](https://github.com/kh3ldar/PCFControls/tree/main/SalesDesk#readme).',
    },
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
        '- 80+ C# plugins across 8 assemblies with a shared services layer, shipped as plugin packages. See DataversePluginKit.\n' +
        '- Production PCF controls in React and TypeScript, configuration-driven to serve multiple entities from one codebase. See ProductGrid and ProductAddGrid.\n' +
        '- Ribbon enable rules with an explicit fail-open or fail-closed policy.\n' +
        '- JavaScript form extensions for client-side logic and validation across the solution, with unit tests that run offline against a fake Xrm. See FormScriptKit.\n' +
        '- Real-time stock and order synchronization with an external ERP over OAuth2 / REST. Calls that move stock run after the transaction commits, and secrets live in environment variables.\n' +
        '- Business process automation with Power Automate and Power Query dataflows.\n' +
        '- Solution ALM with source control, Managed Environments, and PAC CLI export / import.',
      problem: null,
      highlights:
        '**One technical owner, every layer.** Server-side plugins, client-side controls and scripts, the integration and the deployment pipeline all sit with one person.\n\n' +
        '**Plugin packages, not merged assemblies.** The plugin assemblies share a services layer and ship as Dataverse plugin packages, which replaced ILRepack merging.\n\n' +
        '**Ports and adapters, with a pure domain.** The plugins are layered across separate domains, with a pure domain layer. Architecture rules are enforced as tests, so a layering mistake fails a test. DataversePluginKit is the generic version of that structure.\n\n' +
        '**Registrations declared in code.** Plugin step registrations are declared in code, with a drift check. DataversePluginKit shows the pattern.\n\n' +
        '**Form scripts tested offline.** Client scripts have unit tests that run against a fake Xrm, without clicking through a form. FormScriptKit is the generic version.\n\n' +
        '**Config over code, in production.** The PCF controls serve multiple entities from a single codebase, the same principle this site is built on.\n\n' +
        '**An operations background.** Years of running KPIs and SLAs keep technical decisions aligned with how the organization actually works.',
      architecture:
        '```\n' +
        'Model-driven apps   Sales, Customer Service\n' +
        '├── Forms           JavaScript: client-side logic and validation, tested against a fake Xrm\n' +
        '├── Ribbon          enable rules with an explicit fail-open or fail-closed policy\n' +
        '└── PCF controls    React + TypeScript, configured per entity\n' +
        'Dataverse\n' +
        '├── Plugins         80+ C# plugins in 8 assemblies + shared services, as plugin packages\n' +
        '│                   ports and adapters, pure domain, architecture rules as tests,\n' +
        '│                   step registrations declared in code, with a drift check\n' +
        '├── Automation      Power Automate, Power Query dataflows\n' +
        '└── Integration     OAuth2 / REST  ◄──►  external ERP (stock, orders)\n' +
        '                    stock calls run after commit; secrets in env vars\n' +
        'ALM                 source control → Managed Environments → PAC CLI export / import\n' +
        '```',
    },
  },
]
