import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(import.meta.dirname, '..', '..')
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.html', '.md', '.json', '.svg', '.txt', '.js'])

function filesUnder(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return filesUnder(path)
    return TEXT_EXTENSIONS.has(extname(name)) ? [path] : []
  })
}

/** Turkish mobile numbers (5xx xxx xx xx, optionally +90 / 0) and any +country number. */
const PHONE_PATTERNS = [
  /(?:\+?90[\s.-]?|\b0)?\(?5\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}\b/,
  /\+\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3}[\s.-]?\d{2,4}/,
]

describe('repository guards', () => {
  it('publishes no phone number anywhere the site is built from', () => {
    const files = [...filesUnder(join(ROOT, 'src')), ...filesUnder(join(ROOT, 'public')), ...filesUnder(join(ROOT, 'content')), join(ROOT, 'index.html')]
    const offenders = files.filter((file) => {
      const text = readFileSync(file, 'utf8')
      return PHONE_PATTERNS.some((pattern) => pattern.test(text))
    })
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([])
  })

  it('keeps components and pages free of per-entity branching', () => {
    const files = [...filesUnder(join(ROOT, 'src', 'components')), ...filesUnder(join(ROOT, 'src', 'pages'))]
    const branching = /\b(?:etn|logicalName|entityName)\s*[!=]==?\s*['"`]/
    const offenders = files.filter((file) => branching.test(readFileSync(file, 'utf8')))
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([])
  })
})
