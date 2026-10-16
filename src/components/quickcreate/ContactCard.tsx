import { Button, makeStyles, MessageBar, MessageBarBody, MessageBarTitle, Persona, tokens } from '@fluentui/react-components'
import { Copy20Regular } from '@fluentui/react-icons'
import { copyText, executeAction } from '../../platform/commands/execute'
import { showToast } from '../../platform/commands/toast'
import { fillTemplate } from '../../platform/format/template'
import { registry } from '../../platform/metadata'
import { Icon } from '../common/icons'

const useStyles = makeStyles({
  card: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalL },
  actions: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalS, alignItems: 'stretch' },
  action: { justifyContent: 'flex-start' },
})

/** Shown after "saving" a lead: the honest admission, and every real way to get in touch. */
export function ContactCard({ values }: { values: Record<string, string> }) {
  const styles = useStyles()
  const { app } = registry.bundle
  const { contact } = app
  const subject = fillTemplate(contact.mailSubjectTemplate, values) || 'Hello'
  const body = fillTemplate(contact.mailBodyTemplate, values)
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div className={styles.card}>
      <MessageBar intent="success" layout="multiline">
        <MessageBarBody>
          <MessageBarTitle>{contact.cardTitle}</MessageBarTitle> {contact.cardBody}
        </MessageBarBody>
      </MessageBar>
      <Persona name={app.ownerName} secondaryText={app.ownerTitle} tertiaryText={contact.email} size="extra-large" avatar={{ color: 'brand' }} />
      <div className={styles.actions}>
        <Button as="a" href={mailto} appearance="primary" className={styles.action} icon={<Icon name="mail" />}>
          Send it as an email
        </Button>
        <Button
          className={styles.action}
          icon={<Copy20Regular />}
          onClick={async () => {
            const copied = await copyText(contact.email)
            showToast(copied ? { intent: 'success', title: app.messages.emailCopied } : { intent: 'warning', title: contact.email })
          }}
        >
          Copy email address
        </Button>
        <Button as="a" href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.action} icon={<Icon name="link" />}>
          LinkedIn
        </Button>
        <Button as="a" href={contact.github} target="_blank" rel="noopener noreferrer" className={styles.action} icon={<Icon name="code" />}>
          GitHub
        </Button>
        <Button
          className={styles.action}
          icon={<Icon name="download" />}
          onClick={() =>
            void executeAction({ type: 'downloadFile', href: contact.cvHref, fileName: contact.cvFileName }, { route: { pagetype: 'dashboard' } })
          }
        >
          Download CV
        </Button>
      </div>
    </div>
  )
}
