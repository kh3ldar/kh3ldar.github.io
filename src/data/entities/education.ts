import type { EntityMetadata } from '../types'

export const educationEntity = {
  logicalName: 'education',
  displayName: 'Education',
  displayCollectionName: 'Education',
  primaryNameAttribute: 'name',
  icon: 'education',
  defaultViewId: 'education-all',
  defaultFormId: 'education-main',
  attributes: [
    { logicalName: 'name', displayName: 'Field of Study', type: 'text' },
    { logicalName: 'institution', displayName: 'Institution', type: 'text', searchable: true },
    { logicalName: 'location', displayName: 'Location', type: 'text' },
    { logicalName: 'startdate', displayName: 'Start', type: 'date', format: 'year' },
    { logicalName: 'enddate', displayName: 'End', type: 'date', format: 'year' },
    { logicalName: 'notes', displayName: 'Notes', type: 'memo' },
  ],
} satisfies EntityMetadata
