import MuiButton from '@mui/material/Button';
import type { MouseEventHandler, ReactNode } from 'react';

const VARIANTS = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'primary' },
  ghost: { variant: 'text', color: 'primary' },
  danger: { variant: 'contained', color: 'error' },
} as const;

export interface ButtonProps {
  /** The label. Use sentence case and a verb: "Save changes", "Export CSV". */
  children: ReactNode;
  /**
   * What the button is for.
   * - `primary`: the main action. Use at most one per area.
   * - `secondary`: other actions next to a primary one.
   * - `ghost`: low-emphasis actions, often in toolbars or lists.
   * - `danger`: destructive actions such as Delete. Ask for confirmation first.
   * @default 'primary'
   */
  variant?: keyof typeof VARIANTS;
  /** @default 'medium' */
  size?: 'small' | 'medium';
  /** Icon before the label. */
  startIcon?: ReactNode;
  /** Icon after the label. */
  endIcon?: ReactNode;
  /** Shows a spinner and disables the button while an action runs. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** @default 'button' */
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Needed when the button has an icon and no visible text. */
  'aria-label'?: string;
}

/** Triggers an action. Wraps MUI Button with Northwind's four variants. */
export function Button({ variant = 'primary', size = 'medium', type = 'button', ...rest }: ButtonProps) {
  return <MuiButton {...VARIANTS[variant]} size={size} type={type} {...rest} />;
}
