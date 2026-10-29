import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable, type DataTableColumn, type StatusValue } from '@northwind/ui';

type Inspection = { id: string; site: string; inspector: string; date: string; findings: number; result: StatusValue };

const ROWS: Inspection[] = [
  { id: 'i-106', site: 'Antwerp yard', inspector: 'Lotte Peeters', date: '2026-10-29T09:30', findings: 0, result: { status: 'neutral', label: 'Pending' } },
  { id: 'i-105', site: 'Rotterdam terminal', inspector: 'Sanne de Vries', date: '2026-10-28T14:15', findings: 2, result: { status: 'success', label: 'Passed' } },
  { id: 'i-104', site: 'Antwerp yard', inspector: 'Elise Maes', date: '2026-10-27T11:00', findings: 1, result: { status: 'success', label: 'Passed' } },
  { id: 'i-103', site: 'Rotterdam terminal', inspector: 'Pieter Jansen', date: '2026-10-26T10:20', findings: 0, result: { status: 'success', label: 'Passed' } },
  { id: 'i-102', site: 'Hamburg depot', inspector: 'Jonas Becker', date: '2026-10-23T08:45', findings: 1240, result: { status: 'error', label: 'Failed' } },
];

const COLUMNS: DataTableColumn<Inspection>[] = [
  { field: 'site', header: 'Site', grow: 2 },
  { field: 'inspector', header: 'Inspector', grow: 2 },
  { field: 'date', header: 'Date', type: 'date' },
  { field: 'findings', header: 'Findings', type: 'number' },
  { field: 'result', header: 'Result', type: 'status' },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  args: { rows: ROWS, columns: COLUMNS, label: 'Recent inspections' },
} satisfies Meta<typeof DataTable<Inspection>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { density: 'compact' } };
export const Loading: Story = { args: { rows: [], loading: true } };
export const Empty: Story = { args: { rows: [], emptyMessage: 'No inspections in the last 30 days.' } };
