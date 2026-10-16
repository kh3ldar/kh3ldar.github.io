import type { EntityMetadata } from '../types'
import { accountEntity } from './account'
import { certificationEntity } from './certification'
import { contactEntity } from './contact'
import { educationEntity } from './education'
import { leadEntity } from './lead'
import { positionEntity } from './position'
import { projectEntity } from './project'
import { skillEntity } from './skill'

/** Order is the order of global search result groups. */
export const entities: EntityMetadata[] = [
  contactEntity,
  positionEntity,
  projectEntity,
  skillEntity,
  certificationEntity,
  educationEntity,
  accountEntity,
  leadEntity,
]
