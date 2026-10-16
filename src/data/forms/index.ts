import type { FormDefinition } from '../types'
import { accountForms } from './account'
import { contactForms } from './contact'
import { positionForms } from './position'
import { projectForms } from './project'
import { simpleForms } from './simple'

export const forms: FormDefinition[] = [
  ...contactForms,
  ...accountForms,
  ...positionForms,
  ...projectForms,
  ...simpleForms,
]
