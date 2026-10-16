import { describe, expect, it } from 'vitest'
import { buildHref, parseRoute, sameRoute, type Route } from './routes'

describe('parseRoute', () => {
  it('defaults to the dashboard for empty or junk input', () => {
    expect(parseRoute('')).toEqual({ pagetype: 'dashboard' })
    expect(parseRoute('?pagetype=main.aspx')).toEqual({ pagetype: 'dashboard' })
    expect(parseRoute('?pagetype=entitylist')).toEqual({ pagetype: 'dashboard' })
    expect(parseRoute('?pagetype=entityrecord&etn=project')).toEqual({ pagetype: 'dashboard' })
    expect(parseRoute('?%%%')).toEqual({ pagetype: 'dashboard' })
  })

  it('reads lists, records and dashboards', () => {
    expect(parseRoute('?appid=career&pagetype=entitylist&etn=position&viewid=position-all')).toEqual({
      pagetype: 'entitylist',
      etn: 'position',
      viewid: 'position-all',
    })
    expect(parseRoute('?pagetype=entityrecord&etn=project&id=productgrid&tabid=demo')).toEqual({
      pagetype: 'entityrecord',
      etn: 'project',
      id: 'productgrid',
      tabid: 'demo',
    })
    expect(parseRoute('?pagetype=dashboard&id=career-overview')).toEqual({
      pagetype: 'dashboard',
      id: 'career-overview',
    })
  })

  it('normalises case of pagetype and logical names but not ids', () => {
    expect(parseRoute('?pagetype=EntityRecord&etn=Project&id=ProductGrid')).toEqual({
      pagetype: 'entityrecord',
      etn: 'project',
      id: 'ProductGrid',
    })
  })

  it('ignores the appid and oversized parameters', () => {
    expect(parseRoute('?appid=someone-else&pagetype=entitylist&etn=skill')).toEqual({
      pagetype: 'entitylist',
      etn: 'skill',
    })
    expect(parseRoute(`?pagetype=entitylist&etn=${'x'.repeat(101)}`)).toEqual({ pagetype: 'dashboard' })
  })
})

describe('buildHref', () => {
  it('writes parameters in a stable order', () => {
    expect(buildHref({ pagetype: 'entityrecord', etn: 'project', id: 'productgrid', tabid: 'demo' })).toBe(
      '/?appid=career&pagetype=entityrecord&etn=project&id=productgrid&tabid=demo',
    )
    expect(buildHref({ pagetype: 'dashboard' })).toBe('/?appid=career&pagetype=dashboard')
  })

  it('round-trips through parseRoute', () => {
    const routes: Route[] = [
      { pagetype: 'dashboard' },
      { pagetype: 'dashboard', id: 'career-overview' },
      { pagetype: 'entitylist', etn: 'position' },
      { pagetype: 'entitylist', etn: 'position', viewid: 'position-all' },
      { pagetype: 'entityrecord', etn: 'contact', id: 'baris' },
      { pagetype: 'entityrecord', etn: 'contact', id: 'baris', tabid: 'skills' },
    ]
    for (const route of routes) {
      expect(parseRoute(buildHref(route).slice(1))).toEqual(route)
    }
  })

  it('encodes unusual characters', () => {
    const href = buildHref({ pagetype: 'entityrecord', etn: 'project', id: 'a b&c' })
    expect(parseRoute(href.slice(1))).toEqual({ pagetype: 'entityrecord', etn: 'project', id: 'a b&c' })
  })
})

describe('sameRoute', () => {
  it('compares by canonical href', () => {
    expect(sameRoute({ pagetype: 'entitylist', etn: 'skill' }, { pagetype: 'entitylist', etn: 'skill' })).toBe(true)
    expect(sameRoute({ pagetype: 'entitylist', etn: 'skill' }, { pagetype: 'entitylist', etn: 'project' })).toBe(false)
  })
})
