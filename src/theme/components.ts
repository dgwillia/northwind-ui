// Component-level styling for MUI, applied through the theme.
// It lives here, not inside our wrappers, so it also reaches MUI components used internally
// by other MUI parts (the Data Grid's toolbar buttons, date picker fields, and so on).
//
// Rules for this file:
// - Use theme values only (theme.palette, theme.typography, theme.spacing). No raw colours or pixel values.
// - Keep it short. Anything that is a design decision with a value belongs in Figma tokens first.
import type { ThemeOptions } from '@mui/material/styles';
// Adds the Data Grid to the theme's component types, so MuiDataGrid overrides are type-checked.
import type {} from '@mui/x-data-grid/themeAugmentation';

export const components: ThemeOptions['components'] = {
  MuiButton: {
    // Flat buttons: MUI's default adds a shadow to contained buttons.
    defaultProps: { disableElevation: true },
    // Sentence case: "Save changes", not "SAVE CHANGES".
    styleOverrides: { root: { textTransform: 'none' } },
  },
  MuiToggleButton: {
    styleOverrides: { root: { textTransform: 'none' } },
  },
  // Flat cards with a border suit dense, data-heavy screens.
  MuiCard: {
    defaultProps: { variant: 'outlined' },
  },
  // Smaller card headings than MUI's default (h5 / body1) for dense screens. Matches Figma's Card.
  // Figma's header keeps 16px (spacing 2) between the title and the action, and sits the action flush with the
  // padding. MUI has no gap and pulls the action out with negative margins (sized for icon buttons), so a long
  // title runs into a StatusLabel.
  MuiCardHeader: {
    defaultProps: { slotProps: { title: { variant: 'h6' }, subheader: { variant: 'body2' } } },
    styleOverrides: {
      root: ({ theme }) => ({ gap: theme.spacing(2) }),
      action: { margin: 0 },
    },
  },
  // Footer buttons sit on the right, primary action last.
  MuiCardActions: {
    styleOverrides: { root: { justifyContent: 'flex-end' } },
  },
  // Data Grid (DataTable). It derives its own border colour by lightening the divider, which almost disappears
  // with our light stone divider. Use the divider itself, as Figma's DataTable does.
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        '--DataGrid-rowBorderColor': (theme.vars ?? theme).palette.divider,
        borderColor: (theme.vars ?? theme).palette.divider,
      }),
    },
  },
  MuiAlert: {
    defaultProps: { variant: 'standard' },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined' },
  },
};
