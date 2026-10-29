import Chip from '@mui/material/Chip';

const COLORS = {
  neutral: 'default',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

export interface StatusLabelProps {
  /** Short, self-describing text: "Approved", "Overdue", "Pending review". Not just "OK". */
  label: string;
  /**
   * The state the label reports.
   * - `neutral`: waiting, draft, not started.
   * - `info`: in progress or for information.
   * - `success`: done, approved, healthy.
   * - `warning`: needs attention soon.
   * - `error`: failed, blocked, overdue.
   * @default 'neutral'
   */
  status?: keyof typeof COLORS;
}

/**
 * Shows the status of a record, for example in a table row. Not clickable.
 * Built on MUI Chip. (MUI's Badge is a notification counter, not a status label.)
 */
export function StatusLabel({ label, status = 'neutral' }: StatusLabelProps) {
  return <Chip label={label} color={COLORS[status]} size="small" variant="outlined" />;
}
