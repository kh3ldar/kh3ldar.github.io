import type { SavedView } from '../types'

export const projectViews: SavedView[] = [
  {
    id: 'project-public',
    etn: 'project',
    name: 'Public Projects',
    isDefault: true,
    columns: [
      { attribute: 'name', width: 170 },
      { attribute: 'tagline', width: 300 },
      { attribute: 'typecode', width: 130 },
      { attribute: 'statuscode', width: 140 },
      { attribute: 'githuburl', width: 260 },
    ],
    sort: [{ attribute: 'name', direction: 'asc' }],
    filter: [{ attribute: 'visibilitycode', operator: 'eq', value: 1 }],
  },
  {
    id: 'project-all',
    etn: 'project',
    name: 'All Projects',
    columns: [
      { attribute: 'name', width: 260 },
      { attribute: 'tagline', width: 320 },
      { attribute: 'typecode', width: 130 },
      { attribute: 'visibilitycode', width: 130 },
      { attribute: 'statuscode', width: 140 },
    ],
    sort: [{ attribute: 'visibilitycode', direction: 'asc' }, { attribute: 'name', direction: 'asc' }],
  },
  {
    id: 'project-public-compact',
    etn: 'project',
    name: 'Public Projects (compact)',
    hidden: true,
    columns: [
      { attribute: 'name', width: 160 },
      { attribute: 'tagline', width: 280 },
      { attribute: 'statuscode', width: 130 },
    ],
    sort: [{ attribute: 'name', direction: 'asc' }],
    filter: [{ attribute: 'visibilitycode', operator: 'eq', value: 1 }],
  },
  {
    id: 'project-subgrid',
    etn: 'project',
    name: 'Projects (subgrid)',
    hidden: true,
    columns: [
      { attribute: 'name', width: 200 },
      { attribute: 'typecode', width: 110 },
    ],
    sort: [{ attribute: 'visibilitycode', direction: 'asc' }, { attribute: 'name', direction: 'asc' }],
  },
]
