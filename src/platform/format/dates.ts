/**
 * Dates in data are ISO-like strings: "2011", "2024-03" or "2026-07-15".
 * They are parsed by hand so no timezone can shift "2024-03" into February.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export interface PartialDate {
  year: number
  /** 1–12 */
  month?: number
  day?: number
}

export function parsePartialDate(value: string): PartialDate | undefined {
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/.exec(value.trim())
  if (!match) return undefined
  const year = Number(match[1])
  const month = match[2] ? Number(match[2]) : undefined
  const day = match[3] ? Number(match[3]) : undefined
  if (month !== undefined && (month < 1 || month > 12)) return undefined
  if (day !== undefined && (day < 1 || day > 31)) return undefined
  return { year, month, day }
}

export function formatDate(value: string, format?: 'monthyear' | 'year'): string {
  const date = parsePartialDate(value)
  if (!date) return value
  if (format === 'year' || date.month === undefined) return String(date.year)
  const month = MONTHS[date.month - 1]
  if (format === 'monthyear' || date.day === undefined) return `${month} ${date.year}`
  return `${month} ${date.day}, ${date.year}`
}

/** A sortable number: yyyymmdd, missing parts as zero. */
export function dateSortKey(value: string): number {
  const date = parsePartialDate(value)
  if (!date) return 0
  return date.year * 10000 + (date.month ?? 0) * 100 + (date.day ?? 0)
}

/** Calendar months from start to end, both inclusive. An empty end means the month of `now`. */
export function monthsBetween(start: string, end: string | null | undefined, now: Date = new Date()): number | undefined {
  const from = parsePartialDate(start)
  if (!from) return undefined
  const to = end ? parsePartialDate(end) : { year: now.getFullYear(), month: now.getMonth() + 1 }
  if (!to) return undefined
  const months = (to.year - from.year) * 12 + ((to.month ?? 12) - (from.month ?? 1)) + 1
  return Math.max(0, months)
}

/** "3 yrs 4 mos", like a profile page would say it. */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts: string[] = []
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
  if (rest || !years) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`)
  return parts.join(' ')
}
