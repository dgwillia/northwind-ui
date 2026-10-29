import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // *.figma.js files run inside Figma (top-level await and return), not in Node or the browser.
  { ignores: ['dist', 'storybook-static', 'node_modules', 'sync/*.figma.js'] },
  ...tseslint.configs.recommended,
  // MUI-specific guardrails (no direct @mui imports in product code, no sx with raw values)
  // are added in step 6.
);
