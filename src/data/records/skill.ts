import type { EntityRecord } from '../types'

const LANGUAGES = { value: 1 }
const POWER_PLATFORM = { value: 2 }
const UI = { value: 3 }
const TOOLING = { value: 4 }
const INTEGRATION = { value: 5 }

function skill(id: string, name: string, categorycode: { value: number }, notes: string | null): EntityRecord {
  return { id, etn: 'skill', attributes: { name, categorycode, notes } }
}

/** One row per entry in the CV's skills table. */
export const skillRecords: EntityRecord[] = [
  skill('csharp', 'C#', LANGUAGES, '30+ plugin assemblies with a shared services layer, shipped as Dataverse plugin packages.'),
  skill('typescript', 'TypeScript', LANGUAGES, 'Strict TypeScript in the PCF controls.'),
  skill(
    'javascript',
    'JavaScript',
    LANGUAGES,
    'Form scripts for client-side logic and validation, and the ribbon launcher that opens ProductAddGrid.',
  ),
  skill('pcf', 'PCF', POWER_PLATFORM, 'Production controls configured per entity from JSON, hosted on forms and Custom Pages.'),
  skill(
    'dataverse-web-api',
    'Dataverse Web API',
    POWER_PLATFORM,
    'Metadata, saved views and records straight from the Web API, behind a TTL cache.',
  ),
  skill(
    'plugins-custom-apis',
    'Plugins & Custom APIs',
    POWER_PLATFORM,
    "C# plugins across the implementation, and the Custom API behind ProductAddGrid's product requests.",
  ),
  skill('power-automate', 'Power Automate', POWER_PLATFORM, 'Business process automation, alongside Power Query dataflows.'),
  skill('fetchxml', 'FetchXML', POWER_PLATFORM, 'Saved-view parsing in ProductGrid, catalog search in ProductAddGrid.'),
  skill('power-fx', 'Power Fx', POWER_PLATFORM, 'The Custom Page that hosts ProductAddGrid and closes it with Back().'),
  skill('model-driven-apps', 'Model-driven Apps', POWER_PLATFORM, 'Sales and Customer Service, owned end to end. Also, this website.'),
  skill('react', 'React', UI, 'React 16.14 inside PCF, as the platform pins it. This site runs React 19.'),
  skill('fluent-ui', 'Fluent UI', UI, 'Fluent UI 8 inside the controls. This site is built on Fluent UI 9.'),
  skill('git', 'Git', TOOLING, 'Source control for solutions and code.'),
  skill('pac-cli', 'PAC CLI', TOOLING, 'Solution export and import as part of ALM.'),
  skill('managed-environments', 'Managed Environments', TOOLING, 'Governance for the dev and production environments.'),
  skill('oauth2-rest', 'OAuth2 / REST', INTEGRATION, 'Transport and auth for the ERP integration.'),
  skill(
    'erp-sync',
    'ERP Synchronization',
    INTEGRATION,
    'Real-time stock and order synchronization between Dataverse and an external ERP.',
  ),
  skill('m365-exchange', 'Microsoft 365 / Exchange', INTEGRATION, null),
]
