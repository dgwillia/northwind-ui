// FIGMA COMPONENT MANIFEST. Runs INSIDE Figma via the Figma MCP `use_figma` tool. Read-only.
//
// Lists every component on the "Northwind" page with its properties (name, type, allowed
// values, default) and its description, in a shape the parity check can compare with
// Storybook's component manifest. Save the returned object to sync/figma-components.json.

const page = figma.root.children.find(p => p.name === 'Northwind');
await figma.setCurrentPageAsync(page);
const clean = name => name.replace(/#[^#]*$/, '');               // "label#15:0" → "label"
const components = {};
for (const node of page.findAll(n => n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET'))) {
  const properties = {};
  for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
    const p = { type: def.type };
    if (def.type === 'VARIANT') p.options = def.variantOptions;
    if (def.type !== 'SLOT' && def.type !== 'INSTANCE_SWAP') p.default = def.defaultValue;
    properties[clean(key)] = p;
  }
  components[node.name] = { properties, description: node.description };
}
return { fileKey: figma.fileKey, components };
