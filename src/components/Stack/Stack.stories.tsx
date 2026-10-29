import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack, StatusLabel, Text } from '@northwind/ui';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  args: { direction: 'column', gap: 2 },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A column of text, 16px apart (gap 2). */
export const Column: Story = {
  render: () => (
    <Stack gap={2}>
      <Text variant="h6" as="h2">Rotterdam terminal</Text>
      <Text color="secondary">Updated today, 08:12</Text>
      <Text>Throughput is 4% above plan for the week.</Text>
    </Stack>
  ),
};

/** Buttons in a row, 8px apart (gap 1), pushed to the end. Typical form footer. */
export const ButtonRow: Story = {
  render: () => (
    <Stack direction="row" gap={1} justify="end">
      <Button variant="secondary">Cancel</Button>
      <Button>Save changes</Button>
    </Stack>
  ),
};

/** A heading on the left and a status on the right. */
export const SpaceBetween: Story = {
  render: () => (
    <Stack direction="row" justify="between" align="center">
      <Text variant="h6" as="h2">Hamburg depot</Text>
      <StatusLabel status="error" label="Overdue" />
    </Stack>
  ),
};
