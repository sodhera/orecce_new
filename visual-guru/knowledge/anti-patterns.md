# Anti-patterns — the failure modes of AI-generated interfaces

These patterns are not absolutely banned; they require a clear contextual reason. Their
*automatic* appearance is what marks output as machine-generated slop. For each: why it
happens, and what to do instead.

## Layout & structure

- **Giant centered hero + three feature cards + CTA band** — the statistical mean of the
  training data. *Instead:* pick a structure from the content: product-as-hero, editorial
  split, type-only opening, demo-first, data-first.
- **Bento grids with no information logic** — decoration pretending to be organization.
  *Instead:* group by actual relationships; size cells by actual importance.
- **Repeated identical card grids** — one component stamped everywhere. *Instead:* vary
  presentation by content type; lists, tables, and prose are often better than cards.
- **Unnecessary sidebars / dashboards for non-tools** — app cosplay. *Instead:* match
  navigation to actual information architecture.
- **Huge empty sections that aren't composition** — space with no tension or purpose.
  *Instead:* whitespace must frame something; if nothing to frame, tighten.
- **Mobile = stacked desktop cards** — no mobile thinking. *Instead:* re-decide hierarchy
  for the small screen.

## Surface & decoration

- **Purple-blue gradients, gradient text** — the AI startup uniform since 2023.
- **Glassmorphism everywhere, glowing borders, floating blurred blobs** — texture noise
  standing in for identity.
- **Pill-shaped everything / excessive corner radius** — friendliness inflation; radii
  should be one consistent, deliberate family.
- **Dark mode to look technical** — dark is a context decision (long sessions, media,
  data), not a personality.
- **Random animation on every element** — motion without hierarchy. One choreographed
  entrance beats twenty fades.
- **Meaningless abstract 3D shapes / browser-frame mockups with empty screenshots** —
  filler imagery. *Instead:* show the actual product, real content, or crafted diagrams.

## Type & color

- **Tiny low-contrast grey text** (#999 on white at 13px) — the single most common failure.
  Check every grey against 4.5:1.
- **Default font stack with no typographic intent** — Inter-by-default reads as no
  decision. Inter is fine when *chosen*; it must be a choice among alternatives.
- **Headline sizes with body-text line-height** (or vice versa).
- **Five accent colors doing one job** — accent inflation. One accent, worked hard.

## Content

- **Lorem ipsum, placeholder anything** — instantly breaks belief. Write real, specific
  copy; specificity is credibility.
- **Fake metrics ("10,000+ happy users"), fake testimonials, fake logos** — trust theater
  that reads as fraud. *Instead:* say what the product actually does, concretely.
- **Stock phrases**: "Revolutionize your workflow", "Supercharge your productivity",
  "AI-powered insights", "Seamlessly integrate". *Instead:* say the specific thing.
- **Icons as decoration** — a lightning bolt next to "Fast". Icons must disambiguate or
  navigate, not illustrate adjectives.

## Why these happen

Generators regress to the mean of their training data; the mean of web design is mediocre.
The fix is upstream: a design brief, one thesis, an archetype, and a signature — decided
BEFORE code. Slop appears when styling starts before thinking ends.
