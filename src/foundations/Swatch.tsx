// Internal helper for the Foundations stories. Not exported from the package.
import Box from '@mui/material/Box';
import { Text } from '../components/Text/Text';

export interface SwatchProps {
  /** Palette path, e.g. "primary.main" or "background.paper". */
  background: string;
  /** Palette path for the label colour. */
  foreground: string;
  label: string;
  /** Draw a divider-coloured border instead of a fill. */
  outline?: boolean;
}

export function Swatch({ background, foreground, label, outline = false }: SwatchProps) {
  return (
    <Box sx={{ bgcolor: outline ? 'transparent' : background, color: foreground, border: outline ? 1 : 0, borderColor: 'divider', p: 1.5, minWidth: 96, borderRadius: 1 }}>
      <Text variant="caption" color="primary">{label}</Text>
    </Box>
  );
}
