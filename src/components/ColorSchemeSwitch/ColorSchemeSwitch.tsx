import { useColorScheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export interface ColorSchemeSwitchProps {
  /** Accessible name for the group. @default 'Colour scheme' */
  label?: string;
}

/** Lets the user pick light, dark, or follow the system. Must be inside NorthwindProvider. */
export function ColorSchemeSwitch({ label = 'Colour scheme' }: ColorSchemeSwitchProps) {
  const { mode, setMode } = useColorScheme();
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode ?? 'system'}
      onChange={(_, value) => value && setMode(value)}
      aria-label={label}
    >
      <ToggleButton value="light">Light</ToggleButton>
      <ToggleButton value="system">System</ToggleButton>
      <ToggleButton value="dark">Dark</ToggleButton>
    </ToggleButtonGroup>
  );
}
