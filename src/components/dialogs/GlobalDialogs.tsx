import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  makeStyles,
  Option,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  Text,
  tokens,
} from '@fluentui/react-components'
import { ErrorCircle24Regular } from '@fluentui/react-icons'
import { useState } from 'react'
import type { GagDefinition } from '../../data/types'
import { executeAction, triggerDownload } from '../../platform/commands/execute'
import { showToast } from '../../platform/commands/toast'
import { formatDate } from '../../platform/format/dates'
import { fillTemplate } from '../../platform/format/template'
import { registry } from '../../platform/metadata'
import { parseRoute } from '../../platform/router/routes'
import { ui, useUi, type GagContext, type ThemeSetting } from '../../platform/state/uiStore'

const useStyles = makeStyles({
  titleRow: { display: 'flex', alignItems: 'center', columnGap: tokens.spacingHorizontalS },
  errorIcon: { color: tokens.colorPaletteRedForeground1, flexShrink: 0 },
  content: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalM },
  details: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: `2px ${tokens.spacingHorizontalM}`,
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  dd: { margin: 0, fontFamily: tokens.fontFamilyMonospace, overflowWrap: 'anywhere' },
  tabPanel: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalM, paddingTop: tokens.spacingVerticalM, minHeight: '150px' },
  note: { color: tokens.colorNeutralForeground3 },
})

