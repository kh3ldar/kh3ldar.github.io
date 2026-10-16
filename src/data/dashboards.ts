import type { DashboardDefinition } from './types'

export const dashboards: DashboardDefinition[] = [
  {
    id: 'career-overview',
    name: 'Career Overview',
    isDefault: true,
    tiles: [
      {
        kind: 'webresource',
        id: 'welcome',
        title: 'Welcome',
        span: 4,
        content:
          "**Barış Kuzu, Dynamics 365 CE developer.** This CV is a model-driven app: the career is the data, and the app around it is real. Start with **About me**, open a **Position** or a **Project** from the sitemap, or select **Finish** on the Career Path when you've seen enough.\n\n" +
          'Not a D365 person? The buttons below do the obvious things.',
        actions: [
          {
            label: 'About me',
            icon: 'contact',
            appearance: 'primary',
            action: { type: 'navigate', route: { pagetype: 'entityrecord', etn: 'contact', id: 'baris' } },
          },
          {
            label: 'Download CV',
            icon: 'download',
            action: { type: 'downloadFile', href: '/cv/Baris-Kuzu-CV.pdf', fileName: 'Baris-Kuzu-CV.pdf' },
          },
          { label: 'Get in touch', icon: 'mail', action: { type: 'openQuickCreate', etn: 'lead' } },
        ],
      },
      {
        kind: 'kpi',
        id: 'years-d365',
        title: 'Years in Dynamics 365',
        caption: 'Since March 2024, calculated',
        source: {
          type: 'aggregate',
          etn: 'position',
          aggregate: 'sum',
          measure: 'tenuremonths',
          filter: [{ attribute: 'parentaccountid', operator: 'eq', value: 'emind' }],
          scale: 1 / 12,
          decimals: 1,
        },
      },
      {
        kind: 'kpi',
        id: 'plugins',
        title: 'Plugin assemblies',
        caption: 'C#, shipped as Dataverse plugin packages',
        source: { type: 'static', value: '30+' },
      },
      {
        kind: 'kpi',
        id: 'pcf',
        title: 'PCF controls in production',
        caption: 'Both public on GitHub',
        source: {
          type: 'aggregate',
          etn: 'project',
          aggregate: 'count',
          filter: [
            { attribute: 'typecode', operator: 'eq', value: 1 },
            { attribute: 'statuscode', operator: 'eq', value: 1 },
          ],
        },
      },
      {
        kind: 'kpi',
        id: 'skills',
        title: 'Skills on record',
        caption: 'Across five categories',
        source: { type: 'aggregate', etn: 'skill', aggregate: 'count' },
      },
      {
        kind: 'chart',
        id: 'skills-by-category',
        title: 'Skills by Category',
        chart: 'bar',
        etn: 'skill',
        groupBy: 'categorycode',
        aggregate: 'count',
        unit: 'skills',
        span: 2,
      },
      {
        kind: 'chart',
        id: 'tenure-by-account',
        title: 'Tenure by Account',
        chart: 'bar',
        etn: 'position',
        groupBy: 'parentaccountid',
        aggregate: 'sum',
        measure: 'tenuremonths',
        unit: 'months',
        span: 2,
      },
      {
        kind: 'list',
        id: 'active-positions',
        title: 'Active Positions',
        etn: 'position',
        viewId: 'position-active-compact',
        span: 2,
      },
      {
        kind: 'list',
        id: 'public-projects',
        title: 'Public Projects',
        etn: 'project',
        viewId: 'project-public-compact',
        span: 2,
      },
    ],
  },
]
