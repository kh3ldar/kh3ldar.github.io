import { describe, expect, it } from 'vitest'
import { metadata } from '../../data'
import type { AttributeMetadata } from '../../data/types'
import { compareValues, formatValue } from '../format/formatValue'
import { fillTemplate } from '../format/template'
import { createRegistry } from '../metadata/registry'
import { aggregate, groupAggregate } from './aggregate'
import { matchesCondition } from './filter'
import { relatedRecords } from './relations'
import { resolveView } from './resolveView'
import { searchRecords } from './search'
import { getValue } from './values'

const registry = createRegistry(metadata)
const now = new Date(2026, 9, 16)

function attr(etn: string, name: string): AttributeMetadata {
  const attribute = registry.getAttribute(etn, name)
  if (!attribute) throw new Error(`missing ${etn}.${name}`)
  return attribute
}

function record(etn: string, id: string) {
  const found = registry.getRecord(etn, id)
  if (!found) throw new Error(`missing ${etn}:${id}`)
  return found
}

describe('formatValue', () => {
  it('formats each attribute type', () => {
    const emind = record('position', 'emind-d365-developer')
    expect(formatValue(registry, attr('position', 'startdate'), emind.attributes.startdate)).toBe('Mar 2024')
    expect(formatValue(registry, attr('position', 'enddate'), emind.attributes.enddate)).toBe('Present')
    expect(formatValue(registry, attr('position', 'statuscode'), emind.attributes.statuscode)).toBe('Active')
    expect(formatValue(registry, attr('position', 'parentaccountid'), emind.attributes.parentaccountid)).toBe('eMind')
    expect(formatValue(registry, attr('position', 'tenuremonths'), getValue(emind, attr('position', 'tenuremonths'), now))).toBe('32')
    const baris = record('contact', 'baris')
    expect(formatValue(registry, attr('contact', 'donotphone'), baris.attributes.donotphone)).toBe('Do not allow')
    expect(formatValue(registry, attr('contact', 'github'), baris.attributes.github)).toBe('github.com/kh3ldar')
    const project = record('project', 'productgrid')
    expect(formatValue(registry, attr('project', 'skills'), project.attributes.skills)).toContain('PCF')
  })

  it('returns empty text for empty values without a null label', () => {
    expect(formatValue(registry, attr('project', 'githuburl'), null)).toBe('')
  })
})

describe('compareValues', () => {
  it('sorts an open end date after every real date', () => {
    const end = attr('position', 'enddate')
    expect(compareValues(registry, end, null, '2023-12')).toBeGreaterThan(0)
    expect(compareValues(registry, end, '2023-12', null)).toBeLessThan(0)
  })

  it('sorts option sets by value and text by label', () => {
    expect(compareValues(registry, attr('skill', 'categorycode'), { value: 1 }, { value: 5 })).toBeLessThan(0)
    expect(compareValues(registry, attr('skill', 'name'), 'react', 'C#')).toBeGreaterThan(0)
  })
})

describe('filters', () => {
  it('compares option values and lookup ids', () => {
    const emind = record('position', 'emind-d365-developer')
    expect(matchesCondition(registry, emind, { attribute: 'statuscode', operator: 'eq', value: 1 })).toBe(true)
    expect(matchesCondition(registry, emind, { attribute: 'parentaccountid', operator: 'eq', value: 'emind' })).toBe(true)
    expect(matchesCondition(registry, emind, { attribute: 'enddate', operator: 'null' })).toBe(true)
    expect(matchesCondition(registry, emind, { attribute: 'title', operator: 'contains', value: 'dynamics' })).toBe(true)
    expect(matchesCondition(registry, emind, { attribute: 'statuscode', operator: 'in', value: [2, 3] })).toBe(false)
  })
})

