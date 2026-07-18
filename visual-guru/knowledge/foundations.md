# Foundations — what makes visual work good

Compressed, operational design knowledge. These are levers, not laws; every rule bends to
context — but bending must be a decision, never an accident.

## 1. Hierarchy

- Every screen has ONE most important thing. If everything is emphasized, nothing is.
- The eye should land in an intentional order: primary message → primary action → support.
- Build hierarchy with multiple channels at once: size, weight, color value, spacing,
  position. Size alone is amateur; spacing + weight is often stronger than size.
- The five-second test: a stranger should know what this is, what matters, and what to do
  within five seconds.

## 2. Composition & layout

- Design the first viewport as ONE composition, not a stack of blocks that happen to touch.
- Use a real grid (12-col for marketing, denser modular grids for apps) and align to it.
  Broken alignment is the fastest tell of careless work; deliberate grid-breaking is a
  technique that only reads when everything else is aligned.
- Whitespace is an active material. Large space = importance/luxury/pause. Tight space =
  efficiency/density/urgency. Uneven, unconsidered space = sloppiness.
- Asymmetry creates energy; symmetry creates authority/calm. Choose per the emotional target.
- Sections should hand off to each other (shared axis, continued rhythm, connective motifs),
  not merely stack.

## 3. Typography (the highest-leverage lever)

- Choose type for the product's voice: a grotesk reads neutral/technical; a humanist sans
  reads friendly; a transitional serif reads editorial/authoritative; a didone reads luxury/
  fashion; a slab reads sturdy/retro; a mono reads technical/precise.
- One family can be enough; two is the norm (display + text); three needs a reason.
- Scale: pick a ratio (1.2 compact UI, 1.25–1.333 editorial/marketing) and stick to it.
  Define the whole scale up front; never invent sizes mid-build.
- Body text: 16–18px web, line-height 1.5–1.7, measure 45–75 characters. Headlines:
  line-height 0.95–1.2, letter-spacing slightly negative for large sizes (-0.01 to -0.03em).
- Hierarchy inside text: weight and space before size. Labels/eyebrows: small caps or
  letterspaced uppercase at 11–13px with +0.05–0.12em tracking.
- Numbers in data UIs: tabular figures (`font-variant-numeric: tabular-nums`).
- Never fake small caps, never stretch type, never center long paragraphs.

## 4. Color

- Build a system of roles, not a list of colors: background surfaces (2–3 levels), ink
  (2–3 levels), one accent doing real work (primary actions/key highlights), and state
  colors (success/warn/error) tuned to the palette.
- Most interfaces are 90% neutrals. The character lives in WHICH neutrals: warm (paper,
  stone, cream) vs cool (slate, zinc) changes the whole feeling. Pure #000/#fff are usually
  too harsh; tint them toward the palette.
- Saturation discipline: full saturation only in small doses. Large areas = low saturation.
- Accent color earns attention by scarcity. If the accent appears everywhere it means nothing.
- Contrast floors: text 4.5:1 (large text 3:1), non-text UI 3:1. Check pale greys — the most
  common AI failure is 3:1 body text.
- Dark UIs: raise surfaces with lightness (not just shadows), desaturate accents slightly,
  never pure black behind pure white.

## 5. Spacing & density

- One spacing unit (4 or 8px) and a scale of it. Consistent rhythm is felt even when unseen.
- Related things close, unrelated things far (proximity is grouping).
- Density is a product decision: daily-use tools earn density (more per screen = respect for
  the expert user); first-visit marketing earns air. Getting this backwards ruins both.
- Padding proportional to element importance and size; generous inside primary surfaces.

## 6. Interaction & states

- Every interactive element: default, hover, focus-visible, active, disabled. Focus rings
  visible and styled with the palette (never removed).
- Feedback within 100ms (even just a pressed state). Optimistic UI where safe.
- Complete states for real products: loading (skeletons > spinners), empty (helpful, warm,
  actionable), error (what happened + what to do), success (confirm, then get out of the way).
- Affordance: clickable things must look clickable; non-clickable things must not.

## 7. Motion

- Motion explains (where did this come from, where did it go) or expresses character.
  If it does neither, cut it.
- Durations: micro 100–200ms, standard 200–350ms, expressive/scene 400–700ms. Ease-out for
  entrances, ease-in for exits, never linear (except color fades and marquees).
- Choreograph with small staggers (20–60ms) rather than animating everything at once.
- One signature motion is worth more than motion everywhere. Respect
  `prefers-reduced-motion` always.

## 8. Responsive behavior

- Mobile is a design, not a consequence. Rework hierarchy: what earns the first screen?
  Nav condenses meaningfully; type scale tightens (headline sizes drop ~30–40%);
  touch targets ≥ 44px for primary actions; density loosens slightly for touch.
- No accidental horizontal overflow, ever. Test at 390px mentally: every fixed width,
  every table, every long word.
- Tables on mobile become cards, column-priority lists, or horizontal-scroll regions with
  a visible affordance — chosen per data shape.

## 9. Perceived quality (the last 10% that reads as the first 90%)

- Consistency of radii, border weights, shadow direction/softness, icon stroke width and
  style, spacing rhythm — mismatches here read as "assembled", not "designed".
- Shadows: one imagined light source, layered soft shadows over single hard ones,
  tinted toward the surface hue (never pure black at high opacity on colored surfaces).
- Text on images: guarantee legibility with scrims/gradients, never raw text over noise.
- Realistic content everywhere. Specificity is credibility: "Kathmandu → Pokhara, 25 min"
  beats "Fast routes". Copy IS design.
- Optical alignment beats mathematical alignment: icons nudged to visual center,
  triangles overshoot, punctuation hangs.

## 10. Accessibility (floor, not feature)

Semantic landmarks and heading order; alt text that says something; labels tied to inputs;
keyboard path through every flow; visible focus; contrast floors met; touch targets ≥24px
(44px primary); motion reducible; never color as the only signal.
