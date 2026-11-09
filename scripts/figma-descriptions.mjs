// FIGMA DESCRIPTIONS, GENERATED FROM CODE.
//
// Code leads for components, so each Figma component's description is built from the code:
// the component's JSDoc, its props (allowed values, defaults, JSDoc, and which Figma property
// each one maps to) and its Storybook page. Written once, in code. Never edit a description
// in Figma by hand: edit the JSDoc instead.
//
// Used by scripts/parity.mjs (to check Figma's descriptions are current) and by
// `npm run figma:descriptions`, which writes sync/figma-descriptions.json for
// sync/apply-descriptions.figma.js to paste into Figma.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url).pathname;
const unquote = v => (v == null ? undefined : String(v).replace(/^['"]|['"]$/g, ''));
const plain = s => (s ?? '').replace(/`/g, '').trim();
const indent = s => s.split('\n').map(l => '    ' + l.trim()).join('\n');

// Allowed values of a prop: a union of string literals, or `keyof typeof X` read from the component's source.
export function valuesOf(def, file) {
  const t = def.tsType;
  if (t?.name === 'union' && t.elements?.every(e => /^['"]/.test(e.value))) return t.elements.map(e => unquote(e.value));
  const m = t?.raw?.match(/^keyof typeof (\w+)$/) ?? t?.name?.match(/^keyof typeof (\w+)$/);
  if (m && file && existsSync(file)) {
    const block = readFileSync(file, 'utf8').match(new RegExp(`const ${m[1]}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}`));
    if (block) return [...block[1].matchAll(/^\s{2}['"]?([\w-]+)['"]?\s*:/gm)].map(x => x[1]);
  }
  return null;
}

const figmaName = rule => [rule.text && `text "${rule.text}"`, rule.slot && `slot "${rule.slot}"`, rule.icon && `icon "${rule.icon}"`,
  rule.toggle && `toggle "${rule.toggle}"`, rule.variantOption && `${rule.variantOption}=${rule.option}`].filter(Boolean).join(' + ');

export function describe(comp, cfg) {
  const name = comp.name;
  const rules = cfg.components?.[name]?.props ?? {};
  const lines = [`import { ${name} } from '${cfg.package}'`, '', plain(comp.description), '', 'Props'];
  for (const [prop, def] of Object.entries(comp.reactDocgen?.props ?? {})) {
    const rule = rules[prop];
    if (rule?.codeOnly || (!rule && cfg.codeOnlyProps[prop])) continue;
    const values = valuesOf(def, comp.reactDocgen.definedInFile);
    const dflt = unquote(def.defaultValue?.value);
    let head = `• ${prop}${def.required ? '' : '?'}`;
    if (values) head += `: ${values.join(' | ')}`;
    else if (def.tsType?.name === 'boolean') head += ': true | false';
    if (dflt !== undefined) head += ` (default ${dflt})`;
    if (rule?.gap) head += '. Not in Figma yet';
    else if (rule) head += `. In Figma: ${figmaName(rule)}`;
    lines.push(head);
    const text = plain((def.description ?? '').replace(/\s*@default\s+.+$/gm, ''));   // the default is already shown above
    if (text) lines.push(indent(text));
  }
  const storyFile = root + comp.path.replace(/^\.\//, '');
  const title = existsSync(storyFile) ? readFileSync(storyFile, 'utf8').match(/title:\s*'([^']+)'/)?.[1] : null;
  if (title) lines.push('', `Storybook: ${title}`);
  lines.push('', 'Generated from code. Edit the JSDoc in the component, not this text.');
  return lines.join('\n');
}

// CLI: npm run figma:descriptions [-- path/to/components.json]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifestPath = process.argv[2] ?? root + 'storybook-static/manifests/components.json';
  if (!existsSync(manifestPath)) { console.error('Run `npm run build-storybook` first.'); process.exit(2); }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const cfg = JSON.parse(readFileSync(root + 'sync/parity.config.json', 'utf8'));
  const out = {};
  for (const comp of Object.values(manifest.components)) {
    if (!comp.reactDocgen || cfg.codeOnlyComponents[comp.name]) continue;
    out[comp.name] = describe(comp, cfg);
  }
  writeFileSync(root + 'sync/figma-descriptions.json', JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote descriptions for ${Object.keys(out).join(', ')} to sync/figma-descriptions.json`);
}
