'use strict';
// Orécce DNA report — measures variation across the wall.
// Usage: node gallery/dna.js        (histogram + pairwise distances + flags)

const fs = require('fs');
const path = require('path');

const PIECES_DIR = path.join(__dirname, 'pieces');
const AXES = ['archetype', 'palette', 'type_voice', 'layout', 'density', 'motion', 'shape', 'texture'];
const MIN_DISTANCE = 4;
const DOMINANCE = 0.4;

function load() {
  const out = [];
  for (const slug of fs.readdirSync(PIECES_DIR)) {
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(PIECES_DIR, slug, 'piece.json'), 'utf8'));
      out.push({ slug, dna: meta.dna || null });
    } catch (_) {}
  }
  return out;
}

function hueDiff(a, b) {
  const d = Math.abs((a || 0) - (b || 0)) % 360;
  return Math.min(d, 360 - d);
}

function paletteDiffers(a, b) {
  if (!a || !b) return true;
  let diffs = 0;
  if (a.value !== b.value) diffs++;
  if (a.temperature !== b.temperature) diffs++;
  if (hueDiff(a.accent_hue, b.accent_hue) > 60) diffs++;
  if (a.saturation !== b.saturation) diffs++;
  return diffs >= 2;
}

function distance(a, b) {
  let d = 0;
  for (const ax of AXES) {
    if (ax === 'palette') { if (paletteDiffers(a.palette, b.palette)) d++; }
    else if ((a[ax] || '') !== (b[ax] || '')) d++;
  }
  return d;
}

const pieces = load();
const withDna = pieces.filter((p) => p.dna);
const missing = pieces.filter((p) => !p.dna);

console.log(`\nORÉCCE DNA REPORT — ${pieces.length} pieces, ${withDna.length} with DNA\n`);
if (missing.length) console.log('⚠ missing dna: ' + missing.map((p) => p.slug).join(', ') + '\n');

// Histogram per axis
for (const ax of AXES) {
  const counts = {};
  for (const p of withDna) {
    let v;
    if (ax === 'palette') {
      const pal = p.dna.palette || {};
      v = `${pal.value || '?'}/${pal.temperature || '?'}/${pal.saturation || '?'}`;
    } else v = p.dna[ax] || '?';
    counts[v] = (counts[v] || 0) + 1;
  }
  const parts = Object.entries(counts).sort((a, b) => b[1] - a[1])
    .map(([v, n]) => {
      const share = n / withDna.length;
      const flag = share > DOMINANCE && withDna.length >= 4 ? ' ⚠DOMINANT' : '';
      return `${v}:${n}${flag}`;
    });
  console.log(`  ${ax.padEnd(11)} ${parts.join('  ')}`);
}

// Pairwise distances
console.log('\nPAIRWISE DISTANCES (flag < ' + MIN_DISTANCE + '):');
let flagged = 0;
for (let i = 0; i < withDna.length; i++) {
  let minD = Infinity, minSlug = '';
  for (let j = 0; j < withDna.length; j++) {
    if (i === j) continue;
    const d = distance(withDna[i].dna, withDna[j].dna);
    if (d < minD) { minD = d; minSlug = withDna[j].slug; }
    if (j > i && d < MIN_DISTANCE) {
      console.log(`  ⚠ ${withDna[i].slug} ↔ ${withDna[j].slug} — distance ${d}`);
      flagged++;
    }
  }
  if (minD !== Infinity) {
    console.log(`  ${withDna[i].slug.padEnd(28)} nearest: ${minSlug} (d=${minD})`);
  }
}
console.log(flagged ? `\n✗ ${flagged} pair(s) too similar — differentiate before hanging.\n`
  : '\n✓ wall has healthy range.\n');
