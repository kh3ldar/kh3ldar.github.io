import type { FormDefinition } from '../types'

export const contactForms: FormDefinition[] = [
  {
    id: 'contact-main',
    etn: 'contact',
    name: 'About',
    formType: 'main',
    header: [{ attribute: 'jobtitle' }, { attribute: 'parentcustomerid' }, { attribute: 'location' }],
    bpfId: 'careerpath',
    notifications: [{ intent: 'info', text: 'This record is read-only. Contact the owner to negotiate.' }],
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
                id: 'contactinfo',
                label: 'Contact information',
                fields: [
                  { attribute: 'fullname' },
                  { attribute: 'jobtitle' },
                  { attribute: 'parentcustomerid' },
                  { attribute: 'location' },
                  { attribute: 'emailaddress1' },
                  { attribute: 'linkedin' },
                  { attribute: 'github' },
                ],
              },
              {
                kind: 'fields',
                id: 'preferences',
                label: 'Contact preferences',
                fields: [
                  { attribute: 'preferredcontactmethodcode' },
                  { attribute: 'donotemail' },
                  { attribute: 'donotphone' },
                ],
              },
            ],
          },
          {
            width: 1.4,
            sections: [
              {
                kind: 'fields',
                id: 'about',
                label: 'Professional summary',
                fields: [{ attribute: 'summary', hideLabel: true }],
              },
              { kind: 'subgrid', id: 'experience', label: 'Experience', etn: 'position', viewId: 'position-subgrid' },
            ],
          },
          {
            width: 1,
            sections: [
              {
                kind: 'subgrid',
                id: 'certifications',
                label: 'Certifications',
                etn: 'certification',
                viewId: 'certification-subgrid',
              },
              { kind: 'subgrid', id: 'education', label: 'Education', etn: 'education', viewId: 'education-subgrid' },
            ],
          },
        ],
      },
      {
        id: 'skills',
        label: 'Skills',
        columns: [
          {
            sections: [{ kind: 'subgrid', id: 'skills', label: 'Skills', etn: 'skill', viewId: 'skill-by-category' }],
          },
        ],
      },
      {
        id: 'projects',
        label: 'Projects',
        columns: [
          {
            sections: [{ kind: 'subgrid', id: 'projects', label: 'Projects', etn: 'project', viewId: 'project-all' }],
          },
        ],
      },
    ],
  },
]
