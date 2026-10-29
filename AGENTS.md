# Rules for AI agents working in Northwind UI

Short for now. Filled in at step 6.

1. Run `npm run check` before you open a pull request. It must pass.
2. Do not merge pull requests. A person merges them.
3. Never edit `tokens/` or `src/theme/generated/` by hand. They come from Figma. See CLAUDE.md.
4. `src/demo/App.tsx` is a temporary smoke test. It is the only product file allowed to import `@mui/material` directly, and it will be replaced.
