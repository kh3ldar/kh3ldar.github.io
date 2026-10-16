import type { SavedView } from '../types'

const columns = [
  { attribute: 'title', width: 220 },
  { attribute: 'parentaccountid', width: 140 },
  { attribute: 'startdate', width: 120 },
  { attribute: 'enddate', width: 120 },
  { attribute: 'tenuremonths', width: 140 },
  { attribute: 'statuscode', width: 110 },
]

export const positionViews: SavedView[] = [
  {
    id: 'position-active',
    etn: 'position',
    name: 'Active Positions',
    isDefault: true,
    columns,
    sort: [{ attribute: 'startdate', direction: 'desc' }],
    filter: [{ attribute: 'statuscode', operator: 'eq', value: 1 }],
  },
  {
    id: 'position-all',
    etn: 'position',
    name: 'All Positions',
    columns,
    sort: [{ attribute: 'startdate', direction: 'desc' }],
  },
  {
    id: 'position-active-compact',
    etn: 'position',
    name: 'Active Positions (compact)',
    hidden: true,
    columns: [
      { attribute: 'title', width: 220 },
      { attribute: 'parentaccountid', width: 110 },
      { attribute: 'startdate', width: 110 },
      { attribute: 'statuscode', width: 100 },
    ],
    sort: [{ attribute: 'startdate', direction: 'desc' }],
    filter: [{ attribute: 'statuscode', operator: 'eq', value: 1 }],
  },
  {
    id: 'position-subgrid',
    etn: 'position',
    name: 'Positions (subgrid)',
    hidden: true,
    columns: [
      { attribute: 'title', width: 200 },
      { attribute: 'parentaccountid', width: 120 },
      { attribute: 'startdate', width: 100 },
      { attribute: 'enddate', width: 100 },
    ],
    sort: [{ attribute: 'startdate', direction: 'desc' }],
  },
]
