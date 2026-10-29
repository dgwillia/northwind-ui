// Shows the theme's colour roles as MUI resolves them, for comparing with Figma's Theme check page.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Text } from '@northwind/ui';
import { Swatch } from './Swatch';

const ROLES = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const SHADES = ['light', 'main', 'dark'] as const;

function Palette() {
  return (
    <Stack gap={2} padding={2}>
      {ROLES.map(role => (
        <Stack key={role} direction="row" gap={1} align="center">
          <Text variant="body1">{role}</Text>
          {SHADES.map(shade => (
            <Swatch key={shade} background={`${role}.${shade}`} foreground={`${role}.contrastText`} label={shade} />
          ))}
        </Stack>
      ))}
      <Stack direction="row" gap={1} align="center">
        <Text variant="body1">surfaces</Text>
        <Swatch background="background.default" foreground="text.primary" label="default" />
        <Swatch background="background.paper" foreground="text.primary" label="paper" />
        <Swatch background="divider" foreground="text.primary" label="divider" outline />
      </Stack>
      <Stack direction="row" gap={2} align="baseline">
        <Text variant="body1">text</Text>
        <Text variant="body1">primary</Text>
        <Text variant="body1" color="secondary">secondary</Text>
        <Text variant="body1" color="disabled">disabled</Text>
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
