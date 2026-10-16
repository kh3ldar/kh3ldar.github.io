import type { EntityRecord } from '../types'

/**
 * Timeline posts carry the CV bullets. The CV gives no date per bullet, so
 * achievement posts are undated on purpose; only start and end dates and the
 * repo publication date are real dates. Add a `date` to a post once known.
 */
export const positionRecords: EntityRecord[] = [
  {
    id: 'emind-d365-developer',
    etn: 'position',
    attributes: {
      title: 'Dynamics 365 Developer',
      parentaccountid: { etn: 'account', id: 'emind' },
      location: 'Istanbul, Turkey',
      startdate: '2024-03',
      enddate: null,
      statuscode: { value: 1 },
      summary:
        'Sole technical owner of a full Dynamics 365 Sales & Customer Service implementation, across dev and production environments: plugins, PCF controls, form scripting, ERP integration, automation and ALM.',
    },
    timeline: [
      {
        id: 'emind-published-2',
        kind: 'auto',
        date: '2026-10-17',
        title: 'DataversePluginKit, FormScriptKit and PCFControls published on GitHub',
        body: 'A C# plugin kit, a form-script test harness and four more PCF controls, written as generic rewrites of patterns from production and open-sourced under the MIT license.',
      },
      {
        id: 'emind-published',
        kind: 'auto',
        date: '2026-07-15',
        title: 'ProductGrid and ProductAddGrid published on GitHub',
        body: 'Two configuration-driven PCF controls, open-sourced under the MIT license with READMEs that explain the design decisions.',
      },
      {
        id: 'emind-owner',
        kind: 'post',
        title: 'Sole technical owner',
        body: 'Own a full Dynamics 365 Sales & Customer Service implementation end to end, across dev and production environments.',
      },
      {
        id: 'emind-plugins',
        kind: 'post',
        title: '80+ C# plugins across 8 assemblies',
        body: 'Built and maintain them, with a shared services layer, shipped as Dataverse plugin packages.',
      },
      {
        id: 'emind-plugin-packages',
        kind: 'post',
        title: 'Moved to plugin packages',
        body: "Replaced ILRepack merging with Dataverse plugin packages, the platform's supported way to ship plugin dependencies.",
      },
      {
        id: 'emind-pcf',
        kind: 'post',
        title: 'Production PCF controls',
        body: 'React and TypeScript controls, configuration-driven so one codebase serves multiple entities. See ProductGrid and ProductAddGrid.',
      },
      {
        id: 'emind-forms',
        kind: 'post',
        title: 'Form scripting',
        body: 'Extended forms across the solution with JavaScript for client-side logic and validation.',
      },
      {
        id: 'emind-erp',
        kind: 'post',
        title: 'ERP integration',
        body: 'Integrated Dataverse with an external ERP over OAuth2 / REST for real-time stock and order synchronization.',
      },
      {
        id: 'emind-alm',
        kind: 'post',
        title: 'Solution ALM',
        body: 'Source control, Managed Environments, and PAC CLI export / import.',
      },
      {
        id: 'emind-automation',
        kind: 'post',
        title: 'Process automation',
        body: 'Automated business processes with Power Automate and Power Query dataflows.',
      },
      {
        id: 'emind-created',
        kind: 'auto',
        date: '2024-03',
        title: 'Position created by Barış Kuzu',
      },
    ],
  },
  {
    id: 'conectys-ops-manager',
    etn: 'position',
    attributes: {
      title: 'Operations Team Manager',
      parentaccountid: { etn: 'account', id: 'conectys' },
      location: 'Istanbul, Turkey',
      startdate: '2020-09',
      enddate: '2023-12',
      statuscode: { value: 2 },
      summary:
        'Led an operations team for a global BPO client: KPIs, quality, delivery, and the relationship with client and internal stakeholders.',
    },
    timeline: [
      {
        id: 'conectys-closed',
        kind: 'auto',
        date: '2023-12',
        title: 'Status changed from Active to Inactive by Barış Kuzu',
      },
      {
        id: 'conectys-kpis',
        kind: 'post',
        title: 'Team KPIs, quality and delivery',
        body: 'Owned them for a global BPO client, leading a team to consistently exceed accuracy and SLA targets.',
      },
      {
        id: 'conectys-stakeholders',
        kind: 'post',
        title: 'Cross-team initiatives',
        body: 'Drove them, and acted as the primary point of contact for client and internal stakeholders.',
      },
      {
        id: 'conectys-created',
        kind: 'auto',
        date: '2020-09',
        title: 'Position created by Barış Kuzu',
      },
    ],
  },
]
