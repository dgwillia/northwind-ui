import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { StatusLabel, type StatusLabelProps } from '../StatusLabel/StatusLabel';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

/** The value a `status` column expects in each row. */
export interface StatusValue {
  status: NonNullable<StatusLabelProps['status']>;
  label: string;
}

export interface DataTableColumn<Row> {
  /** The row property this column shows. */
  field: keyof Row & string;
  /** Column heading. Sentence case, short. */
  header: string;
  /**
   * How the value is shown and sorted.
   * - `text` (default): left-aligned.
   * - `number`: right-aligned, with thousands separators (12,400).
   * - `date`: a `Date` or ISO string, shown as DESIGN.md says ("Today, 08:12", "Mon 26 Oct"), sorted by time.
   * - `status`: a `{ status, label }` value, shown as a StatusLabel, sorted by label.
   */
  type?: 'text' | 'number' | 'date' | 'status';
  /** Share of the spare width this column takes, relative to the others. @default 1 */
  grow?: 1 | 2 | 3;
}

export interface DataTableProps<Row extends { id: string | number }> {
  /**
   * One object per row. Each needs a unique `id`, e.g.
   * `{ id: 'i-106', site: 'Antwerp yard', date: '2026-10-29T09:30', result: { status: 'neutral', label: 'Pending' } }`.
   */
  rows: readonly Row[];
  /**
   * One object per column, in display order:
   * `{ field: string; header: string; type?: 'text' | 'number' | 'date' | 'status'; grow?: 1 | 2 | 3 }`.
   * `field` names a row property. `date` values are a Date or ISO string; `status` values are `{ status, label }`
   * (the StatusLabel props). `grow` is the column's share of spare width. E.g.
   * `[{ field: 'site', header: 'Site', grow: 2 }, { field: 'date', header: 'Date', type: 'date' }, { field: 'result', header: 'Result', type: 'status' }]`.
   */
  columns: readonly DataTableColumn<Row>[];
  /** Accessible name for the table, such as "Recent inspections". Not shown. */
  label: string;
  /** Shows a loading bar while rows are being fetched. */
  loading?: boolean;
  /** Shown when there are no rows. Say what's missing and, if you can, why. @default 'Nothing to show yet.' */
  emptyMessage?: string;
  /** Row height. `compact` fits more rows on dense screens. @default 'standard' */
  density?: 'standard' | 'compact';
  /** Rows per page. The page controls only appear when there are more rows than this. @default 10 */
  pageSize?: 10 | 25 | 50 | 100;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad = (n: number) => String(n).padStart(2, '0');

/** DESIGN.md date format: "Today, 08:12", "Yesterday, 17:40", "Mon 26 Oct", "26 Oct 2025". */
export function formatDate(value: Date | string, now = new Date()): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 864e5);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  if (d.getFullYear() !== now.getFullYear()) return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function toGridColumn<Row extends { id: string | number }>(c: DataTableColumn<Row>): GridColDef {
  const base: GridColDef = { field: c.field, headerName: c.header, flex: c.grow ?? 1, minWidth: 120 };
  switch (c.type) {
    case 'number':
      return { ...base, type: 'number', valueFormatter: (v: number | null) => (v == null ? '' : v.toLocaleString('en-GB')) };
    case 'date':
      return {
        ...base,
        minWidth: 160, // fits "Yesterday, 17:40"
        type: 'dateTime',
        valueGetter: (v: Date | string | null) => (v == null ? null : new Date(v)),
        valueFormatter: (v: Date | null) => (v == null ? '' : formatDate(v)),
      };
    case 'status':
      return {
        ...base,
        display: 'flex',
        sortComparator: (a: StatusValue, b: StatusValue) => a.label.localeCompare(b.label),
        renderCell: ({ value }) => (value ? <StatusLabel status={(value as StatusValue).status} label={(value as StatusValue).label} /> : null),
      };
    default:
      return base;
  }
}

function Empty({ message }: { message: string }) {
  return (
    <Stack align="center" justify="center" padding={4}>
      <Text color="secondary">{message}</Text>
    </Stack>
  );
}

/**
 * Rows of records with sortable columns. Wraps the free MUI X Data Grid (Community).
 * Use it for lists people compare or scan: inspections, sites, permits. For two or three items, use Cards.
 */
export function DataTable<Row extends { id: string | number }>({
  rows,
  columns,
  label,
  loading = false,
  emptyMessage = 'Nothing to show yet.',
  density = 'standard',
  pageSize = 10,
}: DataTableProps<Row>) {
  return (
    <DataGrid
      rows={rows as Row[]}
      columns={columns.map(toGridColumn)}
      aria-label={label}
      loading={loading}
      density={density}
      autoHeight
      disableColumnMenu
      disableRowSelectionOnClick
      hideFooter={rows.length <= pageSize}
      initialState={{ pagination: { paginationModel: { pageSize, page: 0 } } }}
      pageSizeOptions={[pageSize]}
      slots={{ noRowsOverlay: () => <Empty message={emptyMessage} /> }}
    />
  );
}
