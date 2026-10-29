# Northwind UI: notes for Claude

Read `AGENTS.md` first. Its rules apply to you. `DESIGN.md` has the design rules and the token reference.

- Stack: React 19, TypeScript 6, Vite 8, MUI 9 (Emotion), Style Dictionary 5, Storybook 10 with the MCP addon, ESLint, GitHub Actions.
- `npm run check` = Figma snapshot checks, tokens, theme and DESIGN.md rebuilt and compared, ESLint guardrails, TypeScript.
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

- The kit's components were originally bound to MUI's *published library*, not the local variables, and used
  MUI's library text styles (Roboto, uppercase buttons). Before changing tokens, check what a component is actually bound to.
- Applying a text style and then changing the layer's case (or other text property) silently detaches the style.
  Put case in the text style itself.
- A text layer whose name follows its content renames itself when you change a TEXT property default.
  Find layers by `componentPropertyReferences`, not by name.
- In MUI, `dark` must be darker than `main` and `light` lighter, in both schemes. MUI uses `dark` for hover and
  `light` for alert colours.
- MUI rounds calculated colours down; Figma rounds to nearest. A difference of 1 (out of 255) is expected and allowed.
- Binding a colour variable to a paint (`setBoundVariableForPaint`) resets the paint's opacity to 100%. Set the
  opacity again afterwards. This hid StatusLabel's 70% borders and the DataTable skeleton's 11% bars until 29 Oct.
- MUI 9 accepts any string for some props and silently ignores values it doesn't know. `Text` passed
  `text.secondary` (the MUI 5 style) to Typography's `color`, which MUI 9 ignores, so every Text colour rendered as
  primary until 29 Oct. TypeScript can't catch it. Check computed colours in the browser.
- MUI X components derive some colours themselves. The Data Grid lightens the divider for its borders, which almost
  vanished with our palette, so `MuiDataGrid` in `src/theme/components.ts` points its border colour at `divider`.
  Check other MUI X components for the same thing when adding them.

## Figma components

The components to use live on the **Northwind** page. They match `@northwind/ui` by name and props.
The kit's own components (pages marked ❖) are kept as MUI's reference. Don't build from them.

| Figma | Code | Notes |
|---|---|---|
| `Button` · variant, size, label, startIcon, endIcon | `<Button>` · variant, size, children, startIcon, endIcon | Copied from the kit, 360 → 40 variants |
| `TextField` · label, value, placeholder, helperText, required | `<TextField>` · same; `state=error` ↔ `error` | Outlined, medium only |
| `Alert` · severity, title + titleText, message, onClose | `<Alert>` · severity, title, children, onClose | Standard style only |
| `StatusLabel` · status, label | `<StatusLabel>` · status, label | Built from scratch: MUI's Chip is locked in the kit |
| `Card` · title, subtitle, Action / Content / Footer slots | `<Card>` · title, subtitle, action, children, footer | Native Figma slots |
| `DataTable` · state (default, loading, empty), density, emptyMessage, Header and Rows slots, built from `DataTable/HeaderCell` (label, density, align) and `DataTable/Cell` (value, type, density) | `<DataTable>` · rows, columns (field, header, type, grow), label, loading, emptyMessage, density, pageSize | MUI X Data Grid (Community). Figma's columns are equal width; code uses `grow` |

`state` (enabled, hovered, focused, pressed, disabled, error) and `hasValue` are Figma-only: code handles them itself.

**Text styles.** `typography/*` styles are tokens and go through the pipeline (including `typography/button`).
`component/*` styles (button-small, input-value, input-label, alert-title, chip-label) mirror values MUI
hard-codes inside its components. They are not tokens and are not exported.

**Raw values allowed in Figma components**, because MUI hard-codes the same numbers in code: Button padding
(6/16, 4/10), TextField padding (16.5/14), Alert padding (6/16) and icon gaps, StatusLabel height (24) and pill
radius (16), DataTable cell padding (10) and heights (header 56 / 39 compact, rows 52 / 36 compact). Everything else (colours, Card and StatusLabel spacing, radius) is bound to variables.

**Checking a match:**
1. **Every story has a Figma state.** Each Storybook story (Loading, Empty, Compact, Disabled…) needs a matching
   variant or property in the Figma component. Storybook only shows what someone wrote in code, and libraries like
   MUI X bring states for free, so states can exist in code that designers never see.
2. **Measure both sides.** The Storybook story in a browser and the Figma variant with the plugin API: size,
   padding, gaps between parts, font, line height, and colour *including opacity*.
The last check (29 Oct 2026) matched to within 1px.
