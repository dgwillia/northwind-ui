import MuiCard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import type { ReactNode } from 'react';

export interface CardProps {
  /** Heading for the card. */
  title?: string;
  /** One line under the title, such as a date or a count. */
  subtitle?: string;
  /** Something small at the top right, such as a StatusLabel or a ghost Button. */
  action?: ReactNode;
  /** The card's content. */
  children?: ReactNode;
  /** Buttons along the bottom. Put the primary action last. */
  footer?: ReactNode;
}

/** Groups related content on a surface. Flat with a border. Wraps MUI Card. */
export function Card({ title, subtitle, action, children, footer }: CardProps) {
  return (
    <MuiCard>
      {title && <CardHeader title={title} subheader={subtitle} action={action} />}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardActions>{footer}</CardActions>}
    </MuiCard>
  );
}
