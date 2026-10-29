# Northwind UI: notes for Claude

Read `AGENTS.md` first. Its rules apply to you.

- Stack: React 19, TypeScript 6, Vite 8, MUI 9 (Emotion), Storybook 10 with the MCP addon, ESLint, GitHub Actions.
- TypeScript is pinned to 6.0.x because typescript-eslint does not support TypeScript 7 yet.
- npm is pinned to 11.6.2 (`packageManager` in package.json). Use it so `package-lock.json` stays stable.
- Sync procedures (Figma to code and back) are written here in step 3.
