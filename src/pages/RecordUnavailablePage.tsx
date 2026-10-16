import { makeStyles, Text, tokens } from '@fluentui/react-components'
import { DocumentError24Regular } from '@fluentui/react-icons'
import { registry } from '../platform/metadata'
import { RouteLink } from '../platform/router/RouteLink'
import type { Route } from '../platform/router/routes'
import { PageFrame } from '../components/shell/PageFrame'

const useStyles = makeStyles({
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalXXL,
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    alignItems: 'flex-start',
  },
  icon: { color: tokens.colorPaletteRedForeground1, fontSize: '32px' },
})

/** The platform's "Record is unavailable" page, for unknown entities, records and views. */
export function RecordUnavailablePage({ route }: { route: Route }) {
  const styles = useStyles()
  const { messages } = registry.bundle.app
  return (
    <PageFrame context={{ route }}>
      <div className={styles.panel} role="alert">
        <DocumentError24Regular className={styles.icon} />
        <Text as="h1" size={600} weight="semibold">
          {messages.recordUnavailableTitle}
        </Text>
        <Text>{messages.recordUnavailableBody}</Text>
        <RouteLink route={{ pagetype: 'dashboard' }}>Go to the dashboard</RouteLink>
      </div>
    </PageFrame>
  )
}
