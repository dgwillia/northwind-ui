import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { theme } from './theme';

export interface NorthwindProviderProps {
  children: ReactNode;
  /** Starting colour scheme. "system" follows the user's operating system. Default: "system". */
  defaultMode?: 'light' | 'dark' | 'system';
}

/** Wrap an app (once, at the top) to apply the Northwind theme, light/dark switching and base styles. */
export function NorthwindProvider({ children, defaultMode = 'system' }: NorthwindProviderProps) {
  return (
    <ThemeProvider theme={theme} defaultMode={defaultMode}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
