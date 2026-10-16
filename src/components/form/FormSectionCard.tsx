import { makeStyles, Text, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    minWidth: 0,
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalS },
  title: { margin: 0 },
})

/** The white rounded panel every form section sits in. */
export function FormSectionCard({
  label,
  hideLabel,
  actions,
  children,
}: {
  label: string
  hideLabel?: boolean
  actions?: ReactNode
  children: ReactNode
}) {
  const styles = useStyles()
  return (
    <section className={styles.card} aria-label={label}>
      {(!hideLabel || actions) && (
        <div className={styles.header}>
          {!hideLabel && (
            <Text as="h2" size={400} weight="semibold" className={styles.title}>
              {label}
            </Text>
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}
