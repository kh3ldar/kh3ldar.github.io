import {
  Button,
  Hamburger,
  makeStyles,
  Menu,
  MenuButton,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  tokens,
  Tooltip,
} from '@fluentui/react-components'
import { ArrowSwap20Regular } from '@fluentui/react-icons'
import { Fragment, type MouseEvent } from 'react'
import type { SiteMapArea } from '../../data/types'
import { registry } from '../../platform/metadata'
import { matchSubarea, resolveArea } from '../../platform/metadata/sitemap'
import { navigate } from '../../platform/router/history'
import { isPlainLeftClick } from '../../platform/router/clicks'
import { buildHref, type Route } from '../../platform/router/routes'
import { ui, useUi } from '../../platform/state/uiStore'
import { Icon } from '../common/icons'
import { NARROW_QUERY, useMediaQuery } from '../common/useMediaQuery'

const useStyles = makeStyles({
  drawer: {
    width: '232px',
    flexShrink: 0,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  overlay: { width: '280px', maxWidth: '85vw' },
  footer: { padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`, borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  areaButton: { width: '100%', justifyContent: 'space-between' },
  rail: {
    width: '48px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '2px',
    padding: `${tokens.spacingVerticalS} 0`,
    backgroundColor: tokens.colorNeutralBackground4,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  railSpacer: { flexGrow: 1 },
  railItem: { minWidth: '40px', height: '40px' },
  railSelected: { backgroundColor: tokens.colorNeutralBackground1Selected, color: tokens.colorBrandForeground1 },
})

function goToArea(area: SiteMapArea) {
  ui.setArea(area.id)
  const first = area.groups[0]?.subareas[0]
  if (first) navigate(first.route)
}

function AreaSwitcher({ area, iconOnly }: { area: SiteMapArea; iconOnly?: boolean }) {
  const styles = useStyles()
  const { areas } = registry.bundle.sitemap
  return (
    <Menu
      checkedValues={{ area: [area.id] }}
      onCheckedValueChange={(_, data) => {
        const next = areas.find((a) => a.id === data.checkedItems[0])
        if (next && next.id !== area.id) goToArea(next)
      }}
      positioning={iconOnly ? 'after-bottom' : 'above-start'}
    >
      <MenuTrigger disableButtonEnhancement>
        {iconOnly ? (
          <Tooltip content={`Change area (${area.label})`} relationship="label" positioning="after">
            <Button appearance="subtle" className={styles.railItem} icon={<ArrowSwap20Regular />} />
          </Tooltip>
        ) : (
          <MenuButton appearance="subtle" className={styles.areaButton} icon={<Icon name={area.icon} />} menuIcon={<ArrowSwap20Regular />} aria-label={`Change area, current area ${area.label}`}>
            {area.label}
          </MenuButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {areas.map((a) => (
            <MenuItemRadio key={a.id} name="area" value={a.id} icon={<Icon name={a.icon} />}>
              {a.label}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

function onNavClick(route: Route, after?: () => void) {
  return (event: MouseEvent) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()
    navigate(route)
    after?.()
  }
}

/** The left sitemap: groups of subareas for the current area, an area switcher, and a collapsed rail. */
export function SiteMapNav({ route }: { route: Route }) {
  const styles = useStyles()
  const narrow = useMediaQuery(NARROW_QUERY)
  const navOpen = useUi((s) => s.navOpen)
  const collapsed = useUi((s) => s.navCollapsed)
  const pickedArea = useUi((s) => s.areaId)
  const { sitemap } = registry.bundle
  const area = resolveArea(sitemap, route, pickedArea)
  const match = matchSubarea(sitemap, route)
  const selected = match && match.area.id === area.id ? match.subarea.id : ''

  if (!narrow && collapsed) {
    return (
      <nav className={styles.rail} aria-label="Site map">
        <Tooltip content="Expand site map" relationship="label" positioning="after">
          <Hamburger className={styles.railItem} onClick={() => ui.setNavCollapsed(false)} />
        </Tooltip>
        {area.groups.flatMap((g) => g.subareas).map((s) => (
          <Tooltip key={s.id} content={s.label} relationship="label" positioning="after">
            <Button
              as="a"
              href={buildHref(s.route)}
              appearance="subtle"
              aria-current={s.id === selected ? 'page' : undefined}
              className={mergeClasses(styles.railItem, s.id === selected && styles.railSelected)}
              icon={<Icon name={s.icon} />}
              onClick={onNavClick(s.route)}
            />
          </Tooltip>
        ))}
        <div className={styles.railSpacer} />
        <AreaSwitcher area={area} iconOnly />
      </nav>
    )
  }

  const close = narrow ? () => ui.setNavOpen(false) : undefined
  return (
    <NavDrawer
      type={narrow ? 'overlay' : 'inline'}
      open={narrow ? navOpen : true}
      onOpenChange={(_, data) => ui.setNavOpen(data.open)}
      selectedValue={selected}
      className={mergeClasses(styles.drawer, narrow && styles.overlay)}
      aria-label="Site map"
    >
      <NavDrawerHeader>
        <Tooltip content={narrow ? 'Close site map' : 'Collapse site map'} relationship="label">
          <Hamburger onClick={() => (narrow ? ui.setNavOpen(false) : ui.setNavCollapsed(true))} />
        </Tooltip>
      </NavDrawerHeader>
      <NavDrawerBody>
        {area.groups.map((group) => (
          <Fragment key={group.id}>
            <NavSectionHeader>{group.label}</NavSectionHeader>
            {group.subareas.map((s) => (
              <NavItem key={s.id} value={s.id} href={buildHref(s.route)} icon={<Icon name={s.icon} />} onClick={onNavClick(s.route, close)}>
                {s.label}
              </NavItem>
            ))}
          </Fragment>
        ))}
      </NavDrawerBody>
      <NavDrawerFooter className={styles.footer}>
        <AreaSwitcher area={area} />
      </NavDrawerFooter>
    </NavDrawer>
  )
}
