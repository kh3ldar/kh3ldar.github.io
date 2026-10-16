import type { FluentIconsProps } from '@fluentui/react-icons'
import type { IconName } from '../../data/types'
import { icons } from './iconMap'

export function Icon({ name, ...props }: { name: IconName } & FluentIconsProps) {
  const Component = icons[name]
  return <Component aria-hidden {...props} />
}
