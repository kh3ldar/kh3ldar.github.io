import { makeStyles, tokens } from '@fluentui/react-components'

/** Icon buttons on the navy header: white glyphs, translucent hover, no brand recolouring. */
export const useHeaderButtonStyles = makeStyles({
  button: {
    color: 'var(--ch-header-fg)',
    minWidth: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    ':hover': { color: 'var(--ch-header-fg)', backgroundColor: 'var(--ch-header-hover)' },
    ':hover:active': { color: 'var(--ch-header-fg)', backgroundColor: 'var(--ch-header-pressed)' },
    ':hover .fui-Button__icon': { color: 'var(--ch-header-fg)' },
    ':hover:active .fui-Button__icon': { color: 'var(--ch-header-fg)' },
    '[aria-expanded="true"]': { backgroundColor: 'var(--ch-header-pressed)' },
  },
})
