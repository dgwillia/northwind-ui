// Demo screen built from @northwind/ui components.
// Layout (Stack, Typography) and the scheme switch still come from @mui/material directly:
// the package has no layout or text components yet. That gap is decided in step 6.
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Alert, Button, Card, StatusLabel, TextField, useColorScheme } from '@northwind/ui';

export function App() {
  const { mode, setMode } = useColorScheme();
  return (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 720 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Northwind UI
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode ?? 'system'}
          onChange={(_, value) => value && setMode(value)}
          aria-label="Colour scheme"
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="system">System</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Alert severity="warning" title="Permit expires soon">
        Renew the Rotterdam terminal permit before 14 November.
      </Alert>

      <Stack direction="row" spacing={2}>
        <Card
          title="Rotterdam terminal"
          subtitle="Updated today, 08:12"
          action={<StatusLabel status="success" label="On track" />}
          footer={<Button variant="ghost">View details</Button>}
        >
          <Typography variant="body2">Throughput is 4% above plan for the week.</Typography>
        </Card>
        <Card
          title="Hamburg depot"
          subtitle="Updated today, 07:40"
          action={<StatusLabel status="error" label="Overdue" />}
          footer={<Button variant="ghost">View details</Button>}
        >
          <Typography variant="body2">Weekly inspection report not received.</Typography>
        </Card>
      </Stack>

      <Card title="Request access" subtitle="We'll reply within one working day.">
        <Stack spacing={2}>
          <TextField label="Full name" defaultValue="Dan Williams" fullWidth />
          <TextField label="Work email" type="email" defaultValue="dan@" error helperText="Enter a full email address, like name@example.com." fullWidth />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="secondary">Cancel</Button>
            <Button>Send request</Button>
          </Stack>
        </Stack>
      </Card>

      <Stack direction="row" spacing={1}>
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
