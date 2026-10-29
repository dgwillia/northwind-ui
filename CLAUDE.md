# Northwind UI: notes for Claude

Read `AGENTS.md` first. Its rules apply to you.

- Stack: React 19, TypeScript 6, Vite 8, MUI 9 (Emotion), Style Dictionary 5, Storybook 10 with the MCP addon, ESLint, GitHub Actions.
- TypeScript is pinned to 6.0.x because typescript-eslint does not support TypeScript 7 yet.
- npm is pinned to 11.6.2 (`packageManager` in package.json). Use it so `package-lock.json` stays stable.
- Figma file: `HK9pcsf3PfuzcH5Q9AJT8D` (Northwind UI). It started as a copy of MUI's free community kit.

## Where tokens live

Figma is the source of truth. Code never edits tokens by hand.

| Figma collection | What it is | Goes to |
|---|---|---|
| `northwind/colors` | Primitives: the raw colour ramps | `tokens/primitives/color.tokens.json` |
| `palette` (light, dark) | MUI's semantic roles, unrenamed: `primary/main`, `text/secondary`… | `tokens/semantic/{light,dark}.tokens.json` |
| `shape`, `spacing`, `typography` | Radius, 8px spacing unit, font, text styles | `tokens/base/*.tokens.json` |
| `material/colors` | MUI's original colours. Not ours. Ignored. | nothing |

`palette` also holds **derived** colours (`*/_states/*`, `_components/alert/*`, `_components/paper/elevation-*`).
They are not tokens. MUI calculates them in code from the source roles. Figma keeps copies so designs look right,
and `sync/check-derived.mjs` makes sure those copies match MUI's maths.

## Figma → code (the normal direction)

1. Run `sync/export-from-figma.figma.js` inside Figma with the Figma MCP `use_figma` tool (call `create_session` first).
   It returns the snapshot and a djb2 checksum.
2. Save the result to `sync/figma-snapshot.json`. If the full result is too big to copy reliably, have the script
   return only the changed parts plus the checksum, and splice them into the existing file.
3. `npm run tokens:from-figma`: checks the checksum, writes `/tokens`, checks derived colours. All three must pass.
4. `npm run tokens:build`: Style Dictionary writes `src/theme/generated/*`.
5. `npm run check`, then open a PR. CI runs the same check. It fails if `tokens/` or `src/theme/generated/`
   differ from what the snapshot produces, so hand edits are caught.

## Derived colours

If `check-derived` fails, Figma's copies are out of date (usually after a source colour changed).

1. `node sync/check-derived.mjs --fix-json` prints the corrected values.
2. Paste them into `FIXES` in `sync/fix-derived.figma.js` and run it in Figma. It only updates values.
3. Export again (step 1 above).

## Code → Figma

Not built yet. Until it is, change tokens in Figma only.

## Gotchas

- The kit's components were originally bound to MUI's *published library*, not the local variables.
  Button, Alert, Text Field and Card were re-bound to local variables (29 Oct 2026). Other kit components were not.
  Before changing tokens, check what a component is actually bound to.
- In MUI, `dark` must be darker than `main` and `light` lighter, in both schemes. MUI uses `dark` for hover and
  `light` for alert colours.
- MUI rounds calculated colours down; Figma rounds to nearest. A difference of 1 (out of 255) is expected and allowed.
