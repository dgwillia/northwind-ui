import MuiStack from '@mui/material/Stack';
import type { ReactNode } from 'react';

/**
 * Spacing steps. 1 = 8px. The same steps as Figma's `spacing` variables (named "0,5", "1", "1,5", "2"…),
 * so a gap of 2 means 16px in both places.
 */
export type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' } as const;
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const;

export interface StackProps {
  children?: ReactNode;
  /** @default 'column' */
  direction?: 'row' | 'column';
  /** Space between children, in spacing steps (1 = 8px). @default 0 */
  gap?: SpacingStep;
  /** Space around the edges, in spacing steps (1 = 8px). @default 0 */
  padding?: SpacingStep;
  /** Cross-axis alignment: vertical in a row, horizontal in a column. @default 'stretch' */
  align?: keyof typeof ALIGN;
  /** Main-axis distribution. `between` pushes the first and last children to the ends. @default 'start' */
  justify?: keyof typeof JUSTIFY;
  /** Let children flow onto new lines when there isn't room. */
  wrap?: boolean;
  /** HTML element to render. Use `section`, `ul` or `nav` when it describes the content better. @default 'div' */
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main' | 'ul' | 'ol' | 'form';
}

/** Lays children out in a row or column with consistent spacing. The code twin of Figma auto layout. */
export function Stack({ children, direction = 'column', gap = 0, padding = 0, align = 'stretch', justify = 'start', wrap = false, as = 'div' }: StackProps) {
  return (
    <MuiStack
      component={as}
      direction={direction}
      spacing={0}
      sx={{ gap, p: padding, alignItems: ALIGN[align], justifyContent: JUSTIFY[justify], flexWrap: wrap ? 'wrap' : 'nowrap', m: 0, listStyle: 'none' }}
    >
      {children}
    </MuiStack>
  );
}
