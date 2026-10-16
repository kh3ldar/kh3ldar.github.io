import type { SavedView } from '../types'

export const educationViews: SavedView[] = [
  {
    id: 'education-all',
    etn: 'education',
    name: 'All Education',
    isDefault: true,
    columns: [
      { attribute: 'name', width: 260 },
      { attribute: 'institution', width: 220 },
      { attribute: 'location', width: 160 },
      { attribute: 'startdate', width: 90 },
      { attribute: 'enddate', width: 90 },
    ],
    sort: [{ attribute: 'startdate', direction: 'desc' }],
  },
  {
    id: 'education-subgrid',
    etn: 'education',
    name: 'Education (subgrid)',
    hidden: true,
    columns: [
      { attribute: 'name', width: 220 },
      { attribute: 'enddate', width: 70 },
    ],
    sort: [{ attribute: 'startdate', direction: 'desc' }],
  },
]
