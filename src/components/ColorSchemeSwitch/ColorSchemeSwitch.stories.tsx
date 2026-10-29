import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSchemeSwitch } from './ColorSchemeSwitch';

const meta = {
  title: 'Components/ColorSchemeSwitch',
  component: ColorSchemeSwitch,
} satisfies Meta<typeof ColorSchemeSwitch>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
