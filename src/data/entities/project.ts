import type { EntityMetadata } from '../types'

export const projectEntity = {
  logicalName: 'project',
  displayName: 'Project',
  displayCollectionName: 'Projects',
  primaryNameAttribute: 'name',
  icon: 'project',
  defaultViewId: 'project-public',
  defaultFormId: 'project-main',
  attributes: [
    { logicalName: 'name', displayName: 'Name', type: 'text' },
    { logicalName: 'tagline', displayName: 'Description', type: 'text', searchable: true },
    { logicalName: 'typecode', displayName: 'Type', type: 'optionset', optionSet: 'project_type' },
    { logicalName: 'statuscode', displayName: 'Status', type: 'optionset', optionSet: 'project_status' },
    { logicalName: 'visibilitycode', displayName: 'Visibility', type: 'optionset', optionSet: 'project_visibility' },
    { logicalName: 'positionid', displayName: 'Built During', type: 'lookup', targets: ['position'] },
    { logicalName: 'githuburl', displayName: 'Repository', type: 'url' },
    { logicalName: 'publishedon', displayName: 'Published', type: 'date', format: 'monthyear' },
    { logicalName: 'license', displayName: 'License', type: 'text' },
    { logicalName: 'stack', displayName: 'Stack', type: 'text', searchable: true },
    { logicalName: 'skills', displayName: 'Skills', type: 'lookup', targets: ['skill'], multiple: true },
    { logicalName: 'summary', displayName: 'Overview', type: 'memo', searchable: true },
    { logicalName: 'features', displayName: 'What It Does', type: 'memo', searchable: true },
    { logicalName: 'problem', displayName: 'Why It Exists', type: 'memo', searchable: true },
    { logicalName: 'highlights', displayName: 'Design Highlights', type: 'memo', searchable: true },
    { logicalName: 'architecture', displayName: 'Architecture', type: 'memo' },
  ],
} satisfies EntityMetadata
