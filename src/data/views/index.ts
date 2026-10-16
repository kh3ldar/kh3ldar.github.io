import type { SavedView } from '../types'
import { accountViews } from './account'
import { certificationViews } from './certification'
import { contactViews } from './contact'
import { educationViews } from './education'
import { positionViews } from './position'
import { projectViews } from './project'
import { skillViews } from './skill'

export const views: SavedView[] = [
  ...contactViews,
  ...accountViews,
  ...positionViews,
  ...projectViews,
  ...skillViews,
  ...certificationViews,
  ...educationViews,
]
