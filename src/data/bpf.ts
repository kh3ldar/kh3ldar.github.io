import type { BpfDefinition } from './types'

export const bpfs: BpfDefinition[] = [
  {
    id: 'careerpath',
    name: 'Career Path',
    etn: 'contact',
    caption: 'Active since 2011',
    stages: [
      {
        id: 'student',
        label: 'Student',
        status: 'completed',
        caption: '2011 – 2017',
        steps: [
          { label: 'Field of study', value: 'French Language and Literature' },
          { label: 'Institution', value: 'Namık Kemal University' },
        ],
      },
      {
        id: 'operations',
        label: 'Operations Manager',
        status: 'completed',
        caption: 'Sep 2020 – Dec 2023',
        steps: [
          { label: 'Account', value: 'Conectys' },
          { label: 'Owned', value: 'Team KPIs, quality and delivery' },
          { label: 'Result', value: 'Accuracy and SLA targets, consistently exceeded' },
        ],
      },
      {
        id: 'developer',
        label: 'D365 Developer',
        status: 'completed',
        caption: 'Mar 2024 – Present',
        steps: [
          { label: 'Account', value: 'eMind' },
          { label: 'Owns', value: 'Sales & Customer Service, end to end' },
          { label: 'Ships', value: 'PCF controls, C# plugins, integrations' },
        ],
      },
      {
        id: 'yourteam',
        label: 'Your Team',
        status: 'active',
        caption: 'Active for 0 days',
        steps: [
          { label: 'Role', value: 'Dynamics 365 CE Developer' },
          { label: 'Start date', value: "Let's talk" },
          { label: 'Next step', value: 'Select Finish' },
        ],
      },
    ],
    finish: { label: 'Finish', action: { type: 'openQuickCreate', etn: 'lead' } },
  },
]
