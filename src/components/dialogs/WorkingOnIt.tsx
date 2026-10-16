import { makeStyles, Portal, Spinner, tokens } from '@fluentui/react-components'
import { registry } from '../../platform/metadata'
import { useUi } from '../../platform/state/uiStore'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorBackgroundOverlay,
  },
  box: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
  },
})

/** The platform's "Working on it..." overlay, shown while Refresh runs. */
export function WorkingOnIt() {
  const styles = useStyles()
  const working = useUi((s) => s.working)
  if (!working) return null
  return (
    <Portal>
      <div className={styles.overlay} role="status" aria-live="polite">
        <div className={styles.box}>
          <Spinner label={registry.bundle.app.messages.working} labelPosition="after" />
        </div>
      </div>
    </Portal>
  )
}
