// Checks Figma's "derived" colours against the maths MUI uses in code.
// Derived colours are not design decisions: MUI calculates them from the source roles.
// Figma has to store them as fixed values, so they can drift. This script catches that.
//
// Formulas (from @mui/material source):
//   state tints       role.main at action opacity (light: hover .04, selected .08, focus .12; dark: .08, .16, .12),
//                     focusVisible .3, outlinedBorder .5
//   alert colours     light: text = darken(role.light, .6), background = lighten(role.light, .9)
//                     dark:  text = lighten(role.light, .6), background = darken(role.light, .9)
//   dark surfaces     background.paper with a white overlay, alpha = (4.5 * ln(elevation + 1) + 2) / 100
//
// Exit code 1 when any value is off by more than 1 step (out of 255) in any channel.
// Run with --fix-json to print the corrected values for sync/fix-derived.figma.js.
import { readFileSync } from 'node:fs';

const snapshot = JSON.parse(readFileSync(new URL('./figma-snapshot.json', import.meta.url), 'utf8'));
const prim = Object.fromEntries(snapshot.primitives);
const sem = Object.fromEntries(snapshot.semantic.map(([n, l, d]) => [n, [l, d]]));

const toRgba = v => {
  const h = v.startsWith('{') ? prim[v.slice(1, -1)] : v;
  if (!h) throw new Error('Unknown value ' + v);
  const n = i => parseInt(h.slice(i, i + 2), 16);
  return [n(1), n(3), n(5), h.length === 9 ? n(7) : 255];
};
const toHex = c => '#' + c.slice(0, 3).map(x => Math.round(x).toString(16).padStart(2, '0')).join('') + (Math.round(c[3]) < 255 ? Math.round(c[3]).toString(16).padStart(2, '0') : '');
const role = (name, scheme) => toRgba(sem[name][scheme]);
const withAlpha = (c, a) => [c[0], c[1], c[2], a * 255];
const darken = (c, k) => [c[0] * (1 - k), c[1] * (1 - k), c[2] * (1 - k), 255];
const lighten = (c, k) => [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k, 255];
const overlay = (c, e) => { const a = (4.5 * Math.log(e + 1) + 2) / 100; return [c[0] * (1 - a) + 255 * a, c[1] * (1 - a) + 255 * a, c[2] * (1 - a) + 255 * a, 255]; };

const opacity = [
  { hover: 0.04, selected: 0.08, focus: 0.12, focusVisible: 0.3, outlinedBorder: 0.5 },
  { hover: 0.08, selected: 0.16, focus: 0.12, focusVisible: 0.3, outlinedBorder: 0.5 },
];

const expected = (name, s) => {
  let m;
  if ((m = name.match(/^text\/_states\/(\w+)$/))) return withAlpha(role('text/primary', s), opacity[s][m[1]]);
  if ((m = name.match(/^(\w+)\/_states\/(\w+)$/))) return withAlpha(role(`${m[1]}/main`, s), opacity[s][m[2]]);
  if ((m = name.match(/^_components\/alert\/(\w+)\/(color|background)$/))) {
    const light = role(`${m[1]}/light`, s);
    if (m[2] === 'color') return s === 0 ? darken(light, 0.6) : lighten(light, 0.6);
    return s === 0 ? lighten(light, 0.9) : darken(light, 0.9);
  }
  if ((m = name.match(/^_components\/paper\/elevation-(\d+)$/))) {
    const paper = role('background/paper', s);
    return s === 0 || +m[1] === 0 ? paper : overlay(paper, +m[1]);
  }
  throw new Error('No formula for ' + name);
};

const problems = [];
const fixes = [];
for (const [name, l, d] of snapshot.derived) {
  const row = [name];
  let off = false;
  for (const [s, v] of [[0, l], [1, d]]) {
    const want = expected(name, s);
    const got = toRgba(v);
    const diff = Math.max(...want.map((x, i) => Math.abs(Math.round(x) - got[i])));
    if (diff > 1) problems.push(`${name} (${s ? 'dark' : 'light'}): Figma ${v}, MUI ${toHex(want)}`);
    if (diff > 0) off = true; // --fix-json corrects even rounding-level differences
    row.push(toHex(want));
  }
  if (off) fixes.push(row);
}

if (process.argv.includes('--fix-json')) { console.log(JSON.stringify(fixes)); process.exit(0); }
if (problems.length) {
  console.error(`${problems.length} derived colour(s) in Figma differ from MUI's maths:`);
  for (const p of problems) console.error('  ' + p);
  console.error('Fix them in Figma: see "Derived colours" in CLAUDE.md.');
  process.exit(1);
}
console.log(`All ${snapshot.derived.length} derived colours match MUI's maths.`);
