// Northwind UI guardrails. They apply to people and AI agents alike; CI runs them on every PR.
// Each message says what to do instead, because agents read lint output and act on it.
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const RAW_STYLE_RULES = [
  { selector: "JSXAttribute[name.name='style']", message: 'No inline styles. Use Stack for layout and Text for text, or a component prop. See DESIGN.md.' },
  { selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]', message: 'No raw hex colours. Colours come from Figma tokens through the theme. See DESIGN.md.' },
  { selector: 'Literal[value=/^(rgb|rgba|hsl|hsla)\\(/]', message: 'No raw colour values. Colours come from Figma tokens through the theme. See DESIGN.md.' },
];

export default defineConfig(
  // *.figma.js files run inside Figma (top-level await and return), not in Node or the browser.
  { ignores: ['dist', 'storybook-static', 'node_modules', 'sync/*.figma.js'] },
  ...tseslint.configs.recommended,

  // Everywhere in src: no inline styles, no raw colours. Generated theme files hold the real values and are exempt.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/theme/generated/**'],
    rules: { 'no-restricted-syntax': ['error', ...RAW_STYLE_RULES] },
  },

  // Product code and stories: build only from @northwind/ui.
  // Stories count as product code because Storybook copies their imports into the examples agents read.
  {
    files: ['src/demo/**/*.{ts,tsx}', 'src/**/*.stories.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@mui/*', '@mui/**', '@emotion/*'], message: 'Import UI from @northwind/ui, not MUI. Missing something? Say so in your PR; don\'t reach for MUI. See AGENTS.md.' },
          { group: ['**/components/*', '**/components/**', '**/theme/*'], message: 'Import from @northwind/ui, the package entry, not from internal files.' },
        ],
      }],
      'no-restricted-syntax': ['error', ...RAW_STYLE_RULES,
        { selector: "JSXAttribute[name.name='sx']", message: 'No sx. Use component props; layout with Stack, text with Text. See DESIGN.md.' },
        { selector: "JSXAttribute[name.name='className']", message: 'No className. Use component props; layout with Stack, text with Text. See DESIGN.md.' },
      ],
    },
  },

  // A component's own story may import it from its own folder ('./Button'); Storybook rewrites that to @northwind/ui.
  {
    files: ['src/components/**/*.stories.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['@mui/*', '@mui/**', '@emotion/*'], message: 'Stories import only from @northwind/ui and Storybook. See AGENTS.md.' }],
      }],
    },
  },
);
