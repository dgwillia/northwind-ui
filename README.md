# Northwind UI

A small design system built on MUI (Material UI), kept in sync between Figma and code, with guardrails for AI agents.

Companion to [Acme UI](https://github.com/dgwillia/acme-ui). Acme owns its components. Northwind themes and wraps an installed library, which is how most large organisations work.

## Run it

```sh
npm install
npm run dev          # demo app at http://localhost:5173
npm run storybook    # Storybook at http://localhost:6006 (MCP at /mcp)
npm run check        # what CI runs
```

## How the theme works

```
Figma variables ──export──▶ sync/figma-snapshot.json ──▶ tokens/ (DTCG) ──Style Dictionary──▶ src/theme/generated/ ──▶ createTheme()
```

Figma is the source of truth. See CLAUDE.md for the sync procedure.

## Status

- Step 1: project set up.
- Step 3: token pipeline. Figma drives the MUI theme, light and dark.
- Step 4: five wrapped components: Alert, Button, Card, StatusLabel, TextField.
