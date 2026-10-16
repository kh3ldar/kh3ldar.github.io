import {
  Avatar,
  Button,
  makeStyles,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  tokens,
  Tooltip,
} from '@fluentui/react-components'
import {
  Add20Regular,
  Dismiss20Regular,
  GridDots20Regular,
  Navigation20Regular,
  QuestionCircle20Regular,
  Search20Regular,
  Settings20Regular,
  SignOut20Regular,
} from '@fluentui/react-icons'
import { lazy, Suspense, useState, type ReactElement } from 'react'
import { executeAction } from '../../platform/commands/execute'
import { showToast } from '../../platform/commands/toast'
import { registry } from '../../platform/metadata'
import { routeClickHandler } from '../../platform/router/clicks'
import { buildHref, type Route } from '../../platform/router/routes'
import { ui } from '../../platform/state/uiStore'
import { Icon } from '../common/icons'
import { COMPACT_HEADER_QUERY, NARROW_QUERY, useMediaQuery } from '../common/useMediaQuery'
import { useHeaderButtonStyles } from './headerStyles'

// The search box pulls in the Combobox; it loads right after first paint.
const GlobalSearch = lazy(() => import('./GlobalSearch').then((m) => ({ default: m.GlobalSearch })))

const useStyles = makeStyles({
  bar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '48px',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: 'var(--ch-header-bg)',
    color: 'var(--ch-header-fg)',
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: '2px', minWidth: 0, flexShrink: 1 },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    color: 'inherit',
    textDecoration: 'none',
    padding: `0 ${tokens.spacingHorizontalS}`,
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    minWidth: 0,
    whiteSpace: 'nowrap',
    ':hover': { backgroundColor: 'var(--ch-header-hover)' },
    ':focus-visible': { outline: `2px solid var(--ch-header-fg)`, outlineOffset: '-2px' },
  },
  owner: { fontWeight: tokens.fontWeightSemibold, fontSize: tokens.fontSizeBase400 },
  divider: { width: '1px', height: '20px', backgroundColor: 'var(--ch-header-divider)' },
  app: { fontSize: tokens.fontSizeBase400, overflow: 'hidden', textOverflow: 'ellipsis' },
  center: { flexGrow: 1, display: 'flex', justifyContent: 'center', minWidth: 0 },
  search: { width: '100%', maxWidth: '440px' },
  searchPlaceholder: {
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  right: { display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: 'var(--ch-header-bg)',
    zIndex: 2,
  },
  launcher: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalXS, width: '280px' },
  launcherTitle: { padding: `0 ${tokens.spacingHorizontalS} ${tokens.spacingVerticalXS}` },
  app2: {
    display: 'grid',
    gridTemplateColumns: '24px 1fr',
    columnGap: tokens.spacingHorizontalM,
    alignItems: 'center',
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  appText: { display: 'flex', flexDirection: 'column' },
  muted: { color: tokens.colorNeutralForeground3 },
  avatarButton: { padding: '4px', minWidth: '40px' },
})

const HOME: Route = { pagetype: 'dashboard' }

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/)
  return (words[0]?.[0] ?? '') + (words.length > 1 ? (words[words.length - 1][0] ?? '') : '')
}

function HeaderIconButton({ label, icon, onClick }: { label: string; icon: ReactElement; onClick?: () => void }) {
  const styles = useHeaderButtonStyles()
  return (
    <Tooltip content={label} relationship="label">
      <Button appearance="transparent" className={styles.button} icon={icon} onClick={onClick} />
    </Tooltip>
  )
}

