import type { GagDefinition } from './types'

/** Platform-flavoured dialogs for the buttons that cannot really work on a CV. */
export const gags: GagDefinition[] = [
  {
    id: 'new-record',
    title: 'Insufficient permissions',
    message: "You don't have privileges to create {entities}. Only the owner adds those. You can create a Lead, though.",
    errorCode: '0x80040220',
    primary: { label: 'New Lead', action: { type: 'openQuickCreate', etn: 'lead' } },
  },
  {
    id: 'delete',
    title: 'Business Process Error',
    message: "This {entity} can't be deleted. It is referenced by one active career.",
    errorCode: '0x80040265',
    showLog: true,
  },
  {
    id: 'assign',
    title: 'Assign {entity}',
    message: 'Records here can only be assigned to teams. Is yours hiring?',
    primary: { label: 'Create Lead', action: { type: 'openQuickCreate', etn: 'lead' } },
  },
  {
    id: 'flow',
    title: 'Business Process Error',
    message: 'No flows are turned on in this environment. Everything here runs synchronously, on purpose.',
    errorCode: '0x80040265',
    showLog: true,
  },
  {
    id: 'run-report',
    title: 'Run Report',
    message: 'The report server is offline. Good news: the dashboard is the report.',
    primary: { label: 'Open dashboard', action: { type: 'navigate', route: { pagetype: 'dashboard' } } },
  },
]
