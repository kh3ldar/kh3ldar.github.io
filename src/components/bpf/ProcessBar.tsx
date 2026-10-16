import {
  Button,
  makeStyles,
  mergeClasses,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  tokens,
} from '@fluentui/react-components'
import { CheckmarkCircle20Filled, ChevronRight16Regular, Circle20Filled } from '@fluentui/react-icons'
import type { BpfDefinition, BpfStage } from '../../data/types'
import { executeAction, type CommandContext } from '../../platform/commands/execute'

const useStyles = makeStyles({
  bar: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    display: 'flex',
    alignItems: 'stretch',
    minWidth: 0,
    overflowX: 'auto',
  },
  process: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  caption: { color: tokens.colorNeutralForeground3 },
  stages: { display: 'flex', alignItems: 'center', flexGrow: 1, padding: `0 ${tokens.spacingHorizontalS}` },
  stage: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    minHeight: '52px',
    flexShrink: 0,
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  stageText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  completed: { color: tokens.colorBrandForeground1 },
  active: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  chevron: { color: tokens.colorNeutralForeground3, flexShrink: 0 },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
  },
  flyout: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalM, maxWidth: '320px' },
  steps: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`, margin: 0 },
  stepLabel: { color: tokens.colorNeutralForeground3 },
  stepValue: { margin: 0, fontWeight: tokens.fontWeightSemibold },
})

function StageButton({ stage, bpf, context, last }: { stage: BpfStage; bpf: BpfDefinition; context: CommandContext; last: boolean }) {
  const styles = useStyles()
  const active = stage.status === 'active'
  return (
    <Popover withArrow positioning="below-start">
      <PopoverTrigger disableButtonEnhancement>
        <Button
          appearance="transparent"
          className={mergeClasses(styles.stage, active && styles.active)}
          icon={
            active ? (
              <Circle20Filled className={styles.completed} />
            ) : (
              <CheckmarkCircle20Filled className={styles.completed} />
            )
          }
        >
          <span className={styles.stageText}>
            <Text weight={active ? 'semibold' : 'regular'}>{stage.label}</Text>
            {stage.caption && (
              <Text size={200} className={styles.caption}>
                {stage.caption}
              </Text>
            )}
          </span>
          {/* Spoken after the visible text, so the accessible name still contains what is on screen. */}
          <span className={styles.srOnly}>, {active ? 'active stage' : 'completed stage'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverSurface aria-label={stage.label}>
        <div className={styles.flyout}>
          <Text weight="semibold" size={400}>
            {stage.label}
          </Text>
          <dl className={styles.steps}>
            {stage.steps.map((step) => (
              <div key={step.label} style={{ display: 'contents' }}>
                <dt className={styles.stepLabel}>{step.label}</dt>
                <dd className={styles.stepValue}>{step.value}</dd>
              </div>
            ))}
          </dl>
          {active && last && (
            <Button appearance="primary" onClick={() => void executeAction(bpf.finish.action, context)}>
              {bpf.finish.label}
            </Button>
          )}
        </div>
      </PopoverSurface>
    </Popover>
  )
}

/** A business process flow bar: completed stages, one active stage, and Finish on the last one. */
export function ProcessBar({ bpf, context }: { bpf: BpfDefinition; context: CommandContext }) {
  const styles = useStyles()
  return (
    <nav className={styles.bar} aria-label={`${bpf.name} business process flow`}>
      <div className={styles.process}>
        <Text weight="semibold">{bpf.name}</Text>
        {bpf.caption && (
          <Text size={200} className={styles.caption}>
            {bpf.caption}
          </Text>
        )}
      </div>
      <div className={styles.stages}>
        {bpf.stages.map((stage, index) => (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && <ChevronRight16Regular className={styles.chevron} aria-hidden />}
            <StageButton stage={stage} bpf={bpf} context={context} last={index === bpf.stages.length - 1} />
          </div>
        ))}
      </div>
    </nav>
  )
}
