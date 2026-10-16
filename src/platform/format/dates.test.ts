import { describe, expect, it } from 'vitest'
import { dateSortKey, formatDate, formatDuration, monthsBetween, parsePartialDate } from './dates'

describe('parsePartialDate', () => {
  it('reads years, months and days without timezones', () => {
    expect(parsePartialDate('2011')).toEqual({ year: 2011, month: undefined, day: undefined })
    expect(parsePartialDate('2024-03')).toEqual({ year: 2024, month: 3, day: undefined })
    expect(parsePartialDate('2026-07-15')).toEqual({ year: 2026, month: 7, day: 15 })
    expect(parsePartialDate('2026-07-15T18:15:43Z')).toEqual({ year: 2026, month: 7, day: 15 })
  })

  it('rejects junk', () => {
    expect(parsePartialDate('March')).toBeUndefined()
    expect(parsePartialDate('2024-13')).toBeUndefined()
  })
})

describe('formatDate', () => {
  it('formats by precision and requested format', () => {
    expect(formatDate('2024-03', 'monthyear')).toBe('Mar 2024')
    expect(formatDate('2026-07-15', 'monthyear')).toBe('Jul 2026')
    expect(formatDate('2026-07-15')).toBe('Jul 15, 2026')
    expect(formatDate('2011', 'monthyear')).toBe('2011')
    expect(formatDate('2017-06', 'year')).toBe('2017')
  })

  it('passes unparseable text through', () => {
    expect(formatDate('soon')).toBe('soon')
  })
})

describe('monthsBetween', () => {
  const now = new Date(2026, 9, 16) // Oct 16, 2026

  it('counts calendar months inclusively', () => {
    expect(monthsBetween('2020-09', '2023-12', now)).toBe(40)
    expect(monthsBetween('2024-03', '2024-03', now)).toBe(1)
  })

  it('treats an empty end as now', () => {
    expect(monthsBetween('2024-03', null, now)).toBe(32)
  })

  it('never goes negative and rejects junk', () => {
    expect(monthsBetween('2025-01', '2024-01', now)).toBe(0)
    expect(monthsBetween('junk', null, now)).toBeUndefined()
  })
})

describe('dateSortKey and formatDuration', () => {
  it('orders partial dates', () => {
    expect(dateSortKey('2024-03')).toBeGreaterThan(dateSortKey('2023-12'))
    expect(dateSortKey('2024-03-02')).toBeGreaterThan(dateSortKey('2024-03'))
  })

  it('reads durations like a profile page', () => {
    expect(formatDuration(40)).toBe('3 yrs 4 mos')
    expect(formatDuration(12)).toBe('1 yr')
    expect(formatDuration(1)).toBe('1 mo')
    expect(formatDuration(0)).toBe('0 mos')
  })
})
