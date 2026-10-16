import { makeStyles, tokens } from '@fluentui/react-components'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { CommandContext } from '../../platform/commands/execute'
import { getNavigationInfo, setScrollContainer } from '../../platform/router/history'
import { buildHref } from '../../platform/router/routes'
import { CommandBar } from './CommandBar'

const useStyles = makeStyles({
  frame: { display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, flexGrow: 1 },
  scroll: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  content: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalXXXL}`,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    '@media (max-width: 640px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM} ${tokens.spacingVerticalXXL}`,
    },
  },
})

/**
 * Command bar on top, scrolling content below. The content pane is the scroll
 * container: pushes start at the top, Back and Forward restore the position.
 */
export function PageFrame({ context, children }: { context: CommandContext; children: ReactNode }) {
  const styles = useStyles()
  const scrollRef = useRef<HTMLDivElement>(null)
  const href = buildHref(context.route)

  useLayoutEffect(() => {
    const element = scrollRef.current
    setScrollContainer(element)
    const { kind, scrollTop } = getNavigationInfo()
    if (element && kind !== 'replace') element.scrollTop = kind === 'pop' ? scrollTop : 0
    return () => setScrollContainer(null)
  }, [href])

  return (
    <div className={styles.frame}>
      <CommandBar context={context} />
      <div ref={scrollRef} className={styles.scroll} id="main-content" tabIndex={-1}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
