import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import type { ReactNode } from 'react';

export interface AlertProps {
  /**
   * How serious the message is.
   * - `info`: useful to know.
   * - `success`: something worked.
   * - `warning`: may need action.
   * - `error`: something failed and needs action.
   * @default 'info'
   */
  severity?: 'info' | 'success' | 'warning' | 'error';
  /** Optional bold first line. */
  title?: string;
  /** The message. Say what happened and what to do next. */
  children: ReactNode;
  /** Shows a close button. Leave out for messages that must stay visible. */
  onClose?: () => void;
}

/** A message about the page or a task. Wraps MUI Alert (standard style only). */
export function Alert({ severity = 'info', title, children, onClose }: AlertProps) {
  return (
    <MuiAlert severity={severity} onClose={onClose}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}
