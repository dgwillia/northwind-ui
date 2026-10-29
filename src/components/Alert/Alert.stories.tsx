import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: { severity: 'info', children: 'Readings for Site 4 are delayed by about 20 minutes.' },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { severity: 'success', children: 'Report exported.' } };
export const Warning: Story = { args: { severity: 'warning', title: 'Permit expires soon', children: 'Renew before 14 November to avoid a stop.' } };
export const Error: Story = { args: { severity: 'error', title: 'Upload failed', children: 'The file is over 20 MB. Split it and try again.' } };
export const Dismissible: Story = { args: { onClose: fn() } };

/** Every severity. */
export const Overview: Story = {
  parameters: { northwind: { layout: 'column' } },
  render: () => (
    <>
      <Alert severity="info">Readings are delayed by about 20 minutes.</Alert>
      <Alert severity="success">Report exported.</Alert>
      <Alert severity="warning" title="Permit expires soon">Renew before 14 November.</Alert>
      <Alert severity="error" title="Upload failed">The file is over 20 MB.</Alert>
    </>
  ),
};
