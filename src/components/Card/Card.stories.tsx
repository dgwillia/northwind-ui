import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, StatusLabel } from '@northwind/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: 'Rotterdam terminal',
    subtitle: 'Updated today, 08:12',
    children: 'Throughput is 4% above plan for the week.',
  },
  parameters: { northwind: { maxWidth: 420 } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = { args: { action: <StatusLabel status="success" label="On track" /> } };
export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="ghost">Dismiss</Button>
        <Button>Open report</Button>
      </>
    ),
  },
};
export const ContentOnly: Story = { args: { title: undefined, subtitle: undefined } };
