// Turns Figma's snapshot into DTCG token files in /tokens.
// DTCG = the W3C Design Tokens Community Group format: { "$type": "color", "$value": "#0f766e" }.
// Aliases keep their meaning: "{teal/700}" in Figma becomes "{color.teal.700}" here.
//
// Only the "source" roles become tokens. Derived colours (hover tints, alert colours, dark surfaces)
// are calculated by MUI in code; sync/check-derived.mjs makes sure Figma's copies agree.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const snapshot = JSON.parse(readFileSync(new URL('sync/figma-snapshot.json', root), 'utf8'));

const set = (obj, path, value) => {
  let o = obj;
  for (const k of path.slice(0, -1)) o = o[k] ??= {};
  o[path.at(-1)] = value;
};
const toRef = v => (typeof v === 'string' && v.startsWith('{') ? `{color.${v.slice(1, -1).replaceAll('/', '.')}}` : v);
const write = (file, data) => {
  const url = new URL(`tokens/${file}`, root);
  mkdirSync(new URL('.', url), { recursive: true });
  writeFileSync(url, JSON.stringify(data, null, 2) + '\n');
};

// Primitives: colours
const color = {};
for (const [name, hex] of snapshot.primitives) set(color, ['color', ...name.split('/')], { $type: 'color', $value: hex });
write('primitives/color.tokens.json', color);

// Semantic: one file per colour scheme. Paths follow MUI's palette (palette.primary.main, palette.text.secondary).
for (const [scheme, index] of [['light', 1], ['dark', 2]]) {
  const out = {};
  for (const row of snapshot.semantic) {
    set(out, ['palette', ...row[0].split('/')], { $type: 'color', $value: toRef(row[index]) });
  }
  write(`semantic/${scheme}.tokens.json`, out);
}

// Base: shape, spacing, typography
const b = snapshot.base;
write('base/shape.tokens.json', { shape: { borderRadius: { $type: 'dimension', $value: { value: b.borderRadius, unit: 'px' } } } });
write('base/spacing.tokens.json', { spacing: { unit: { $type: 'dimension', $value: { value: b.spacing, unit: 'px' } } } });

const weight = { Thin: 100, 'Extra Light': 200, Light: 300, Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700, 'Extra Bold': 800, Black: 900 };
const typography = {
  fontFamily: { $type: 'fontFamily', $value: [b.fontFamily, 'system-ui', 'sans-serif'] },
  fontWeight: {
    light: { $type: 'fontWeight', $value: b.fontWeightLight },
    regular: { $type: 'fontWeight', $value: b.fontWeightRegular },
    medium: { $type: 'fontWeight', $value: b.fontWeightMedium },
    bold: { $type: 'fontWeight', $value: b.fontWeightBold },
  },
  variant: {},
};
const lineHeight = (v, size) => (v === 'auto' ? 'normal' : v.endsWith('%') ? +(parseFloat(v) / 100).toFixed(3) : +(parseFloat(v) / size).toFixed(3));
const letterSpacing = (v, size) => (v === 'auto' ? 0 : v.endsWith('%') ? +(parseFloat(v) / 100).toFixed(4) : +(parseFloat(v) / size).toFixed(4));
for (const [name, family, style, size, lh, ls, textCase] of snapshot.textStyles) {
  if (weight[style] === undefined) throw new Error(`Unknown font style "${style}" on text style ${name}`);
  typography.variant[name] = {
    $type: 'typography',
    $value: {
      fontFamily: family === b.fontFamily ? '{typography.fontFamily}' : [family],
      fontWeight: weight[style],
      fontSize: { value: size / 16, unit: 'rem' },
      lineHeight: lineHeight(lh, size),
      letterSpacing: { value: letterSpacing(ls, size), unit: 'em' },
    },
    // text-transform is not part of the DTCG typography type, so it travels as an extension.
    ...(textCase === 'UPPER' ? { $extensions: { 'com.northwind': { textTransform: 'uppercase' } } } : {}),
  };
}
write('base/typography.tokens.json', { typography });

console.log(`Tokens written: ${snapshot.primitives.length} primitives, ${snapshot.semantic.length} semantic roles x 2 schemes, ${snapshot.textStyles.length} text styles.`);
