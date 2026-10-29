import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'Throughput is 4% above plan for the week.', variant: 'body2', color: 'primary' },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Secondary: Story = { args: { color: 'secondary', children: 'Updated today, 08:12' } };
export const PageTitle: Story = { args: { variant: 'h5', as: 'h1', children: 'Sites' } };
export const Truncated: Story = { args: { truncate: true, children: 'A very long site name that will not fit on one line in a narrow column of a dense table' } };

/** Every text style. */
export const Scale: Story = {
  parameters: { northwind: { layout: 'column' } },
  render: () => (
    <>
      <Text variant="h4" as="p">h4 · 32px</Text>
      <Text variant="h5" as="p">h5 · 24px</Text>
      <Text variant="h6" as="p">h6 · 20px · card titles</Text>
      <Text variant="subtitle1">subtitle1 · 16px</Text>
      <Text variant="subtitle2">subtitle2 · 14px medium</Text>
      <Text variant="body1">body1 · 16px</Text>
      <Text variant="body2">body2 · 14px · default</Text>
      <Text variant="caption">caption · 12px</Text>
      <Text variant="overline">overline · 12px</Text>
    </>
  ),
};
