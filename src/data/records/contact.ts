import type { EntityRecord } from '../types'

export const contactRecords: EntityRecord[] = [
  {
    id: 'baris',
    etn: 'contact',
    attributes: {
      fullname: 'Barış Kuzu',
      jobtitle: 'Dynamics 365 CE Developer',
      parentcustomerid: { etn: 'account', id: 'emind' },
      location: 'Istanbul, Turkey',
      emailaddress1: 'bbariskuzu@gmail.com',
      linkedin: 'https://www.linkedin.com/in/beratbariskuzu/',
      github: 'https://github.com/kh3ldar',
      preferredcontactmethodcode: { value: 2 },
      donotemail: false,
      donotphone: true,
      statuscode: { value: 1 },
      summary:
        'Dynamics 365 Customer Engagement developer and sole technical owner of a full-scale Sales & Customer Service implementation: PCF controls (React + TypeScript), C# plugins, ERP integrations, and workflow automation, end to end.\n\n' +
        'An operations-leadership background brings the business-process fluency to keep technical decisions aligned with how the organization actually works.',
    },
  },
]
