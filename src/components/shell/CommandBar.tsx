import {
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  OverflowItem,
  Toolbar,
  ToolbarButton,
  tokens,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from '@fluentui/react-components'
import { MoreHorizontal20Regular } from '@fluentui/react-icons'
import type { CommandDefinition } from '../../data/types'
import { executeAction, type CommandContext } from '../../platform/commands/execute'
import { registry } from '../../platform/metadata'
import { Icon } from '../common/icons'

const useStyles = makeStyles({
  bar: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    minHeight: '44px',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  },
  toolbar: { minWidth: 0, flexWrap: 'nowrap', overflow: 'hidden' },
  button: { whiteSpace: 'nowrap', fontWeight: tokens.fontWeightRegular },
})

function run(command: CommandDefinition, context: CommandContext) {
  void executeAction(command.action, context)
}

function OverflowMenuItem({ command, context }: { command: CommandDefinition; context: CommandContext }) {
  const visible = useIsOverflowItemVisible(command.id)
  if (visible) return null
  return (
    <MenuItem icon={<Icon name={command.icon} />} onClick={() => run(command, context)}>
      {command.label}
    </MenuItem>
  )
}

function MoreMenu({
  barCommands,
  menuCommands,
  context,
}: {
  barCommands: CommandDefinition[]
  menuCommands: CommandDefinition[]
  context: CommandContext
}) {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>()
  if (!isOverflowing && menuCommands.length === 0) return null
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <ToolbarButton ref={ref} icon={<MoreHorizontal20Regular />} aria-label="More commands" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {barCommands.map((c) => (
            <OverflowMenuItem key={c.id} command={c} context={context} />
          ))}
          {menuCommands.map((c) => (
            <MenuItem key={c.id} icon={<Icon name={c.icon} />} onClick={() => run(c, context)}>
              {c.label}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

/** The page's command bar. Buttons come from data; what doesn't fit moves into "…". */
export function CommandBar({ context }: { context: CommandContext }) {
  const styles = useStyles()
  const { route } = context
  const commands = registry.getCommands(route.pagetype, route.pagetype === 'dashboard' ? undefined : route.etn)
  const barCommands = commands.filter((c) => !c.overflow)
  const menuCommands = commands.filter((c) => c.overflow)

  return (
    <div className={styles.bar}>
      <Overflow padding={48}>
        <Toolbar aria-label="Commands" className={styles.toolbar}>
          {barCommands.map((c) => (
            <OverflowItem key={c.id} id={c.id}>
              <ToolbarButton className={styles.button} icon={<Icon name={c.icon} />} onClick={() => run(c, context)}>
                {c.label}
              </ToolbarButton>
            </OverflowItem>
          ))}
          <MoreMenu barCommands={barCommands} menuCommands={menuCommands} context={context} />
        </Toolbar>
      </Overflow>
    </div>
  )
}
