'use strict';
// Assembles the prompts sent to the coding agent: the full Visual Guru skill plus the
// task block for a specific variant (direction lens) or a refinement instruction.

const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.join(__dirname, '..', 'visual-guru');

const SKILL_FILES = [
  'SKILL.md',
  'knowledge/foundations.md',
  'knowledge/intent-translation.md',
  'knowledge/product-archetypes.md',
  'knowledge/anti-patterns.md',
  'knowledge/evaluation-rubric.md',
];

let _skillCache = null;
function skillText() {
  if (_skillCache) return _skillCache;
  _skillCache = SKILL_FILES.map((f) => {
    const p = path.join(SKILL_DIR, f);
    return `----- visual-guru/${f} -----\n\n${fs.readFileSync(p, 'utf8')}`;
  }).join('\n\n');
  return _skillCache;
}

const LENSES = [
  {
    key: 'default',
    label: 'Confident default',
    text: 'The confident default — the strongest, most contextually fitting direction for this product. If you could only ship one design, this is it.',
  },
  {
    key: 'typographic',
    label: 'Typography-led',
    text: 'Typography-led — composition and type carry the identity. Choose a distinctive, purposeful typeface pairing and let structure, scale, and editorial rhythm do the talking. Restrained color; the palette supports the type, never competes with it.',
  },
  {
    key: 'unexpected',
    label: 'Unexpected angle',
    text: 'The unexpected angle — a bolder structural, atmospheric, or conceptual idea that still absolutely fits the product and its audience. Take the intelligent risk the default direction would not; keep it completely usable.',
  },
];

const OUTPUT_CONTRACT = `
OUTPUT CONTRACT (strict — the studio depends on it):
- Create exactly two files in the CURRENT WORKING DIRECTORY, nothing else:
  1. \`index.html\` — the complete product mockup as ONE self-contained file.
  2. \`direction.json\` — {"name": "<direction name, 2-4 words>", "thesis": "<one sentence>", "signature": "<one sentence describing the memorable move>"}
- index.html rules:
  - All CSS and JS inline. Web fonts via Google Fonts <link> tags are allowed and encouraged when they serve the design; no other external scripts, stylesheets, or images.
  - Imagery must be crafted inline: SVG illustrations, CSS gradients/textures, data URIs. No external image URLs, no broken loads.
  - Fully responsive from 390px to 1440px. No horizontal overflow at 390px.
  - Real, specific content throughout — invent believable names, copy, and data. Never lorem ipsum, never placeholder boxes, never fake user counts or testimonials presented as real.
  - Working interactions where they sell the product (navigation, tabs, hovers, small state changes). Visible focus states. Respect prefers-reduced-motion.
- Do not initialize git, install packages, run servers, or create any other files.
- This is a high-fidelity product mockup a founder will judge in ten seconds. It must look like a top-tier design team shipped it.`;

function generationPrompt(userPrompt, lensIndex, total) {
  const lens = LENSES[lensIndex % LENSES.length];
  return `${skillText()}

============================================================
TASK
============================================================
You are the Visual Guru. Apply everything above.

The user asked for:

"${userPrompt}"

You are producing design direction ${lensIndex + 1} of ${total}. Each direction is generated independently and must stand alone.

Direction lens for THIS variant: ${lens.text}

Work through visual-guru/workflows/create-from-scratch.md: internal brief → archetype → one-sentence thesis → signature move → build. If the request is vague, invent a coherent, specific concept (real name, real offering, real copy) rather than a generic shell.
${OUTPUT_CONTRACT}`;
}

function refinementPrompt(userPrompt, instruction, direction) {
  return `${skillText()}

============================================================
TASK — REFINEMENT
============================================================
You are the Visual Guru refining an existing generation.

Original request: "${userPrompt}"
Current direction: ${JSON.stringify(direction || {})}

The current working directory contains the current iteration's \`index.html\` and \`direction.json\`.

Refinement instruction from the user:

"${instruction}"

Follow visual-guru/workflows/refine.md: stay inside the established direction unless the instruction demands otherwise; interpret the note like a design lead (fix causes, not symptoms); ripple every change through the whole system; preserve what works.

Edit \`index.html\` in place. Update \`direction.json\` only if the thesis meaningfully evolved. Same output rules as before: self-contained, inline assets only (Google Fonts links allowed), responsive, real content, no other files.`;
}

module.exports = { generationPrompt, refinementPrompt, LENSES };
