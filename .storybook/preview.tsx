import type { Decorator, Preview } from '@storybook/react-vite';
import Stack from '@mui/material/Stack';
import { useEffect, type ReactNode } from 'react';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import { NorthwindProvider, useColorScheme } from '../src/index';

// Keeps MUI's colour scheme in step with the Storybook toolbar.
function SchemeSync({ scheme, children }: { scheme: 'light' | 'dark'; children: ReactNode }) {
  const { setMode } = useColorScheme();
  useEffect(() => setMode(scheme), [scheme, setMode]);
  return <>{children}</>;
}

const withTheme: Decorator = (Story, ctx) => (
  <NorthwindProvider defaultMode={ctx.globals.scheme}>
    <SchemeSync scheme={ctx.globals.scheme}>
      <Story />
    </SchemeSync>
  </NorthwindProvider>
);

// Layout for stories that show several components, set per story with
//   parameters: { northwind: { layout: 'row' | 'column', maxWidth: 420 } }
// It lives here so story files import only from @northwind/ui. Storybook copies a story file's imports
// into the code examples agents read through the MCP, so an MUI import there teaches agents to use MUI.
const withLayout: Decorator = (Story, ctx) => {
  const { layout, maxWidth } = (ctx.parameters.northwind ?? {}) as { layout?: 'row' | 'column'; maxWidth?: number };
  if (!layout && !maxWidth) return <Story />;
  return (
    <Stack direction={layout === 'row' ? 'row' : 'column'} spacing={layout === 'row' ? 1 : 2} sx={{ maxWidth, flexWrap: 'wrap' }}>
      <Story />
    </Stack>
  );
};

const preview: Preview = {
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: { title: 'Scheme', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { scheme: 'light' },
  decorators: [withLayout, withTheme],
  parameters: { a11y: { test: 'error' } },
  tags: ['autodocs'],
};
export default preview;
