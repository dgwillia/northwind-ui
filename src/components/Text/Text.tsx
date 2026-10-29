import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

// MUI 9 Typography takes these names. It silently ignores anything else (such as 'text.secondary', the MUI 5 style),
// so keep this map in step with Typography's `color` prop.
const COLORS = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  disabled: 'textDisabled',
  error: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info',
} as const;

export interface TextProps {
  children: ReactNode;
  /**
   * Text style. Same names as Figma's `typography/*` text styles.
   * Headings: h1–h6 (h6 is the Card title). Body: body1 (16px), body2 (14px, the default for dense screens).
   * Small: caption, overline. subtitle1/2 for secondary headings.
   * @default 'body2'
   */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  /**
   * Text colour role: 'primary' | 'secondary' | 'disabled' | 'error' | 'warning' | 'success' | 'info'.
   * Use `secondary` for supporting text, status colours only to report a status. @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'disabled' | 'error' | 'warning' | 'success' | 'info';
  /**
   * HTML element. Headings render as the matching h tag by default; set this when the visual size and the
   * document structure differ, e.g. `variant="h5" as="h1"` for a page title.
   */
  as?: 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** @default 'inherit' */
  align?: 'inherit' | 'left' | 'center' | 'right';
  /** Cut long text to one line with an ellipsis. */
  truncate?: boolean;
}

/** All text in product code. Wraps MUI Typography with the theme's text styles and colour roles. */
export function Text({ children, variant = 'body2', color = 'primary', as, align = 'inherit', truncate = false }: TextProps) {
  return (
    <Typography variant={variant} color={COLORS[color]} align={align} noWrap={truncate} {...(as ? { component: as } : {})}>
      {children}
    </Typography>
  );
}
