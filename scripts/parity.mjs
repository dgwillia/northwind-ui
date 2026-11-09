// COMPONENT PARITY CHECK. No AI: a plain comparison of two lists.
//
//   Code:  Storybook's component manifest (storybook-static/manifests/components.json,
//          written by `npm run build-storybook`): every prop, its allowed values and default.
//   Figma: sync/figma-components.json (exported by sync/export-components.figma.js via use_figma).
//
// Code leads for components, so a difference means Figma is wrong, unless sync/parity.config.json
// declares it (and GAPS.md explains it). Results: ✅ match · ❌ mismatch · ➖ expected · ⚠️ known gap.
//
// Usage: npm run parity [-- path/to/components.json]   Exit code 1 if anything is ❌.
import { readFileSync, existsSync } from 'node:fs';
import { describe, valuesOf } from './figma-descriptions.mjs';

const root = new URL('..', import.meta.url).pathname;
const codePath = process.argv[2] ?? root + 'storybook-static/manifests/components.json';
if (!existsSync(codePath)) {
  console.error(`No code manifest at ${codePath}. Run \`npm run build-storybook\` first.`);
  process.exit(2);
}
const code = JSON.parse(readFileSync(codePath, 'utf8')).components;
const figma = JSON.parse(readFileSync(root + 'sync/figma-components.json', 'utf8')).components;
const cfg = JSON.parse(readFileSync(root + 'sync/parity.config.json', 'utf8'));

const unquote = v => (v == null ? undefined : String(v).replace(/^['"]|['"]$/g, ''));
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
// Figma returns descriptions HTML-escaped (' as &#39;, " as &quot;).
const decode = s => (s ?? '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const rows = [];
const push = (state, c, what) => rows.push({ state, c, what });
const ok = (c, w) => push('ok', c, w), bad = (c, w) => push('bad', c, w), note = (c, w) => push('note', c, w), gap = (c, w) => push('gap', c, w);

const codeNames = new Set(Object.values(code).map(c => c.name));
for (const name of Object.keys(figma)) {
  if (codeNames.has(name)) continue;
  if (cfg.figmaOnlyComponents?.[name]) note(name, `Figma only (expected): ${cfg.figmaOnlyComponents[name]}`);
  else bad(name, 'in Figma but not in code');
}

for (const comp of Object.values(code)) {
  const name = comp.name;
  if (!comp.reactDocgen) continue;                                   // e.g. foundations pages, not components
  if (cfg.codeOnlyComponents[name]) { note(name, `code only (expected): ${cfg.codeOnlyComponents[name]}`); continue; }
  const f = figma[name];
  if (!f) { bad(name, 'in code but missing from Figma'); continue; }
  const fp = f.properties, used = new Set();
  const rules = cfg.components?.[name]?.props ?? {};
  const has = (prop, type) => fp[prop]?.type === type;
  const need = (prop, type) => { if (has(prop, type)) { used.add(prop); return true; } bad(name, `Figma needs a ${type.toLowerCase()} property "${prop}"`); return false; };

  for (const [prop, def] of Object.entries(comp.reactDocgen.props ?? {})) {
    const rule = rules[prop];
    const codeDefault = unquote(def.defaultValue?.value);
    if (rule?.gap) { gap(name, `${prop}: known gap. ${rule.gap}`); continue; }
    if (rule?.codeOnly) { note(name, `${prop}: code only (expected)`); continue; }
    if (!rule && cfg.codeOnlyProps[prop]) { note(name, `${prop}: code only (expected)`); continue; }

    if (rule) {
      let fine = true;
      if (rule.text) fine = need(rule.text, 'TEXT') && fine;
      if (rule.slot) fine = need(rule.slot, 'SLOT') && fine;
      if (rule.icon) fine = need(rule.icon, 'INSTANCE_SWAP') && fine;
      if (rule.toggle) fine = need(rule.toggle, 'BOOLEAN') && fine;
      if (rule.variantOption) {
        const v = fp[rule.variantOption];
        if (v?.type !== 'VARIANT' || !v.options.includes(rule.option)) { bad(name, `${prop}: Figma variant "${rule.variantOption}" needs the option "${rule.option}"`); fine = false; }
        else {
          used.add(rule.variantOption);
          const codeOn = codeDefault === 'true';
          if (codeOn !== (v.default === rule.option)) { bad(name, `${prop}: default differs. Code ${codeOn}, Figma ${rule.variantOption}=${v.default}`); fine = false; }
        }
      }
      if (fine) ok(name, `${prop} → Figma ${[rule.text && `text "${rule.text}"`, rule.slot && `slot "${rule.slot}"`, rule.icon && `icon "${rule.icon}"`, rule.toggle && `toggle "${rule.toggle}"`, rule.variantOption && `${rule.variantOption}=${rule.option}`].filter(Boolean).join(' + ')}`);
      continue;
    }

    // Default rules
    const options = valuesOf(def, comp.reactDocgen.definedInFile);
    const tname = def.tsType?.name;
    if (options) {
      const p = fp[prop];
      if (p?.type !== 'VARIANT') { bad(name, `${prop}: should be a Figma variant`); continue; }
      used.add(prop);
      if (!same(options, p.options)) { bad(name, `${prop}: values differ. Code [${options}] Figma [${p.options}]`); continue; }
      if (codeDefault !== undefined && codeDefault !== p.default) { bad(name, `${prop}: default differs. Code "${codeDefault}", Figma "${p.default}"`); continue; }
      ok(name, `${prop}: ${options.join(' | ')} (default ${codeDefault ?? 'none'})`);
    } else if (tname === 'boolean') {
      const p = fp[prop];
      if (!(p?.type === 'BOOLEAN' || (p?.type === 'VARIANT' && same(p.options, ['false', 'true'])))) { bad(name, `${prop}: should be a Figma boolean`); continue; }
      used.add(prop);
      if ((codeDefault ?? 'false') !== String(p.default)) { bad(name, `${prop}: default differs. Code "${codeDefault ?? 'false'}", Figma "${p.default}"`); continue; }
      ok(name, `${prop}: boolean (default ${codeDefault ?? 'false'})`);
    } else if (tname === 'string') {
      if (need(prop, 'TEXT')) ok(name, `${prop}: text`);
    } else {
      bad(name, `${prop} (${def.tsType?.raw ?? tname}): no rule. Add a mapping or a codeOnly entry in sync/parity.config.json`);
    }
  }
  const figmaOnly = cfg.components?.[name]?.figmaOnly ?? {};
  for (const k of Object.keys(fp)) {
    if (figmaOnly[k]) note(name, `${k}: Figma only (expected)`);
    else if (!used.has(k)) bad(name, `${k}: in Figma but not a code prop`);
  }
  if (decode(f.description) === describe(comp, cfg)) ok(name, 'description: generated from code, up to date');
  else bad(name, 'description: out of date. Run `npm run figma:descriptions`, then sync/apply-descriptions.figma.js');
}

const icon = { ok: '✅', bad: '❌', note: '➖', gap: '⚠️ ' };
let current = '';
for (const r of rows) {
  if (r.c !== current) { console.log(`\n${r.c}`); current = r.c; }
  console.log(`  ${icon[r.state]} ${r.what}`);
}
const n = s => rows.filter(r => r.state === s).length;
console.log(`\n${n('ok')} match, ${n('bad')} mismatch${n('bad') === 1 ? '' : 'es'}, ${n('note')} expected differences, ${n('gap')} known gap${n('gap') === 1 ? '' : 's'} (see GAPS.md).`);
process.exit(n('bad') ? 1 : 0);
