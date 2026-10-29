// Northwind UI: write corrected derived colours back into Figma.
// Runs INSIDE Figma through the Figma MCP `use_figma` tool.
// 1. Run `node sync/check-derived.mjs --fix-json` and paste its output over FIXES below.
// 2. Run this script in Figma. It only updates existing palette variables. It never creates or deletes.
// 3. Export again (sync/export-from-figma.figma.js) and save the new snapshot.

const FIXES = []; // [[name, lightHex, darkHex], ...]

const rgba = h => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255,
  a: h.length === 9 ? parseInt(h.slice(7, 9), 16) / 255 : 1,
});
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const pal = cols.find(c => c.name === 'palette');
const L = pal.modes.find(m => m.name === 'light').modeId;
const D = pal.modes.find(m => m.name === 'dark').modeId;
const vars = {};
for (const id of pal.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); vars[v.name] = v; }
const updated = [];
for (const [name, light, dark] of FIXES) {
  const v = vars[name];
  if (!v) throw new Error('Missing palette variable ' + name);
  // Leave aliases alone (e.g. light-mode surfaces that point at {white}); only replace raw values.
  if (v.valuesByMode[L]?.type !== 'VARIABLE_ALIAS') v.setValueForMode(L, rgba(light));
  if (v.valuesByMode[D]?.type !== 'VARIABLE_ALIAS') v.setValueForMode(D, rgba(dark));
  updated.push(name);
}
return { updated };