function AppLauncher() {
  const styles = useStyles()
  const buttonStyles = useHeaderButtonStyles()
  const { launcher } = registry.bundle.app
  return (
    <Popover positioning="below-start" withArrow={false}>
      <PopoverTrigger disableButtonEnhancement>
        <Tooltip content="App launcher" relationship="label">
          <Button appearance="transparent" className={buttonStyles.button} icon={<GridDots20Regular />} />
        </Tooltip>
      </PopoverTrigger>
      <PopoverSurface aria-label={launcher.title}>
        <nav className={styles.launcher} aria-label={launcher.title}>
          <Text weight="semibold" className={styles.launcherTitle}>
            {launcher.title}
          </Text>
          {launcher.apps.map((app) => (
            <a
              key={app.label}
              className={styles.app2}
              href={app.href}
              {...(app.current
                ? { 'aria-current': 'page' as const, onClick: routeClickHandler(HOME) }
                : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <Icon name={app.icon} fontSize={24} />
              <span className={styles.appText}>
                <Text weight="semibold">{app.label}</Text>
                <Text size={200} className={styles.muted}>
                  {app.description}
                </Text>
              </span>
            </a>
          ))}
        </nav>
      </PopoverSurface>
    </Popover>
  )
}

function QuickCreateMenu() {
  const buttonStyles = useHeaderButtonStyles()
  const creatable = registry.bundle.entities.filter((e) => e.quickCreateFormId)
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Tooltip content="Quick create" relationship="label">
          <Button appearance="transparent" className={buttonStyles.button} icon={<Add20Regular />} />
        </Tooltip>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuGroupHeader>Quick create</MenuGroupHeader>
            {creatable.map((e) => (
              <MenuItem key={e.logicalName} icon={<Icon name={e.icon} />} onClick={() => ui.openQuickCreate(e.logicalName)}>
                {e.displayName}
              </MenuItem>
            ))}
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

function SettingsMenu() {
  const buttonStyles = useHeaderButtonStyles()
  const { personalization, about } = registry.bundle.app
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Tooltip content="Settings" relationship="label">
          <Button appearance="transparent" className={buttonStyles.button} icon={<Settings20Regular />} />
        </Tooltip>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => ui.openDialog({ kind: 'personalization' })}>{personalization.title}</MenuItem>
          <MenuItem onClick={() => ui.openDialog({ kind: 'about' })}>{about.title}</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

function ProfileMenu() {
  const styles = useStyles()
  const buttonStyles = useHeaderButtonStyles()
  const { app } = registry.bundle
  const about = app.profileRoute
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Tooltip content={`Account: ${app.ownerName}`} relationship="description">
          <Button
            appearance="transparent"
            className={mergeClasses(buttonStyles.button, styles.avatarButton)}
            // The accessible name starts with the initials the button shows.
            aria-label={`${initialsOf(app.ownerName)}, account menu for ${app.ownerName}`}
          >
            <Avatar name={app.ownerName} size={28} color="brand" aria-hidden />
          </Button>
        </Tooltip>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuGroupHeader>
              {app.ownerName} · {app.ownerTitle}
            </MenuGroupHeader>
            <MenuItemLink href={buildHref(about)} icon={<Icon name="contact" />} onClick={routeClickHandler(about)}>
              About me
            </MenuItemLink>
            <MenuItem
              icon={<Icon name="download" />}
              onClick={() => void executeAction({ type: 'downloadFile', href: app.contact.cvHref, fileName: app.contact.cvFileName }, { route: HOME })}
            >
              Download CV
            </MenuItem>
            <MenuItemLink href={`mailto:${app.contact.email}`} icon={<Icon name="mail" />}>
              Email me
            </MenuItemLink>
            <MenuItemLink href={app.contact.linkedin} target="_blank" rel="noopener noreferrer" icon={<Icon name="link" />}>
              LinkedIn
            </MenuItemLink>
            <MenuItemLink href={app.contact.github} target="_blank" rel="noopener noreferrer" icon={<Icon name="code" />}>
              GitHub
            </MenuItemLink>
          </MenuGroup>
          <MenuDivider />
          <MenuItem icon={<SignOut20Regular />} onClick={() => showToast({ intent: 'info', title: app.messages.signOutToast })}>
            Sign out
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

/** The navy header: launcher, owner and app name, search, quick create, settings, help, profile. */
export function TopBar() {
  const styles = useStyles()
  const narrow = useMediaQuery(NARROW_QUERY)
  const compact = useMediaQuery(COMPACT_HEADER_QUERY)
  const [searchOpen, setSearchOpen] = useState(false)
  const { app } = registry.bundle

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        {narrow && <HeaderIconButton label="Site map" icon={<Navigation20Regular />} onClick={() => ui.setNavOpen(true)} />}
        <AppLauncher />
        <a className={styles.brand} href={buildHref(HOME)} onClick={routeClickHandler(HOME)}>
          {!compact && <span className={styles.owner}>{app.ownerName}</span>}
          {!compact && <span className={styles.divider} aria-hidden />}
          <span className={styles.app}>{app.appName}</span>
        </a>
      </div>
      <div className={styles.center}>
        {!compact && (
          <div className={styles.search}>
            <Suspense fallback={<div className={styles.searchPlaceholder} />}>
              <GlobalSearch />
            </Suspense>
          </div>
        )}
      </div>
      <div className={styles.right}>
        {compact && <HeaderIconButton label="Search" icon={<Search20Regular />} onClick={() => setSearchOpen(true)} />}
        <QuickCreateMenu />
        <SettingsMenu />
        {!compact && (
          <HeaderIconButton
            label="Help"
            icon={<QuestionCircle20Regular />}
            onClick={() => void executeAction({ type: 'openUrl', href: app.helpUrl }, { route: HOME })}
          />
        )}
        <ProfileMenu />
      </div>
      {compact && searchOpen && (
        <div className={styles.overlay}>
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <Suspense fallback={<div className={styles.searchPlaceholder} />}>
              <GlobalSearch autoFocus onDone={() => setSearchOpen(false)} />
            </Suspense>
          </div>
          <HeaderIconButton label="Close search" icon={<Dismiss20Regular />} onClick={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  )
}
