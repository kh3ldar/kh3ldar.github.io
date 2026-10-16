import type { OptionSetMetadata } from './types'

export const optionSets: OptionSetMetadata[] = [
  { name: 'contact_statuscode', options: [{ value: 1, label: 'Active', color: 'success' }] },
  {
    name: 'contact_preferredcontactmethod',
    options: [
      { value: 1, label: 'Any' },
      { value: 2, label: 'Email' },
      { value: 3, label: 'Phone' },
      { value: 4, label: 'Fax' },
      { value: 5, label: 'Mail' },
    ],
  },
  {
    name: 'account_relationshiptype',
    options: [
      { value: 1, label: 'Current employer', color: 'brand' },
      { value: 2, label: 'Former employer', color: 'subtle' },
    ],
  },
  {
    name: 'account_industry',
    options: [
      { value: 1, label: 'Technology and digital solutions' },
      { value: 2, label: 'Business process outsourcing' },
    ],
  },
  {
    name: 'position_status',
    options: [
      { value: 1, label: 'Active', color: 'success' },
      { value: 2, label: 'Inactive', color: 'subtle' },
    ],
  },
  {
    name: 'project_type',
    options: [
      { value: 1, label: 'PCF control' },
      { value: 2, label: 'Implementation' },
      { value: 3, label: 'C# library' },
      { value: 4, label: 'JavaScript library' },
    ],
  },
  {
    name: 'project_status',
    options: [
      { value: 1, label: 'In production', color: 'success' },
      { value: 2, label: 'Published, not deployed', color: 'informative' },
    ],
  },
  {
    name: 'project_visibility',
    options: [
      { value: 1, label: 'Public', color: 'informative' },
      { value: 2, label: 'Confidential', color: 'warning' },
    ],
  },
  {
    name: 'skill_category',
    options: [
      { value: 1, label: 'Languages' },
      { value: 2, label: 'Power Platform' },
      { value: 3, label: 'UI' },
      { value: 4, label: 'Tooling' },
      { value: 5, label: 'Integration' },
    ],
  },
  { name: 'certification_status', options: [{ value: 1, label: 'Active', color: 'success' }] },
]
