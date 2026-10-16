import { Combobox, makeStyles, Option, OptionGroup, Text, tokens } from '@fluentui/react-components'
import { Search20Regular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { registry } from '../../platform/metadata'
import { navigate } from '../../platform/router/history'
import { searchRecords } from '../../platform/query/search'

const useStyles = makeStyles({
  combobox: { width: '100%', minWidth: 0 },
  listbox: { width: 'min(480px, calc(100vw - 32px))', maxHeight: '70vh' },
  option: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 },
  snippet: { color: tokens.colorNeutralForeground3, overflowWrap: 'anywhere' },
})

/** Header search across every record: names first, then searchable text with a snippet. */
export function GlobalSearch({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const styles = useStyles()
  const { messages } = registry.bundle.app
  const [query, setQuery] = useState('')
  const groups = useMemo(() => searchRecords(registry, query), [query])
  const searching = query.trim().length >= 2

  return (
    <Combobox
      className={styles.combobox}
      appearance="filled-lighter"
      freeform
      autoFocus={autoFocus}
      placeholder={messages.searchPlaceholder}
      aria-label="Search records"
      expandIcon={<Search20Regular />}
      value={query}
      open={searching}
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setQuery('')
          onDone?.()
        }
      }}
      onOptionSelect={(_, data) => {
        const [etn, id] = (data.optionValue ?? '').split(':')
        if (etn && id) {
          navigate({ pagetype: 'entityrecord', etn, id })
          setQuery('')
          onDone?.()
        }
      }}
      listbox={{ className: styles.listbox }}
      positioning="below-start"
    >
      {searching && groups.length === 0 && (
        <Option value="" text={query} disabled>
          {messages.searchNoResults}
        </Option>
      )}
      {groups.map((group) => (
        <OptionGroup key={group.entity.logicalName} label={group.entity.displayCollectionName}>
          {group.hits.map((hit) => (
            <Option key={`${hit.etn}:${hit.id}`} value={`${hit.etn}:${hit.id}`} text={hit.name}>
              <span className={styles.option}>
                <Text weight="semibold">{hit.name}</Text>
                {hit.snippet && (
                  <Text size={200} className={styles.snippet}>
                    {hit.matchedAttribute}: {hit.snippet}
                  </Text>
                )}
              </span>
            </Option>
          ))}
        </OptionGroup>
      ))}
    </Combobox>
  )
}
