import { makeStyles, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'
import type { Route } from '../../platform/router/routes'
import { SiteMapNav } from './SiteMapNav'
import { TopBar } from './TopBar'

const useStyles = makeStyles({
  app: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 },
  body: { display: 'flex', flexGrow: 1, minHeight: 0 },
  main: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, minHeight: 0 },
  skip: {
    position: 'absolute',
    left: tokens.spacingHorizontalS,
    top: '-100px',
    zIndex: 10,
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    ':focus': { top: tokens.spacingVerticalS },
  },
})

/** Header on top, sitemap on the left, the page on the right. */
export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const styles = useStyles()
  return (
    <div className={styles.app}>
      <a className={styles.skip} href="#main-content">
        Skip to content
      </a>
      <TopBar />
      <div className={styles.body}>
        <SiteMapNav route={route} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
