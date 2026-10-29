// TEMPORARY smoke test for step 1: proves MUI is installed and renders.
// It imports @mui/material directly and uses MUI's default look (no theme yet).
// Step 4 replaces this with screens built only from @northwind/ui.
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function App() {
  return (
    <>
      <CssBaseline />
      <Stack spacing={2} sx={{ p: 4, maxWidth: 480 }}>
        <Typography variant="h5" component="h1">
          Northwind UI
        </Typography>
        <Typography>
          MUI is installed. This is its default look, with no Northwind theme yet.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button>Text</Button>
        </Stack>
      </Stack>
    </>
  );
}
