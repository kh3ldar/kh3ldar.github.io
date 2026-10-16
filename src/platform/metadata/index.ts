import { metadata } from '../../data'
import { checkIntegrity } from './integrity'
import { createRegistry } from './registry'

/** The app-wide registry over src/data. */
export const registry = createRegistry(metadata)

if (import.meta.env.DEV) {
  const problems = checkIntegrity(metadata)
  if (problems.length) console.warn(`Metadata integrity: ${problems.length} problem(s)\n${problems.join('\n')}`)
}
