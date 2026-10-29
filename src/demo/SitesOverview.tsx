// Sites overview: site status at a glance and the latest inspections. Built only from @northwind/ui.
import { useState } from 'react';
import { Alert, Card, ColorSchemeSwitch, Stack, StatusLabel, Text, TextField } from '@northwind/ui';
import type { StatusLabelProps } from '@northwind/ui';

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
  date: string;
  result: 'passed' | 'failed' | 'pending';
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

// Newest first.
const INSPECTIONS: Inspection[] = [
  { id: 'i-106', site: 'Antwerp yard', inspector: 'Lotte Peeters', date: 'Today, 09:30', result: 'pending' },
  { id: 'i-105', site: 'Rotterdam terminal', inspector: 'Sanne de Vries', date: 'Yesterday, 14:15', result: 'passed' },
  { id: 'i-104', site: 'Antwerp yard', inspector: 'Elise Maes', date: 'Tue 27 Oct', result: 'passed' },
  { id: 'i-103', site: 'Rotterdam terminal', inspector: 'Pieter Jansen', date: 'Mon 26 Oct', result: 'passed' },
  { id: 'i-102', site: 'Hamburg depot', inspector: 'Jonas Becker', date: 'Fri 23 Oct', result: 'failed' },
  { id: 'i-101', site: 'Hamburg depot', inspector: 'Mira Schulz', date: 'Thu 22 Oct', result: 'pending' },
];

const RESULTS: Record<Inspection['result'], { status: Status; label: string }> = {
  passed: { status: 'success', label: 'Passed' },
  failed: { status: 'error', label: 'Failed' },
  pending: { status: 'neutral', label: 'Pending' },
};

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
        <Card>
          <Stack gap={2}>
            {INSPECTIONS.map((inspection) => (
              <Stack key={inspection.id} direction="row" justify="between" align="center" gap={2}>
                <Stack gap={0.5}>
                  <Text variant="subtitle2" as="p">{inspection.site}</Text>
                  <Text color="secondary">{inspection.inspector} · {inspection.date}</Text>
                </Stack>
                <StatusLabel status={RESULTS[inspection.result].status} label={RESULTS[inspection.result].label} />
              </Stack>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
