# Rules for AI agents working in Northwind UI

Short for now. Filled in at step 6.

1. Run `npm run check` before you open a pull request. It must pass.
2. Do not merge pull requests. A person merges them.
3. Never edit `tokens/` or `src/theme/generated/` by hand. They come from Figma. See CLAUDE.md.
4. Build UI from `@northwind/ui`: Alert, Button, Card, StatusLabel, TextField. Read their stories and props through the Storybook MCP first.
5. Story files import only from `@northwind/ui` and Storybook. For layout, use `parameters: { northwind: { layout, maxWidth } }`.
   Storybook copies a story's imports into the examples agents read, so an MUI import there teaches the wrong thing.
6. Component styling goes in `src/theme/components.ts`, using theme values only. Not inside the wrapper components.
7. `src/demo/App.tsx` still imports MUI's Stack, Typography and ToggleButton for layout and text. That gap is decided in step 6.
