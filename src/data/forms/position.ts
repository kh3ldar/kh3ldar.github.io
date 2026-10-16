import type { FormDefinition } from '../types'

export const positionForms: FormDefinition[] = [
  {
    id: 'position-main',
    etn: 'position',
    name: 'Information',
    formType: 'main',
    header: [
      { attribute: 'parentaccountid' },
      { attribute: 'startdate' },
      { attribute: 'enddate' },
      { attribute: 'statuscode' },
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
                id: 'details',
                label: 'Position details',
                fields: [
                  { attribute: 'title' },
                  { attribute: 'parentaccountid' },
                  { attribute: 'location' },
                  { attribute: 'startdate' },
                  { attribute: 'enddate' },
                  { attribute: 'tenuremonths' },
                  { attribute: 'statuscode' },
                ],
              },
              {
                kind: 'fields',
                id: 'summary',
                label: 'Summary',
                fields: [{ attribute: 'summary', hideLabel: true }],
              },
            ],
          },
          { width: 1.5, sections: [{ kind: 'timeline', id: 'timeline', label: 'Timeline' }] },
          {
            width: 1,
            sections: [
              {
                kind: 'subgrid',
                id: 'projects',
                label: 'Projects',
                etn: 'project',
                viewId: 'project-subgrid',
                relationship: { kind: 'reverse', attribute: 'positionid' },
              },
            ],
          },
        ],
      },
    ],
  },
]