describe('resolveView', () => {
  it('applies the view filter and sort', () => {
    const active = resolveView(registry, registry.getView('position-active')!, { now })
    expect(active.rows.map((r) => r.id)).toEqual(['emind-d365-developer'])
    const all = resolveView(registry, registry.getView('position-all')!, { now })
    expect(all.rows.map((r) => r.id)).toEqual(['emind-d365-developer', 'conectys-ops-manager'])
    expect(all.columns.map((c) => c.attribute.logicalName)[0]).toBe('title')
  })

  it('keeps confidential projects out of the public view', () => {
    const rows = resolveView(registry, registry.getView('project-public')!).rows
    expect(rows).toHaveLength(8)
    expect(rows.map((r) => r.id)).not.toContain('emind-sales-service')
  })

  it('sorts skills by category, then name', () => {
    const rows = resolveView(registry, registry.getView('skill-by-category')!).rows
    expect(rows[0].attributes.categorycode).toEqual({ value: 1 })
    expect(registry.getPrimaryName(rows[0])).toBe('C#')
  })
})

describe('relatedRecords', () => {
  it('follows reverse lookups, including multi-value ones', () => {
    const emind = record('account', 'emind')
    expect(relatedRecords(registry, emind, 'position', { kind: 'reverse', attribute: 'parentaccountid' }).map((r) => r.id)).toEqual([
      'emind-d365-developer',
    ])
    const fetchxml = record('skill', 'fetchxml')
    expect(relatedRecords(registry, fetchxml, 'project', { kind: 'reverse', attribute: 'skills' }).map((r) => r.id).sort()).toEqual([
      'productaddgrid',
      'productgrid',
      'salesdesk',
    ])
  })

  it('follows forward lookups', () => {
    const grid = record('project', 'productgrid')
    const skills = relatedRecords(registry, grid, 'skill', { kind: 'forward', attribute: 'skills' })
    expect(skills.map((s) => s.id)).toContain('pcf')
  })
})

describe('aggregate', () => {
  it('counts, sums and scales', () => {
    expect(aggregate(registry, { etn: 'skill', aggregate: 'count' })).toBe(18)
    expect(
      aggregate(
        registry,
        { etn: 'position', aggregate: 'sum', measure: 'tenuremonths', filter: [{ attribute: 'parentaccountid', operator: 'eq', value: 'emind' }] },
        now,
      ),
    ).toBe(32)
  })

  it('groups option sets in option order and lookups by size', () => {
    const byCategory = groupAggregate(registry, { etn: 'skill', aggregate: 'count', groupBy: 'categorycode' })
    expect(byCategory.map((g) => g.label)).toEqual(['Languages', 'Power Platform', 'UI', 'Tooling', 'Integration'])
    expect(byCategory.reduce((sum, g) => sum + g.value, 0)).toBe(18)
    const tenure = groupAggregate(registry, { etn: 'position', aggregate: 'sum', measure: 'tenuremonths', groupBy: 'parentaccountid' }, now)
    expect(tenure.map((g) => [g.label, g.value])).toEqual([
      ['Conectys', 40],
      ['eMind', 32],
    ])
  })
})

describe('searchRecords', () => {
  it('finds names first, then searchable text with a snippet', () => {
    const groups = searchRecords(registry, 'plugin package')
    const hits = groups.flatMap((g) => g.hits)
    expect(hits.some((h) => h.etn === 'skill' && h.id === 'csharp')).toBe(true)
    expect(hits.every((h) => h.snippet?.toLowerCase().includes('plugin package'))).toBe(true)
    expect(searchRecords(registry, 'productgrid')[0].hits[0]).toMatchObject({ etn: 'project', id: 'productgrid' })
    expect(searchRecords(registry, 'x')).toEqual([])
  })
})

describe('fillTemplate', () => {
  it('fills placeholders and drops empty lines', () => {
    expect(fillTemplate('Hi {name},\n\n{body}\n\n\n{missing}', { name: 'Barış', body: 'Hello' })).toBe('Hi Barış,\n\nHello')
  })
})
