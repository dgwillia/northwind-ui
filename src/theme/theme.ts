// The Northwind MUI theme.
// Every value comes from Figma through the token pipeline (src/theme/generated/*). Only the wiring lives here.
// Derived colours (hover tints, alert colours, dark surfaces) are calculated by MUI from these source roles.
import { createTheme } from '@mui/material/styles';
import { shape, spacingUnit, typography } from './generated/base';
import { darkPalette } from './generated/palette.dark';
import { lightPalette } from './generated/palette.light';

export const theme = createTheme({
  // Write the theme as CSS variables (--mui-palette-primary-main and so on),
  // and switch light/dark with a data attribute on <html>: data-light / data-dark.
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
  },
  shape,
  spacing: spacingUnit,
  typography,
});
