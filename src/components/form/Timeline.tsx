import { Avatar, makeStyles, SearchBox, Text, tokens } from '@fluentui/react-components'
import { ArrowSync20Regular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import type { EntityRecord, TimelinePost } from '../../data/types'
import { formatDate } from '../../platform/format/dates'
import { registry } from '../../platform/metadata'
import { FormSectionCard } from './FormSectionCard'

const useStyles = makeStyles({
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' },
  item: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr)',
    columnGap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalM} 0`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    ':first-child': { borderTop: 'none', paddingTop: 0 },
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground3,
  },
  body: { display: 'flex', flexDirection: 'column', rowGap: '2px', minWidth: 0 },
  auto: { fontStyle: 'italic' },
  search: { width: '180px', maxWidth: '50%' },
  empty: { color: tokens.colorNeutralForeground3 },
})

const KIND_LABEL: Record<TimelinePost['kind'], string> = { auto: 'Auto-post', post: 'Post', note: 'Note' }

/** The record's timeline: posts newest first, as authored, with a working search box. */
export function Timeline({ label, record }: { label: string; record: EntityRecord }) {
  const styles = useStyles()
  const [query, setQuery] = useState('')
  const { app } = registry.bundle
  const posts = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const all = record.timeline ?? []
    return needle ? all.filter((p) => `${p.title} ${p.body ?? ''}`.toLowerCase().includes(needle)) : all
  }, [record.timeline, query])

  return (
    <FormSectionCard
      label={label}
      actions={
        <SearchBox
          size="small"
          className={styles.search}
          placeholder="Search timeline"
          aria-label="Search timeline"
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
      }
    >
      {posts.length === 0 ? (
        <Text className={styles.empty}>{app.messages.noData}</Text>
      ) : (
        <ol className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.item}>
              {post.kind === 'auto' ? (
                <Avatar size={32} icon={<ArrowSync20Regular />} color="neutral" aria-hidden />
              ) : (
                <Avatar size={32} name={app.ownerName} color="brand" aria-hidden />
              )}
              <div className={styles.body}>
                <div className={styles.meta}>
                  <Text size={200}>{KIND_LABEL[post.kind]}</Text>
                  {post.date && <Text size={200}>{formatDate(post.date)}</Text>}
                </div>
                <Text weight={post.kind === 'auto' ? 'regular' : 'semibold'} className={post.kind === 'auto' ? styles.auto : undefined}>
                  {post.title}
                </Text>
                {post.body && <Text>{post.body}</Text>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </FormSectionCard>
  )
}
