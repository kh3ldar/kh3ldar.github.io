import type { EntityRecord } from '../types'
import { accountRecords } from './account'
import { certificationRecords } from './certification'
import { contactRecords } from './contact'
import { educationRecords } from './education'
import { positionRecords } from './position'
import { projectRecords } from './project'
import { skillRecords } from './skill'

export const records: EntityRecord[] = [
  ...contactRecords,
  ...accountRecords,
  ...positionRecords,
  ...projectRecords,
  ...skillRecords,
  ...certificationRecords,
  ...educationRecords,
]
