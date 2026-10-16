import { Link, makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

/**
 * Renders the Markdown subset used in memo fields: paragraphs, "- " bullet
 * lists, **bold**, `code`, [links](https://…) and ``` fenced blocks.
 * It builds React elements, never HTML strings, so data can't inject markup.
 */
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
  paragraph: { margin: 0 },
  list: { margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalXS },
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '0.92em',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    padding: '1px 4px',
  },
  pre: {
    margin: 0,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    overflowX: 'auto',
    whiteSpace: 'pre',
    overflowWrap: 'normal',
  },
})

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g

function renderInline(text: string, codeClass: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className={codeClass}>
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part)
    if (link) {
      return (
        <Link key={i} href={link[2]} target="_blank" rel="noopener noreferrer" inline>
          {link[1]}
        </Link>
      )
    }
    return part
  })
}

type Block = { kind: 'code'; text: string } | { kind: 'paragraph'; text: string } | { kind: 'list'; items: string[] }

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const chunks = source.replace(/\r\n/g, '\n').split(/```\n?/)
  chunks.forEach((chunk, index) => {
    if (index % 2 === 1) {
      blocks.push({ kind: 'code', text: chunk.replace(/\n$/, '') })
      return
    }
    for (const para of chunk.split(/\n{2,}/)) {
      const lines = para.split('\n').filter((l) => l.trim())
      let text: string[] = []
      let items: string[] = []
      const flushText = () => {
        if (text.length) blocks.push({ kind: 'paragraph', text: text.join(' ') })
        text = []
      }
      const flushItems = () => {
        if (items.length) blocks.push({ kind: 'list', items })
        items = []
      }
      for (const line of lines) {
        const bullet = /^\s*-\s+(.*)$/.exec(line)
        if (bullet) {
          flushText()
          items.push(bullet[1])
        } else {
          flushItems()
          text.push(line.trim())
        }
      }
      flushText()
      flushItems()
    }
  })
  return blocks
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const styles = useStyles()
  return (
    <div className={mergeClasses(styles.root, className)}>
      {parseBlocks(text).map((block, i) => {
        if (block.kind === 'code') {
          return (
            <pre key={i} className={styles.pre} tabIndex={0}>
              {block.text}
            </pre>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={i} className={styles.list}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, styles.code)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className={styles.paragraph}>
            {renderInline(block.text, styles.code)}
          </p>
        )
      })}
    </div>
  )
}
