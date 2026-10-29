import type { Decorator, Preview } from '@storybook/react-vite';
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

const preview: Preview = {
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: { title: 'Scheme', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { scheme: 'light' },
  decorators: [withTheme],
  parameters: { a11y: { test: 'error' } },
  tags: ['autodocs'],
};
export default preview;
