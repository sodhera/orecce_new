# Variation axes — how Orécce measures "a fresh vibe"

Variation is not a feeling, it's a measurement. Every piece declares its **design DNA**:
coordinates on eight axes. Two pieces feel different when their DNA differs on many
axes; a wall has range when no axis value dominates. Be vigilant: any single recurring
taste — even a good one — is a failure of this system.

## The eight axes

Declared in `piece.json` as `"dna"`:

```json
"dna": {
  "archetype": "marketing | commerce | editorial | dense-app | dashboard | playful | portfolio | cultural",
  "palette":   { "value": "light | dark | mixed",
                 "temperature": "warm | cool | neutral",
                 "accent_hue": 0-360,
                 "saturation": "muted | moderate | vivid" },
  "type_voice": "grotesk | humanist | serif-editorial | didone | slab | mono | chunky-display | serif+sans",
  "layout":    "single-column | split | asymmetric-grid | dense-modular | full-bleed-scenes | sidebar-app | broadsheet",
  "density":   "airy | medium | dense",
  "motion":    "micro-only | scroll-driven | cursor-reactive | ambient | springy",
  "shape":     "sharp | soft | rounded | organic | geometric",
  "texture":   "flat | paper | grain | gradient-atmosphere | line-work | photographic"
}
```

`accent_hue` is the dominant accent's hue in degrees (0 red, 40 orange, 60 yellow,
120 green, 200 cyan, 240 blue, 280 purple, 330 pink). Two hues "match" when within 60°.

## The distance rule

Distance between two pieces = number of axes that differ (palette counts as one axis;
it differs if two or more of its four sub-fields differ).

- **A new piece must score distance ≥ 4 from every piece already on the wall.**
- **Directions generated together for one request must score distance ≥ 5 from each
  other** — same product, different worlds.
- **Wall balance:** no single value should appear on more than ~40% of the wall
  (dark ≤ 40%, serif-editorial ≤ 40%, and so on).

## Procedure (before designing anything)

1. Read the `dna` blocks of the current wall: `node gallery/dna.js` prints the axis
   histogram, flags dominant values, and lists each piece's coordinates. (No script
   runner? Read the `piece.json` files.)
2. Choose DNA for the new piece(s) that satisfies the distance rule AND fits the product
   — DNA serves the brief, never the other way. If the contextually right choice would
   crowd an axis, differentiate harder on the other axes.
3. Declare the DNA in `piece.json` honestly. `node gallery/dna.js` verifies distances;
   if it flags a near-duplicate (< 4), the piece is not done.

## What the axes protect against

The house-style death spiral: every AI wall converges on warm-paper serif editorial or
dark glossy SaaS. Eight axes with a distance floor force the generator into corners of
the space it would never visit on its own — a vivid cool playful broadsheet, a muted
dark organic portfolio, a light mono dense dashboard. The constraint is the creativity.

DNA is necessary, not sufficient: two pieces with distant DNA can still both be
mediocre. The rubric (`evaluation-rubric.md`) judges quality; DNA judges range.
