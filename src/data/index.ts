import { app } from './app'
import { bpfs } from './bpf'
import { commands } from './commands'
import { dashboards } from './dashboards'
import { entities } from './entities'
import { forms } from './forms'
import { gags } from './gags'
import { optionSets } from './optionsets'
import { records } from './records'
import { sitemap } from './sitemap'
import type { MetadataBundle } from './types'
import { views } from './views'

/** Everything the app knows, in one bundle. The platform layer reads only this. */
export const metadata: MetadataBundle = {
  app,
  entities,
  optionSets,
  views,
  forms,
  records,
  sitemap,
  dashboards,
  commands,
  gags,
  bpfs,
}
