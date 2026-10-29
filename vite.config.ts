import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets stories and the demo import from '@northwind/ui', exactly as product code would.
    alias: { '@northwind/ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
  },
});
