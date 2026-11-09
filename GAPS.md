# Gaps

What Figma and code can't express the same way, what needs a human to check, and what the system is still
missing. Agents: read this before reporting a difference as a bug. Add to it when you find something new, in the
same PR as the work that found it.

Source of truth: **tokens, Figma leads. Components, code leads** (see `AGENTS.md`).

## 1. Expected differences between Figma and code

The parity check (`npm run parity`) treats these as expected via `sync/parity.config.json`. Keep the two in step.

| What | In code | In Figma | Why |
|---|---|---|---|
| Stack | Component (`direction`, `gap`, `padding`, `align`, `wrap`) | Auto layout frames, gap and padding bound to the spacing variable | Figma auto layout already does this |
| Text | Component (`variant`, `color`, `truncate`) | `typography/*` text styles | Figma styles text with styles |
| ColorSchemeSwitch | Demo control | Nothing; switch the palette mode | Not part of a designed screen |
| DataTable/HeaderCell, DataTable/Cell | Nothing; the Data Grid draws cells | Building blocks for the DataTable's slots | Figma needs real layers to fill a table |
| DataTable `rows`, `columns` | Data | `Rows` and `Header` slots | Figma can't take data; designers place cells |
| DataTable `state=empty` | `rows={[]}` | A variant | Shows the empty state without data |
| Interaction states (`state`: hovered, focused, pressed) | MUI handles them | Variants on Button and TextField | Designers need to see them; code needs no prop |
| TextField `hasValue`, `showValue`, `showPlaceholder` | Whether `value` or `placeholder` is set | Toggles | Figma has no "unset" text |
| Boolean props shown as a `state` option | `disabled`, `error`, `loading` | `state=disabled`, `state=error`, `state=loading` | Figma combines exclusive states into one variant |
| Icons, optional text and slots | Optional props | A toggle plus the icon, text or slot | Figma shows and hides layers with booleans |
| Behaviour-only props | `onClick`, `onChange`, `type`, `name`, `autoComplete`, `aria-label`, `fullWidth`, `defaultValue`, DataTable `label`, `pageSize` | Nothing | Not visible in a design |
| Column widths | `grow` per column | Equal widths | Figma slots can't share out spare width |
| Raw values in Figma components | MUI hard-codes them | Unbound: Button, TextField, Alert padding; StatusLabel height 24 and radius 16; DataTable cell padding and row heights | Same numbers MUI uses; see CLAUDE.md |
| `component/*` text styles | Inside MUI components | Text styles, not tokens | MUI hard-codes them; not exported |
| Derived colours (`*/_states/*`, `_components/*`) | Calculated by MUI | Copies in the `palette` collection | Checked by `sync/check-derived.mjs`; off by 1/255 is allowed |

## 2. Things only code can show (check in Storybook, not Figma)

- **Keyboard and focus order**, and what a screen reader announces (Storybook a11y addon).
- **Sorting, paging and column resizing** in the Data Grid.
- **Text wrapping and truncation** with real data lengths (`Text truncate`).
- **Colours MUI derives at runtime**, including MUI X components. Check computed colours in the browser
  (see CLAUDE.md: the Data Grid border and the MUI 9 `Text` colour bug).

## 3. Needs a human check

- **Every story has a Figma state.** Parity compares props, not stories. Libraries like MUI X bring states for
  free (loading, empty), so check new stories against Figma by eye.
- **Visual match.** Parity compares props and descriptions, not pixels. Measure both sides after a visual change.
- **Meaning, not syntax.** TypeScript allows any `status`; only review catches `success` used for something overdue.
- **Label wording.** Sentence case, a verb on buttons, self-describing status labels.

## 4. Open system gaps

| Gap | Found by | Next step |
|---|---|---|
| Figma Button has no loading state; code has a Loading story | Parity check (⚠️) | Add a `state=loading` variant with MUI's spinner |
| Figma component manifest is exported by hand, so CI only sees Figma as of the last export | Parity check | Run the export in every component PR; automate with the Figma REST API on an Enterprise plan |
| Figma changes made without an export go unnoticed (tokens and components) | Sync design | Scheduled agent export, or Enterprise REST API |
| Code Connect not set up (needs a Figma Organization plan) | Acme UI | Map components once the plan allows it |
