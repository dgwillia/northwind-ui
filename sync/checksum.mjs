// Proves sync/figma-snapshot.json is exactly what Figma exported.
// Recomputes the djb2 checksum the export script computed inside Figma and compares.
import { readFileSync } from 'node:fs';

export function djb2(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

export function snapshotChecksum(snapshot) {
  const payload = { ...snapshot };
  delete payload.checksum;
  return djb2(JSON.stringify(payload));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const snapshot = JSON.parse(readFileSync(new URL('./figma-snapshot.json', import.meta.url), 'utf8'));
  const actual = snapshotChecksum(snapshot);
  if (actual !== snapshot.checksum) {
    console.error(`Checksum mismatch: Figma said ${snapshot.checksum}, the saved file gives ${actual}.`);
    console.error('The snapshot was changed or copied wrongly. Export from Figma again.');
    process.exit(1);
  }
  console.log(`Snapshot checksum OK (${actual}).`);
}
