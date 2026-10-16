import type { SavedView } from '../types'

export const certificationViews: SavedView[] = [
  {
    id: 'certification-active',
    etn: 'certification',
    name: 'Active Certifications',
    isDefault: true,
    columns: [
      { attribute: 'name', width: 300 },
      { attribute: 'examcode', width: 100 },
      { attribute: 'issuer', width: 120 },
      { attribute: 'credentialid', width: 140 },
      { attribute: 'statuscode', width: 100 },
    ],
    sort: [{ attribute: 'name', direction: 'asc' }],
    filter: [{ attribute: 'statuscode', operator: 'eq', value: 1 }],
  },
  {
    id: 'certification-subgrid',
    etn: 'certification',
    name: 'Certifications (subgrid)',
    hidden: true,
    columns: [
      { attribute: 'name', width: 220 },
      { attribute: 'examcode', width: 80 },
    ],
    sort: [{ attribute: 'name', direction: 'asc' }],
  },
]
