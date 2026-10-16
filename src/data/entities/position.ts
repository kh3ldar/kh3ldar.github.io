import type { EntityMetadata } from '../types'

export const positionEntity = {
  logicalName: 'position',
  displayName: 'Position',
  displayCollectionName: 'Positions',
  primaryNameAttribute: 'title',
  icon: 'position',
  defaultViewId: 'position-active',
  defaultFormId: 'position-main',
  attributes: [
    { logicalName: 'title', displayName: 'Position', type: 'text' },
    { logicalName: 'parentaccountid', displayName: 'Account', type: 'lookup', targets: ['account'] },
    { logicalName: 'location', displayName: 'Location', type: 'text' },
    { logicalName: 'startdate', displayName: 'Start Date', type: 'date', format: 'monthyear' },
    { logicalName: 'enddate', displayName: 'End Date', type: 'date', format: 'monthyear', nullLabel: 'Present' },
    {
      logicalName: 'tenuremonths',
      displayName: 'Tenure (Months)',
      type: 'number',
      format: 'integer',
      calculation: { type: 'monthsBetween', start: 'startdate', end: 'enddate' },
      description: 'Calculated column. Counts calendar months, start and end inclusive.',
    },
    { logicalName: 'statuscode', displayName: 'Status', type: 'optionset', optionSet: 'position_status' },
    { logicalName: 'summary', displayName: 'Summary', type: 'memo', searchable: true },
  ],
} satisfies EntityMetadata
