// Demo screen built only from @northwind/ui. No MUI imports: ESLint blocks them here.
import { Alert, Button, Card, ColorSchemeSwitch, Stack, StatusLabel, Text, TextField } from '@northwind/ui';

export function App() {
  return (
    <Stack gap={3} padding={4} as="main">
      <Stack direction="row" justify="between" align="center">
        <Text variant="h5" as="h1">Northwind UI</Text>
        <ColorSchemeSwitch />
      </Stack>

      <Alert severity="warning" title="Permit expires soon">
        Renew the Rotterdam terminal permit before 14 November.
      </Alert>

      <Stack direction="row" gap={2} wrap>
        <Card
          title="Rotterdam terminal"
          subtitle="Updated today, 08:12"
          action={<StatusLabel status="success" label="On track" />}
          footer={<Button variant="ghost">View details</Button>}
        >
          <Text>Throughput is 4% above plan for the week.</Text>
        </Card>
        <Card
          title="Hamburg depot"
          subtitle="Updated today, 07:40"
          action={<StatusLabel status="error" label="Overdue" />}
          footer={<Button variant="ghost">View details</Button>}
        >
          <Text>Weekly inspection report not received.</Text>
        </Card>
      </Stack>

      <Card title="Request access" subtitle="We'll reply within one working day.">
        <Stack gap={2} as="form">
          <TextField label="Full name" defaultValue="Dan Williams" fullWidth />
          <TextField label="Work email" type="email" defaultValue="dan@" error helperText="Enter a full email address, like name@example.com." fullWidth />
          <Stack direction="row" gap={1} justify="end">
            <Button variant="secondary">Cancel</Button>
            <Button type="submit">Send request</Button>
          </Stack>
        </Stack>
      </Card>

      <Stack direction="row" gap={1} align="center" wrap>
        <StatusLabel label="Draft" />
        <StatusLabel status="info" label="In progress" />
        <StatusLabel status="success" label="Approved" />
        <StatusLabel status="warning" label="Due in 2 days" />
        <StatusLabel status="error" label="Overdue" />
        <Button variant="danger" size="small">Delete site</Button>
      </Stack>
    </Stack>
  );
}
