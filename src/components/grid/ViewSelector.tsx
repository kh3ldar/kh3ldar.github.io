import {
  makeStyles,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components'
import { Pin20Regular } from '@fluentui/react-icons'
import type { SavedView } from '../../data/types'
import { showToast } from '../../platform/commands/toast'
import { registry } from '../../platform/metadata'
import { navigate } from '../../platform/router/history'
import { ui } from '../../platform/state/uiStore'

const useStyles = makeStyles({
  button: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    paddingLeft: tokens.spacingHorizontalXS,
    minWidth: 0,
    maxWidth: '100%',
    justifyContent: 'flex-start',
  },
  default: { color: tokens.colorNeutralForeground3, marginLeft: tokens.spacingHorizontalXS },
})

/** The "Active Positions ▾" view switcher, with "Set as default view". */
export function ViewSelector({ etn, view, defaultViewId }: { etn: string; view: SavedView; defaultViewId: string | undefined }) {
  const styles = useStyles()
  const views = registry.getSelectableViews(etn)
  const { messages } = registry.bundle.app

  return (
    <Menu
      checkedValues={{ view: [view.id] }}
      onCheckedValueChange={(_, data) => {
        const viewid = data.checkedItems[0]
        if (viewid && viewid !== view.id) navigate({ pagetype: 'entitylist', etn, viewid })
      }}
    >
      <MenuTrigger disableButtonEnhancement>
        <MenuButton appearance="transparent" size="large" className={styles.button}>
          {view.name}
        </MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuGroupHeader>System views</MenuGroupHeader>
            {views.map((v) => (
              <MenuItemRadio key={v.id} name="view" value={v.id}>
                {v.name}
                {v.id === defaultViewId && <span className={styles.default}>(default)</span>}
              </MenuItemRadio>
            ))}
          </MenuGroup>
          <MenuDivider />
          <MenuItem
            icon={<Pin20Regular />}
            disabled={view.id === defaultViewId}
            onClick={() => {
              ui.setDefaultView(etn, view.id)
              showToast({ intent: 'success', title: messages.defaultViewSaved })
            }}
          >
            {messages.setDefaultView}
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
