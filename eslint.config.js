import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist', 'storybook-static', 'node_modules'] },
  ...tseslint.configs.recommended,
  // MUI-specific guardrails (no direct @mui imports in product code, no sx with raw values)
  // are added in step 6.
);
