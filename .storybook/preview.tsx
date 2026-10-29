import type { Preview } from '@storybook/react-vite';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

// The Northwind theme (ThemeProvider, light and dark) is added here in step 3.
const preview: Preview = {
  parameters: { a11y: { test: 'error' } },
  tags: ['autodocs'],
};
export default preview;
