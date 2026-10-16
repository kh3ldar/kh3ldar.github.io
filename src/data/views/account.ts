import type { SavedView } from '../types'

export const accountViews: SavedView[] = [
  {
    id: 'account-active',
    etn: 'account',
    name: 'Active Accounts',
    isDefault: true,
    columns: [
      { attribute: 'name', width: 160 },
      { attribute: 'customertypecode', width: 170 },
      { attribute: 'industrycode', width: 240 },
      { attribute: 'location', width: 160 },
      { attribute: 'websiteurl', width: 200 },
    ],
    sort: [{ attribute: 'customertypecode', direction: 'asc' }],
  },
]
