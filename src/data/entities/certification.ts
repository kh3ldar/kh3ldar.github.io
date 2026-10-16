import type { EntityMetadata } from '../types'

export const certificationEntity = {
  logicalName: 'certification',
  displayName: 'Certification',
  displayCollectionName: 'Certifications',
  primaryNameAttribute: 'name',
  icon: 'certification',
  defaultViewId: 'certification-active',
  defaultFormId: 'certification-main',
  attributes: [
    { logicalName: 'name', displayName: 'Certification', type: 'text' },
    { logicalName: 'examcode', displayName: 'Exam', type: 'text', searchable: true },
    { logicalName: 'issuer', displayName: 'Issuer', type: 'text' },
    { logicalName: 'credentialid', displayName: 'Credential ID', type: 'text' },
    { logicalName: 'statuscode', displayName: 'Status', type: 'optionset', optionSet: 'certification_status' },
  ],
} satisfies EntityMetadata
