// Northwind UI: export tokens from Figma.
// Runs INSIDE Figma through the Figma MCP `use_figma` tool (top-level await and return are allowed there).
// Returns a compact snapshot plus a djb2 checksum. Save the result, unchanged, to sync/figma-snapshot.json.
//
// What it reads:
//   northwind/colors  -> primitives (raw colours)
//   palette           -> semantic "source" roles (light and dark), as aliases to primitives where possible
//                        and the "derived" colours (state tints, alert colours, dark surfaces) as raw values,
//                        so code can check them against MUI's own maths
//   shape, spacing, typography -> base values and text styles

const FILE_KEY = 'HK9pcsf3PfuzcH5Q9AJT8D';

const ROLES = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const SOURCE = [
  'text/primary', 'text/secondary', 'text/disabled',
  ...ROLES.flatMap(r => [`${r}/main`, `${r}/dark`, `${r}/light`, `${r}/contrastText`]),
  'background/default', 'background/paper', 'divider',
];
const isDerived = n =>
  /^(primary|secondary|error|warning|info|success|text)\/_states\//.test(n) ||
  /^_components\/alert\//.test(n) ||
  /^_components\/paper\/elevation-\d+$/.test(n);

const hex = c => {
  const h = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (c.a !== undefined && c.a < 1 ? h(c.a) : '');
};

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byName = n => cols.find(c => c.name === n);
const prim = byName('northwind/colors');
const pal = byName('palette');
const L = pal.modes.find(m => m.name === 'light').modeId;
const D = pal.modes.find(m => m.name === 'dark').modeId;

const varCache = new Map();
const getVar = async id => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };

// Resolve a value for a mode: keep aliases to primitives as "{name}", follow aliases inside the palette,
// and flatten anything else (e.g. MUI's material/colors) to a raw hex value.
const resolve = async (v, modeId, depth = 0) => {
  const val = v.valuesByMode[modeId] ?? Object.values(v.valuesByMode)[0];
  if (val && val.type === 'VARIABLE_ALIAS') {
    const t = await getVar(val.id);
    if (t.variableCollectionId === prim.id) return '{' + t.name + '}';
    const tModes = t.variableCollectionId === pal.id ? modeId : Object.keys(t.valuesByMode)[0];
    return resolve(t, tModes, depth + 1);
  }
  if (val && typeof val === 'object' && 'r' in val) return hex(val);
  return val;
};

// Primitives
const primitives = [];
for (const id of prim.variableIds) {
  const v = await getVar(id);
  primitives.push([v.name, hex(Object.values(v.valuesByMode)[0])]);
}

// Palette: source roles and derived values
const palVars = {};
for (const id of pal.variableIds) { const v = await getVar(id); palVars[v.name] = v; }
const semantic = [];
for (const name of SOURCE) {
  const v = palVars[name];
  if (!v) throw new Error('Missing palette variable: ' + name);
  semantic.push([name, await resolve(v, L), await resolve(v, D)]);
}
const derived = [];
for (const name of Object.keys(palVars).filter(isDerived)) {
  derived.push([name, await resolve(palVars[name], L), await resolve(palVars[name], D)]);
}

// Base values
const firstValue = async (collection, name) => {
  for (const id of byName(collection).variableIds) {
    const v = await getVar(id);
    if (v.name === name) return Object.values(v.valuesByMode)[0];
  }
  throw new Error(`Missing ${collection}/${name}`);
};
const base = {
  borderRadius: await firstValue('shape', 'borderRadius'),
  spacing: await firstValue('spacing', '1'),
  fontFamily: await firstValue('typography', 'fontFamily'),
  fontWeightLight: await firstValue('typography', 'fontWeightLight'),
  fontWeightRegular: await firstValue('typography', 'fontWeightRegular'),
  fontWeightMedium: await firstValue('typography', 'fontWeightMedium'),
  fontWeightBold: await firstValue('typography', 'fontWeightBold'),
};

// Text styles: [name, family, style, sizePx, lineHeight, letterSpacing, textCase]
const fmt = u => !u || u.unit === 'AUTO' ? 'auto' : u.unit === 'PERCENT' ? +u.value.toFixed(3) + '%' : +u.value.toFixed(3) + 'px';
const textStyles = (await figma.getLocalTextStylesAsync())
  .filter(s => s.name.startsWith('typography/'))
  .map(s => [s.name.replace('typography/', ''), s.fontName.family, s.fontName.style, s.fontSize, fmt(s.lineHeight), fmt(s.letterSpacing), s.textCase]);

const payload = { fileKey: FILE_KEY, primitives, semantic, derived, base, textStyles };

// djb2 checksum over the exact JSON text. sync/checksum.mjs computes the same thing in Node.
const text = JSON.stringify(payload);
let h = 5381;
for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;

return { ...payload, checksum: h.toString(16) };
