# Rules for AI agents working in Northwind UI

These rules are enforced by `npm run check` (ESLint, TypeScript and generated-file checks) and `npm run parity`
(code vs Figma components). CI runs both.

## Source of truth (read this first)

- **Tokens: Figma leads.** Colours, spacing, radius and type are decided in Figma variables and synced into
  `/tokens`. Code never edits tokens.
- **Components: code leads. Figma mirrors it.** Props, allowed values, defaults and states are defined in
  `src/components`. If Figma and code disagree about a component, Figma is wrong and gets fixed.
- **Gaps:** anything one side can't express is listed in `GAPS.md`. Check it before reporting a difference as a
  bug, and add to it when you find something new.

## Building screens

1. Build only from `@northwind/ui`: Alert, Button, Card, ColorSchemeSwitch, DataTable, Stack, StatusLabel, Text,
   TextField. Never import `@mui/*` (including `@mui/x-*`) or `@emotion/*` in product code or stories.
2. Before using a component, read its stories and props through the Storybook MCP (`docs-show`). Follow `DESIGN.md`.
3. Layout with `Stack`, text with `Text`. No `style`, `sx`, `className`, hex or `rgb()` values.
4. If something you need doesn't exist, build the closest thing from what does, and **list the gap in your PR**.
   Do not work around the system. Reported gaps are how it improves.
   "Closest thing" means composing existing components in their normal way (rows of Stack and Text for a list).
   A workaround means making a component do something it isn't for, or recreating a missing component's look
   by hand (fake table columns with fixed widths). If you're unsure which it is, it's a gap: list it.

## Changing the system

5. Never edit `tokens/`, `src/theme/generated/` or the generated section of `DESIGN.md` by hand. Tokens come from
   Figma. See CLAUDE.md for the sync procedure.
6. Component styling goes in `src/theme/components.ts`, using theme values only. Not inside the wrapper components.
7. Wrapper components expose small, named props. Don't add `sx`, `className`, `style` or MUI's `color` to them.
8. Story files import only from `@northwind/ui` (a component's own story may use `./Component`) and Storybook.
   For layout use `parameters: { northwind: { layout, maxWidth } }`. Storybook copies a story's imports into the
   examples agents read, so an MUI import there teaches the wrong thing.

## Working

9. Run `npm run check` before you open a pull request. It must pass. If you changed a component's props or JSDoc,
   also run `npm run build-storybook && npm run parity`, then update the Figma component and its description to
   match (see CLAUDE.md).
10. Do not merge pull requests. A person merges them.
