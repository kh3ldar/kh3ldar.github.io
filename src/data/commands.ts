import type { CommandDefinition } from './types'

const cv = { type: 'downloadFile', href: '/cv/Baris-Kuzu-CV.pdf', fileName: 'Baris-Kuzu-CV.pdf' } as const

/** Command bar buttons, in display order. Scope decides which pages show them. */
export const commands: CommandDefinition[] = [
  { id: 'back', label: 'Back', icon: 'back', action: { type: 'back' }, scope: ['entityrecord'] },
  {
    id: 'new',
    label: 'New',
    icon: 'add',
    action: { type: 'gag', gagId: 'new-record' },
    scope: ['entitylist'],
  },
  {
    id: 'newlead',
    label: 'New Lead',
    icon: 'lead',
    action: { type: 'openQuickCreate', etn: 'lead' },
    scope: ['dashboard', 'entityrecord'],
  },
  { id: 'downloadcv', label: 'Download CV', icon: 'download', action: cv, scope: ['dashboard', 'entitylist', 'entityrecord'] },
  { id: 'delete', label: 'Delete', icon: 'delete', action: { type: 'gag', gagId: 'delete' }, scope: ['entityrecord'] },
  { id: 'refresh', label: 'Refresh', icon: 'refresh', action: { type: 'refresh' }, scope: ['dashboard', 'entitylist', 'entityrecord'] },
  { id: 'export', label: 'Export to Excel', icon: 'excel', action: { type: 'exportExcel' }, scope: ['entitylist'] },
  { id: 'assign', label: 'Assign', icon: 'assign', action: { type: 'gag', gagId: 'assign' }, scope: ['entityrecord'] },
  { id: 'share', label: 'Share', icon: 'share', action: { type: 'share' }, scope: ['dashboard', 'entitylist', 'entityrecord'] },
  {
    id: 'flow',
    label: 'Flow',
    icon: 'flow',
    action: { type: 'gag', gagId: 'flow' },
    scope: ['entitylist', 'entityrecord'],
    overflow: true,
  },
  {
    id: 'report',
    label: 'Run Report',
    icon: 'report',
    action: { type: 'gag', gagId: 'run-report' },
    scope: ['entitylist', 'entityrecord'],
    overflow: true,
  },
]
