import { describe, expect, it } from 'vitest'
import { metadata } from '../../data'
import type { MetadataBundle } from '../../data/types'
import { checkIntegrity } from './integrity'

describe('checkIntegrity', () => {
  it('finds nothing wrong with the real data', () => {
    expect(checkIntegrity(metadata)).toEqual([])
  })

  it('reports broken references', () => {
    const broken: MetadataBundle = structuredClone(metadata)
    broken.records.push({
      id: 'ghost',
      etn: 'position',
      attributes: { title: 'Ghost', parentaccountid: { etn: 'account', id: 'nowhere' }, statuscode: { value: 9 } },
    })
    broken.views[0].columns.push({ attribute: 'nonexistent' })
    broken.commands.push({ id: 'oops', label: 'Oops', icon: 'info', action: { type: 'gag', gagId: 'missing' }, scope: ['dashboard'] })
    broken.sitemap.areas[0].groups[0].subareas.push({
      id: 'lost',
      label: 'Lost',
      icon: 'info',
      route: { pagetype: 'entityrecord', etn: 'contact', id: 'nobody' },
    })

    const problems = checkIntegrity(broken)
    expect(problems).toContain('record position:ghost: parentaccountid points at missing account:nowhere')
    expect(problems).toContain('record position:ghost: statuscode has an invalid option')
    expect(problems.some((p) => p.includes('unknown attribute contact.nonexistent'))).toBe(true)
    expect(problems).toContain('command oops: unknown gag missing')
    expect(problems).toContain('subarea lost: unknown record contact:nobody')
  })
})
