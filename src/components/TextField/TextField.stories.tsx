import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Site name', defaultValue: 'Rotterdam terminal' },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { defaultValue: undefined, placeholder: 'For example, Rotterdam terminal' } };
export const WithHelperText: Story = { args: { helperText: 'As shown on the permit.' } };
export const Error: Story = {
  args: { label: 'Email', type: 'email', defaultValue: 'dan@', error: true, helperText: 'Enter a full email address, like name@example.com.' },
};
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { disabled: true } };

/** The main states side by side. */
export const Overview: Story = {
  parameters: { northwind: { layout: 'row' } },
  render: () => (
    <>
      <TextField label="Label" defaultValue="Value" />
      <TextField label="Label" defaultValue="Value" error helperText="Say what's wrong." />
      <TextField label="Label" defaultValue="Value" disabled />
    </>
  ),
};
