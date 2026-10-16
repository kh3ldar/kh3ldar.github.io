import type { EntityMetadata } from '../types'

export const skillEntity = {
  logicalName: 'skill',
  displayName: 'Skill',
  displayCollectionName: 'Skills',
  primaryNameAttribute: 'name',
  icon: 'skill',
  defaultViewId: 'skill-by-category',
  defaultFormId: 'skill-main',
  attributes: [
    { logicalName: 'name', displayName: 'Skill', type: 'text' },
    { logicalName: 'categorycode', displayName: 'Category', type: 'optionset', optionSet: 'skill_category' },
    { logicalName: 'notes', displayName: 'Where It Shows Up', type: 'memo', searchable: true },
  ],
} satisfies EntityMetadata
