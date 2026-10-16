import type { SavedView } from '../types'

export const contactViews: SavedView[] = [
  {
    id: 'contact-active',
    etn: 'contact',
    name: 'Active Contacts',
    isDefault: true,
    columns: [
      { attribute: 'fullname', width: 200 },
      { attribute: 'jobtitle', width: 220 },
      { attribute: 'parentcustomerid', width: 160 },
      { attribute: 'emailaddress1', width: 220 },
      { attribute: 'location', width: 160 },
    ],
    sort: [{ attribute: 'fullname', direction: 'asc' }],
    filter: [{ attribute: 'statuscode', operator: 'eq', value: 1 }],
  },
]
