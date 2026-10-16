import type { SavedView } from '../types'

export const skillViews: SavedView[] = [
  {
    id: 'skill-by-category',
    etn: 'skill',
    name: 'Skills by Category',
    isDefault: true,
    columns: [
      { attribute: 'categorycode', width: 150 },
      { attribute: 'name', width: 200 },
      { attribute: 'notes', width: 460 },
    ],
    sort: [
      { attribute: 'categorycode', direction: 'asc' },
      { attribute: 'name', direction: 'asc' },
    ],
  },
  {
    id: 'skill-all',
    etn: 'skill',
    name: 'All Skills (A–Z)',
    columns: [
      { attribute: 'name', width: 200 },
      { attribute: 'categorycode', width: 150 },
      { attribute: 'notes', width: 460 },
    ],
    sort: [{ attribute: 'name', direction: 'asc' }],
  },
  {
    id: 'skill-subgrid',
    etn: 'skill',
    name: 'Skills (subgrid)',
    hidden: true,
    columns: [
      { attribute: 'name', width: 200 },
      { attribute: 'categorycode', width: 140 },
    ],
    sort: [
      { attribute: 'categorycode', direction: 'asc' },
      { attribute: 'name', direction: 'asc' },
    ],
  },
]