function newActivityId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`
  }
}

function GagDialog({ gag, context }: { gag: GagDefinition; context: GagContext }) {
  const styles = useStyles()
  const [activityId] = useState(newActivityId)
  const [timestamp] = useState(() => new Date().toISOString())
  const entity = context.etn ? registry.getEntity(context.etn) : undefined
  const record = context.etn && context.recordId ? registry.getRecord(context.etn, context.recordId) : undefined
  const values = {
    entity: entity?.displayName.toLowerCase() ?? 'record',
    Entity: entity?.displayName ?? 'Record',
    entities: entity?.displayCollectionName.toLowerCase() ?? 'records',
    record: record ? registry.getPrimaryName(record) : '',
  }
  const title = fillTemplate(gag.title.replace('{entity}', '{Entity}'), values)
  const message = fillTemplate(gag.message, values)
  const route = parseRoute(new URL(context.location).search)

  const downloadLog = () => {
    const text = fillTemplate(registry.bundle.app.errorLogTemplate, {
      title,
      message,
      errorCode: gag.errorCode ?? 'n/a',
      activityId,
      timestamp,
      location: context.location,
    })
    const url = URL.createObjectURL(new Blob([text + '\n'], { type: 'text/plain' }))
    triggerDownload(url, 'ErrorDetails.txt')
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <DialogSurface aria-describedby="gag-message">
      <DialogBody>
        <DialogTitle>
          <span className={styles.titleRow}>
            {gag.errorCode && <ErrorCircle24Regular className={styles.errorIcon} aria-hidden />}
            {title}
          </span>
        </DialogTitle>
        <DialogContent className={styles.content}>
          <Text id="gag-message">{message}</Text>
          {gag.errorCode && (
            <dl className={styles.details}>
              <dt>Error code</dt>
              <dd className={styles.dd}>{gag.errorCode}</dd>
              <dt>Activity ID</dt>
              <dd className={styles.dd}>{activityId}</dd>
              <dt>Time</dt>
              <dd className={styles.dd}>{timestamp}</dd>
            </dl>
          )}
        </DialogContent>
        <DialogActions fluid>
          {gag.showLog && <Button onClick={downloadLog}>Download log file</Button>}
          {gag.primary && (
            <Button
              appearance="primary"
              onClick={() => {
                ui.closeDialog()
                void executeAction(gag.primary!.action, { route })
              }}
            >
              {gag.primary.label}
            </Button>
          )}
          <Button appearance={gag.primary ? 'secondary' : 'primary'} onClick={() => ui.closeDialog()}>
            OK
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  )
}

function PersonalizationDialog() {
  const styles = useStyles()
  const theme = useUi((s) => s.theme)
  const [tab, setTab] = useState<'general' | 'languages'>('general')
  const { personalization } = registry.bundle.app
  return (
    <DialogSurface>
      <DialogBody>
        <DialogTitle>{personalization.title}</DialogTitle>
        <DialogContent>
          <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as 'general' | 'languages')}>
            <Tab value="general">General</Tab>
            <Tab value="languages">Languages</Tab>
          </TabList>
          <div className={styles.tabPanel} role="tabpanel" aria-label={tab === 'general' ? 'General' : 'Languages'}>
            {tab === 'general' ? (
              <Field label={personalization.themeLabel}>
                <RadioGroup value={theme} onChange={(_, d) => ui.setTheme(d.value as ThemeSetting)}>
                  <Radio value="system" label={personalization.themeOptions.system} />
                  <Radio value="light" label={personalization.themeOptions.light} />
                  <Radio value="dark" label={personalization.themeOptions.dark} />
                </RadioGroup>
              </Field>
            ) : (
              <Field label={personalization.languageLabel} hint={personalization.languageNote}>
                <Dropdown value={personalization.languageValue} selectedOptions={['en']} disabled>
                  <Option value="en">{personalization.languageValue}</Option>
                </Dropdown>
              </Field>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button appearance="primary" onClick={() => ui.closeDialog()}>
            OK
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  )
}

function AboutDialog() {
  const styles = useStyles()
  const { about } = registry.bundle.app
  const values = { version: __APP_VERSION__, buildDate: formatDate(__BUILD_DATE__.slice(0, 10)) }
  return (
    <DialogSurface>
      <DialogBody>
        <DialogTitle>{about.title}</DialogTitle>
        <DialogContent>
          <dl className={styles.details} style={{ fontSize: tokens.fontSizeBase300, rowGap: tokens.spacingVerticalS }}>
            {about.lines.map((line) => (
              <div key={line.label} style={{ display: 'contents' }}>
                <dt>{line.label}</dt>
                <dd className={styles.dd} style={{ fontFamily: 'inherit', color: tokens.colorNeutralForeground1 }}>
                  {fillTemplate(line.value, values)}
                </dd>
              </div>
            ))}
          </dl>
        </DialogContent>
        <DialogActions>
          <Button appearance="primary" onClick={() => ui.closeDialog()}>
            OK
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  )
}

function SessionDialog() {
  const { session, messages } = registry.bundle.app
  return (
    <DialogSurface>
      <DialogBody>
        <DialogTitle>{session.title}</DialogTitle>
        <DialogContent>{session.body}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              ui.closeDialog()
              showToast({ intent: 'info', title: messages.signOutToast })
            }}
          >
            {session.signOutLabel}
          </Button>
          <Button appearance="primary" onClick={() => ui.closeDialog()}>
            {session.continueLabel}
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  )
}

/** Renders whichever global dialog the UI store asks for. */
export function GlobalDialogs() {
  const dialog = useUi((s) => s.dialog)
  const gag = dialog?.kind === 'gag' ? registry.getGag(dialog.gagId) : undefined
  let content = <></>
  if (dialog?.kind === 'gag' && gag) content = <GagDialog key={dialog.gagId} gag={gag} context={dialog.context} />
  else if (dialog?.kind === 'personalization') content = <PersonalizationDialog />
  else if (dialog?.kind === 'about') content = <AboutDialog />
  else if (dialog?.kind === 'session') content = <SessionDialog />
  return (
    <Dialog
      open={dialog !== null}
      modalType={dialog?.kind === 'gag' || dialog?.kind === 'session' ? 'alert' : 'modal'}
      onOpenChange={(_, data) => {
        if (!data.open) ui.closeDialog()
      }}
    >
      {content}
    </Dialog>
  )
}
