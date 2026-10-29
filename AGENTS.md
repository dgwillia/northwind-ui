# Rules for AI agents working in Northwind UI

These rules are enforced by `npm run check` (ESLint, TypeScript and generated-file checks). CI runs the same check.

## Building screens

1. Build only from `@northwind/ui`: Alert, Button, Card, ColorSchemeSwitch, Stack, StatusLabel, Text, TextField.
   Never import `@mui/*` or `@emotion/*` in product code or stories.
2. Before using a component, read its stories and props through the Storybook MCP (`docs-show`). Follow `DESIGN.md`.
3. Layout with `Stack`, text with `Text`. No `style`, `sx`, `className`, hex or `rgb()` values.
4. If something you need doesn't exist, build the closest thing from what does, and **list the gap in your PR**.
   Do not work around the system. Reported gaps are how it improves.

## Changing the system

5. Never edit `tokens/`, `src/theme/generated/` or the generated section of `DESIGN.md` by hand. Tokens come from
   Figma. See CLAUDE.md for the sync procedure.
6. Component styling goes in `src/theme/components.ts`, using theme values only. Not inside the wrapper components.
7. Wrapper components expose small, named props. Don't add `sx`, `className`, `style` or MUI's `color` to them.
8. Story files import only from `@northwind/ui` (a component's own story may use `./Component`) and Storybook.
   For layout use `parameters: { northwind: { layout, maxWidth } }`. Storybook copies a story's imports into the
   examples agents read, so an MUI import there teaches the wrong thing.

## Working

9. Run `npm run check` before you open a pull request. It must pass.
10. Do not merge pull requests. A person merges them.
