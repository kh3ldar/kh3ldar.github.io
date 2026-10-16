import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  makeStyles,
  tokens,
  type DataGridProps,
  type TableColumnDefinition,
  type TableColumnSizingOptions,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import type { EntityRecord } from '../../data/types'
import { compareValues } from '../../platform/format/formatValue'
import { registry } from '../../platform/metadata'
import { navigate } from '../../platform/router/history'
import { RouteLink } from '../../platform/router/RouteLink'
import type { ResolvedView } from '../../platform/query/resolveView'
import { getValue } from '../../platform/query/values'
import { FieldValue } from '../common/FieldValue'

const useStyles = makeStyles({
  scroller: { overflowX: 'auto', maxWidth: '100%' },
  grid: { minWidth: 'max-content' },
  // Links in cells get a 24px target, so compact rows still meet the minimum target size.
  primary: { fontWeight: tokens.fontWeightSemibold, display: 'inline-flex', alignItems: 'center', minHeight: '24px' },
  empty: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalM}`,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  row: { cursor: 'default' },
})

export interface EntityGridProps {
  resolved: ResolvedView
  /** Rows to show instead of the view's own (keyword-filtered, related records…). */
  rows?: EntityRecord[]
  /** Subgrids and dashboard lists: smaller rows, no selection. */
  compact?: boolean
  maxRows?: number
  ariaLabel: string
  onSelectionCountChange?: (count: number) => void
}

/** A Fluent DataGrid built from a saved view: its columns, its sort, typed cell renderers. */
export function EntityGrid({ resolved, rows, compact, maxRows, ariaLabel, onSelectionCountChange }: EntityGridProps) {
  const styles = useStyles()
  const { entity, view } = resolved
  const { messages } = registry.bundle.app
  const items = useMemo(() => {
    const source = rows ?? resolved.rows
    return maxRows ? source.slice(0, maxRows) : source
  }, [rows, resolved.rows, maxRows])

  const columns = useMemo<TableColumnDefinition<EntityRecord>[]>(
    () =>
      resolved.columns.map(({ attribute }) =>
        createTableColumn<EntityRecord>({
          columnId: attribute.logicalName,
          compare: (a, b) => compareValues(registry, attribute, getValue(a, attribute), getValue(b, attribute)),
          renderHeaderCell: () => attribute.displayName,
          renderCell: (record) =>
            attribute.logicalName === entity.primaryNameAttribute ? (
              <RouteLink className={styles.primary} route={{ pagetype: 'entityrecord', etn: record.etn, id: record.id }}>
                {registry.getPrimaryName(record)}
              </RouteLink>
            ) : (
              <FieldValue record={record} attribute={attribute} variant="grid" />
            ),
        }),
      ),
    [resolved.columns, entity.primaryNameAttribute, styles.primary],
  )

  const sizing = useMemo<TableColumnSizingOptions>(
    () =>
      Object.fromEntries(
        resolved.columns.map((c) => {
          const width = c.width ?? 150
          // Compact grids fit their container, but never squeeze a column below a readable width.
          return [c.attribute.logicalName, { idealWidth: width, minWidth: compact ? Math.min(width, 140) : 72, defaultWidth: width }]
        }),
      ),
    [resolved.columns, compact],
  )

  const firstSort = view.sort[0]
  const defaultSortState: DataGridProps['defaultSortState'] =
    firstSort && resolved.columns.some((c) => c.attribute.logicalName === firstSort.attribute)
      ? { sortColumn: firstSort.attribute, sortDirection: firstSort.direction === 'desc' ? 'descending' : 'ascending' }
      : undefined

  return (
    <div className={styles.scroller}>
      <DataGrid
        className={styles.grid}
        aria-label={ariaLabel}
        items={items}
        columns={columns}
        getRowId={(record: EntityRecord) => record.id}
        sortable
        defaultSortState={defaultSortState}
        resizableColumns
        resizableColumnsOptions={{ autoFitColumns: Boolean(compact) }}
        columnSizingOptions={sizing}
        selectionMode={compact ? undefined : 'multiselect'}
        onSelectionChange={(_, data) => onSelectionCountChange?.(data.selectedItems.size)}
        size={compact ? 'small' : 'medium'}
        // Full grids get arrow-key cell navigation; compact ones only hold links, which Tab reaches directly.
        focusMode={compact ? 'none' : 'composite'}
      >
        <DataGridHeader>
          <DataGridRow selectionCell={compact ? undefined : { checkboxIndicator: { 'aria-label': 'Select all rows' } }}>
            {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<EntityRecord>>
          {({ item, rowId }) => (
            <DataGridRow<EntityRecord>
              key={rowId}
              className={styles.row}
              selectionCell={compact ? undefined : { checkboxIndicator: { 'aria-label': 'Select row' } }}
              onDoubleClick={() => navigate({ pagetype: 'entityrecord', etn: item.etn, id: item.id })}
            >
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      {items.length === 0 && <div className={styles.empty}>{messages.noData}</div>}
    </div>
  )
}
