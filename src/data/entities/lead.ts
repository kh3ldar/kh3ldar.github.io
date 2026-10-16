import type { EntityMetadata } from '../types'

/** Quick create only: a lead is how a visitor gets in touch. No records, so no view. */
export const leadEntity = {
  logicalName: 'lead',
  displayName: 'Lead',
  displayCollectionName: 'Leads',
  primaryNameAttribute: 'subject',
  icon: 'lead',
  defaultFormId: 'lead-quickcreate',
  quickCreateFormId: 'lead-quickcreate',
  attributes: [
    { logicalName: 'subject', displayName: 'Topic', type: 'text' },
    { logicalName: 'fullname', displayName: 'Your Name', type: 'text' },
    { logicalName: 'companyname', displayName: 'Company', type: 'text' },
    { logicalName: 'emailaddress1', displayName: 'Email', type: 'text', format: 'email' },
    { logicalName: 'description', displayName: 'Description', type: 'memo' },
  ],
} satisfies EntityMetadata
