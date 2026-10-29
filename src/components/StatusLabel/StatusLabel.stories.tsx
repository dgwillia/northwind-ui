import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusLabel } from './StatusLabel';

const meta = {
  title: 'Components/StatusLabel',
  component: StatusLabel,
  args: { label: 'Pending review', status: 'neutral' },
} satisfies Meta<typeof StatusLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Info: Story = { args: { status: 'info', label: 'In progress' } };
export const Success: Story = { args: { status: 'success', label: 'Approved' } };
export const Warning: Story = { args: { status: 'warning', label: 'Due in 2 days' } };
export const Error: Story = { args: { status: 'error', label: 'Overdue' } };

/** Every status. */
export const Overview: Story = {
  parameters: { northwind: { layout: 'row' } },
  render: () => (
    <>
      <StatusLabel label="Draft" />
      <StatusLabel status="info" label="In progress" />
      <StatusLabel status="success" label="Approved" />
      <StatusLabel status="warning" label="Due in 2 days" />
      <StatusLabel status="error" label="Overdue" />
    </>
  ),
};
