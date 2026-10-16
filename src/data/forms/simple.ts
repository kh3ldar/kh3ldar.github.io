import type { FormDefinition } from '../types'

/** One-tab forms for the small tables, and the Lead quick create form. */
export const simpleForms: FormDefinition[] = [
  {
    id: 'skill-main',
    etn: 'skill',
    name: 'Information',
    formType: 'main',
    header: [{ attribute: 'categorycode' }],
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
                id: 'skill',
                label: 'Skill',
                fields: [{ attribute: 'name' }, { attribute: 'categorycode' }, { attribute: 'notes' }],
              },
            ],
          },
          {
            width: 1.4,
            sections: [
              {
                kind: 'subgrid',
                id: 'usedin',
                label: 'Used in',
                etn: 'project',
                viewId: 'project-subgrid',
                relationship: { kind: 'reverse', attribute: 'skills' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'certification-main',
    etn: 'certification',
    name: 'Information',
    formType: 'main',
    header: [{ attribute: 'examcode' }, { attribute: 'issuer' }, { attribute: 'statuscode' }],
    tabs: [
      {
        id: 'summary',
        label: 'Summary',
        columns: [
          {
            sections: [
              {
                kind: 'fields',
                id: 'certification',
                label: 'Certification',
                fields: [
                  { attribute: 'name' },
                  { attribute: 'examcode' },
                  { attribute: 'issuer' },
                  { attribute: 'credentialid' },
                  { attribute: 'statuscode' },
                ],
              },
            ],
          },
          { sections: [] },
        ],
      },
    ],
  },
  {
    id: 'education-main',
    etn: 'education',
    name: 'Information',
    formType: 'main',
    header: [{ attribute: 'institution' }, { attribute: 'startdate' }, { attribute: 'enddate' }],
    tabs: [
      {
        id: 'summary',
        label: 'Summary',
        columns: [
          {
            sections: [
              {
                kind: 'fields',
                id: 'education',
                label: 'Education',
                fields: [
                  { attribute: 'name' },
                  { attribute: 'institution' },
                  { attribute: 'location' },
                  { attribute: 'startdate' },
                  { attribute: 'enddate' },
                  { attribute: 'notes' },
                ],
              },
            ],
          },
          { sections: [] },
        ],
      },
    ],
  },
  {
    id: 'lead-quickcreate',
    etn: 'lead',
    name: 'Lead',
    formType: 'quickcreate',
    header: [],
    tabs: [
      {
        id: 'main',
        label: 'Lead',
        columns: [
          {
            sections: [
              {
                kind: 'fields',
                id: 'details',
                label: 'Details',
                fields: [
                  { attribute: 'subject', required: true, placeholder: 'A D365 role, a project, a question' },
                  { attribute: 'fullname', required: true },
                  { attribute: 'companyname' },
                  { attribute: 'emailaddress1', placeholder: 'So I can reply' },
                  { attribute: 'description', placeholder: 'Anything else worth knowing' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
