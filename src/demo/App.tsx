// TEMPORARY smoke test: proves the theme reaches MUI's components.
// The buttons below are unchanged since step 1. Only the theme around them changed.
// It imports @mui/material directly, which product code must not do. Step 4 replaces this.
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '../index';

export function App() {
  const { mode, setMode } = useColorScheme();
  return (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 640 }}>
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
      <Typography color="text.secondary">
        MUI components with the Northwind theme from Figma. No component code has changed since step 1.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button>Text</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" color="error">Error</Button>
      </Stack>
      <Stack spacing={1}>
        <Alert severity="error">Error alert</Alert>
        <Alert severity="warning">Warning alert</Alert>
        <Alert severity="info">Info alert</Alert>
        <Alert severity="success">Success alert</Alert>
        <Alert severity="info" variant="filled">Filled info alert</Alert>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField label="Label" defaultValue="Value" />
        <TextField label="Label" defaultValue="Value" error />
      </Stack>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography>Paper at elevation 1. In dark mode MUI lightens it slightly.</Typography>
      </Paper>
    </Stack>
  );
}
