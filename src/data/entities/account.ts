import type { EntityMetadata } from '../types'

export const accountEntity = {
  logicalName: 'account',
  displayName: 'Account',
  displayCollectionName: 'Accounts',
  primaryNameAttribute: 'name',
  icon: 'account',
  recordImage: 'initials',
  defaultViewId: 'account-active',
  defaultFormId: 'account-main',
  attributes: [
    { logicalName: 'name', displayName: 'Account Name', type: 'text' },
    {
      logicalName: 'customertypecode',
      displayName: 'Relationship Type',
      type: 'optionset',
      optionSet: 'account_relationshiptype',
    },
    { logicalName: 'industrycode', displayName: 'Industry', type: 'optionset', optionSet: 'account_industry' },
    { logicalName: 'location', displayName: 'Location', type: 'text' },
    { logicalName: 'websiteurl', displayName: 'Website', type: 'url' },
    { logicalName: 'description', displayName: 'Description', type: 'memo', searchable: true },
  ],
} satisfies EntityMetadata
