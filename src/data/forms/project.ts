import type { FormDefinition } from '../types'

export const projectForms: FormDefinition[] = [
  {
    id: 'project-main',
    etn: 'project',
    name: 'Information',
    formType: 'main',
    header: [
      { attribute: 'typecode' },
      { attribute: 'statuscode' },
      { attribute: 'visibilitycode' },
      { attribute: 'positionid' },
    ],
    notifications: [
      {
        intent: 'warning',
        text: 'Source is confidential. Ask me about it.',
        when: [{ attribute: 'visibilitycode', operator: 'eq', value: 2 }],
      },
    ],
    tabs: [
      {
        id: 'summary',
        label: 'Summary',
        columns: [
          {
            width: 1,
            sections: [
              {
                kind: 'fields',
                id: 'general',
                label: 'General',
                fields: [
                  { attribute: 'name' },
                  { attribute: 'tagline' },
                  { attribute: 'typecode' },
                  { attribute: 'statuscode' },
                  { attribute: 'visibilitycode' },
                  { attribute: 'positionid' },
                  { attribute: 'githuburl' },
                  { attribute: 'publishedon' },
                  { attribute: 'license' },
                  { attribute: 'stack' },
                ],
              },
            ],
          },
          {
            width: 1.6,
            sections: [
              { kind: 'fields', id: 'overview', label: 'Overview', fields: [{ attribute: 'summary', hideLabel: true }] },
              {
                kind: 'fields',
                id: 'features',
                label: 'What it does',
                hideWhenEmpty: true,
                fields: [{ attribute: 'features', hideLabel: true }],
              },
              {
                kind: 'fields',
                id: 'problem',
                label: 'Why it exists',
                hideWhenEmpty: true,
                fields: [{ attribute: 'problem', hideLabel: true }],
              },
            ],
          },
          {
            width: 1,
            sections: [
              {
                kind: 'subgrid',
                id: 'skills',
                label: 'Skills',
                etn: 'skill',
                viewId: 'skill-subgrid',
                relationship: { kind: 'forward', attribute: 'skills' },
              },
            ],
          },
        ],
      },
      {
        id: 'highlights',
        label: 'Design highlights',
        columns: [
          {
            sections: [
              {
                kind: 'fields',
                id: 'highlights',
                label: 'Design highlights',
                fields: [{ attribute: 'highlights', hideLabel: true }],
              },
            ],
          },
        ],
      },
      {
        id: 'architecture',
        label: 'Architecture',
        columns: [
          {
            sections: [
              {
                kind: 'fields',
                id: 'architecture',
                label: 'Architecture',
                fields: [{ attribute: 'architecture', hideLabel: true }],
              },
            ],
          },
        ],
      },
      {
        id: 'demo',
        label: 'Demo',
        columns: [
          {
            sections: [
              {
                kind: 'media',
                id: 'demo',
                label: 'Demo',
                emptyText: "No demo for this one. It runs in someone else's production environment.",
              },
            ],
          },
        ],
      },
    ],
  },
]
