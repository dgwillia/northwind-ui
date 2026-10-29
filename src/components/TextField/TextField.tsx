import MuiTextField from '@mui/material/TextField';
import type { ChangeEventHandler } from 'react';

export interface TextFieldProps {
  /** Visible label. Always give one; placeholders are not labels. */
  label: string;
  /** Controlled value. Use with `onChange`. */
  value?: string;
  /** Starting value when the field manages its own state. */
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Hint under the field. When `error` is true, say what is wrong and how to fix it. */
  helperText?: string;
  /** Shows the field in the error state. Pair it with `helperText`. */
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** @default 'text' */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  /** Example input, shown when empty. Not a replacement for `label`. */
  placeholder?: string;
  /** Form field name. */
  name?: string;
  /** Browser autofill hint, such as "email" or "current-password". */
  autoComplete?: string;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
}

/** Single-line text input with a label. Wraps MUI TextField (outlined only). */
export function TextField({ type = 'text', ...rest }: TextFieldProps) {
  return <MuiTextField type={type} {...rest} />;
}
