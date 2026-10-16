import type { EntityMetadata } from '../types'

export const contactEntity = {
  logicalName: 'contact',
  displayName: 'Contact',
  displayCollectionName: 'Contacts',
  primaryNameAttribute: 'fullname',
  icon: 'contact',
  recordImage: 'initials',
  defaultViewId: 'contact-active',
  defaultFormId: 'contact-main',
  attributes: [
    { logicalName: 'fullname', displayName: 'Full Name', type: 'text' },
    { logicalName: 'jobtitle', displayName: 'Job Title', type: 'text', searchable: true },
    { logicalName: 'parentcustomerid', displayName: 'Company Name', type: 'lookup', targets: ['account'] },
    { logicalName: 'location', displayName: 'Location', type: 'text' },
    { logicalName: 'emailaddress1', displayName: 'Email', type: 'text', format: 'email' },
    { logicalName: 'linkedin', displayName: 'LinkedIn', type: 'url' },
    { logicalName: 'github', displayName: 'GitHub', type: 'url' },
    {
      logicalName: 'preferredcontactmethodcode',
      displayName: 'Preferred Method of Contact',
      type: 'optionset',
      optionSet: 'contact_preferredcontactmethod',
    },
    { logicalName: 'donotemail', displayName: 'Email', type: 'boolean', booleanLabels: ['Allow', 'Do not allow'] },
    {
      logicalName: 'donotphone',
      displayName: 'Phone Calls',
      type: 'boolean',
      booleanLabels: ['Allow', 'Do not allow'],
      description: 'There is no phone number on this site. Email works.',
    },
    { logicalName: 'summary', displayName: 'Professional Summary', type: 'memo', searchable: true },
    { logicalName: 'statuscode', displayName: 'Status Reason', type: 'optionset', optionSet: 'contact_statuscode' },
  ],
} satisfies EntityMetadata
