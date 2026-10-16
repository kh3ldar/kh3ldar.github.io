import type { FormDefinition } from '../types'

export const accountForms: FormDefinition[] = [
  {
    id: 'account-main',
    etn: 'account',
    name: 'Information',
    formType: 'main',
    header: [{ attribute: 'customertypecode' }, { attribute: 'industrycode' }, { attribute: 'location' }],
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
                id: 'accountinfo',
                label: 'Account information',
                fields: [
                  { attribute: 'name' },
                  { attribute: 'customertypecode' },
                  { attribute: 'industrycode' },
                  { attribute: 'location' },
                  { attribute: 'websiteurl' },
                ],
              },
            ],
          },
          {
            width: 1.4,
            sections: [
              {
                kind: 'fields',
                id: 'description',
                label: 'Description',
                fields: [{ attribute: 'description', hideLabel: true }],
              },
              {
                kind: 'subgrid',
                id: 'positions',
                label: 'Positions',
                etn: 'position',
                viewId: 'position-subgrid',
                relationship: { kind: 'reverse', attribute: 'parentaccountid' },
              },
            ],
          },
        ],
      },
    ],
  },
]
