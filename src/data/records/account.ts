import type { EntityRecord } from '../types'

export const accountRecords: EntityRecord[] = [
  {
    id: 'emind',
    etn: 'account',
    attributes: {
      name: 'eMind',
      customertypecode: { value: 1 },
      industrycode: { value: 1 },
      location: 'Istanbul, Turkey',
      websiteurl: 'https://emind.com.tr',
      description:
        'Digital solutions company in Istanbul. I have owned a Dynamics 365 Sales & Customer Service implementation here, end to end, since March 2024.',
    },
  },
  {
    id: 'conectys',
    etn: 'account',
    attributes: {
      name: 'Conectys',
      customertypecode: { value: 2 },
      industrycode: { value: 2 },
      location: 'Istanbul, Turkey',
      websiteurl: 'https://www.conectys.com',
      description:
        'Global BPO and customer experience provider. I managed an operations team there for a global client from 2020 to 2023.',
    },
  },
]
