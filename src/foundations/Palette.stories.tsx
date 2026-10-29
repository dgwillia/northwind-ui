// Shows the theme's colour roles as MUI resolves them, for comparing with Figma's Theme check page.
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';

const ROLES = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const SHADES = ['light', 'main', 'dark'] as const;

function Swatch({ bg, fg, label }: { bg: string; fg: string; label: string }) {
  return (
    <Box sx={{ bgcolor: bg, color: fg, p: 1.5, minWidth: 96, borderRadius: 1 }}>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}

function Palette() {
  return (
    <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.default' }}>
      {ROLES.map(role => (
        <Stack key={role} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ width: 96 }}>{role}</Typography>
          {SHADES.map(shade => (
            <Swatch key={shade} bg={`${role}.${shade}`} fg={`${role}.contrastText`} label={shade} />
          ))}
        </Stack>
      ))}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ width: 96 }}>surfaces</Typography>
        <Swatch bg="background.default" fg="text.primary" label="default" />
        <Swatch bg="background.paper" fg="text.primary" label="paper" />
        <Box sx={{ border: 1, borderColor: 'divider', p: 1.5, minWidth: 96, borderRadius: 1 }}>
          <Typography variant="caption">divider</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline' }}>
        <Typography sx={{ width: 96 }}>text</Typography>
        <Typography color="text.primary">primary</Typography>
        <Typography color="text.secondary">secondary</Typography>
        <Typography color="text.disabled">disabled</Typography>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Palette',
  component: Palette,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Palette>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
