// Sites overview: site status at a glance and the latest inspections. Built only from @northwind/ui.
import { useState } from 'react';
import { Alert, Card, ColorSchemeSwitch, DataTable, Stack, StatusLabel, Text, TextField } from '@northwind/ui';
import type { DataTableColumn, StatusLabelProps, StatusValue } from '@northwind/ui';

type Status = NonNullable<StatusLabelProps['status']>;

type Site = {
  name: string;
  status: Status;
  statusLabel: string;
  updated: string;
  detail: string;
};

type Inspection = {
  id: string;
  site: string;
  inspector: string;
  date: string; // ISO date and time
  result: StatusValue;
};

const SITES: Site[] = [
  {
    name: 'Rotterdam terminal',
    status: 'success',
    statusLabel: 'On track',
    updated: 'Updated today, 08:12',
    detail: 'All inspections passed this month.',
  },
  {
    name: 'Hamburg depot',
    status: 'error',
    statusLabel: 'Inspection overdue',
    updated: 'Updated today, 07:40',
    detail: 'Re-inspection was due on Tue 27 Oct.',
  },
  {
    name: 'Antwerp yard',
    status: 'warning',
    statusLabel: 'Permit due in 5 days',
    updated: 'Updated yesterday, 17:05',
    detail: 'Environmental permit expires on Tue 3 Nov.',
  },
];

// Newest first. Dates are relative to today so the demo always reads naturally.
const now = new Date();
const at = (daysAgo: number, h: number, m: number) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, h, m).toISOString();
const PASSED: StatusValue = { status: 'success', label: 'Passed' };
const FAILED: StatusValue = { status: 'error', label: 'Failed' };
const PENDING: StatusValue = { status: 'neutral', label: 'Pending' };

const INSPECTIONS: Inspection[] = [
  { id: 'i-106', site: 'Antwerp yard', inspector: 'Lotte Peeters', date: at(0, 9, 30), result: PENDING },
  { id: 'i-105', site: 'Rotterdam terminal', inspector: 'Sanne de Vries', date: at(1, 14, 15), result: PASSED },
  { id: 'i-104', site: 'Antwerp yard', inspector: 'Elise Maes', date: at(2, 11, 0), result: PASSED },
  { id: 'i-103', site: 'Rotterdam terminal', inspector: 'Pieter Jansen', date: at(3, 10, 20), result: PASSED },
  { id: 'i-102', site: 'Hamburg depot', inspector: 'Jonas Becker', date: at(6, 8, 45), result: FAILED },
  { id: 'i-101', site: 'Hamburg depot', inspector: 'Mira Schulz', date: at(7, 16, 5), result: PENDING },
];

const INSPECTION_COLUMNS: DataTableColumn<Inspection>[] = [
  { field: 'site', header: 'Site', grow: 2 },
  { field: 'inspector', header: 'Inspector', grow: 2 },
  { field: 'date', header: 'Date', type: 'date' },
  { field: 'result', header: 'Result', type: 'status' },
];

export function SitesOverview() {
  const [query, setQuery] = useState('');
  const needAttention = SITES.filter((site) => site.status !== 'success');
  const visibleSites = SITES.filter((site) => site.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Stack gap={3} padding={4} as="main">
      <Stack direction="row" justify="between" align="center" as="header">
        <Text variant="h5" as="h1">Sites</Text>
        <ColorSchemeSwitch />
      </Stack>

      <Alert severity="warning" title={`${needAttention.length} sites need attention`}>
        Hamburg depot has an overdue inspection, and the Antwerp yard permit is due in 5 days.
      </Alert>

      <Stack gap={2} as="section">
        <TextField
          label="Search sites"
          type="search"
          placeholder="For example, Hamburg"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {visibleSites.length > 0 ? (
          <Stack direction="row" gap={2} wrap>
            {visibleSites.map((site) => (
              <Card
                key={site.name}
                title={site.name}
                subtitle={site.updated}
                action={<StatusLabel status={site.status} label={site.statusLabel} />}
              >
                <Text>{site.detail}</Text>
              </Card>
            ))}
          </Stack>
        ) : (
          <Text color="secondary">No sites match “{query.trim()}”.</Text>
        )}
      </Stack>

      <Stack gap={2} as="section">
        <Text variant="h6" as="h2">Recent inspections</Text>
        <DataTable rows={INSPECTIONS} columns={INSPECTION_COLUMNS} label="Recent inspections" />
      </Stack>
    </Stack>
  );
}
