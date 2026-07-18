# Motion & interaction — the techniques behind the sites people share

The mockups that make people say "holy shit" almost always MOVE: they respond to scroll,
to the cursor, or they live on their own. This file is the technique library. Everything
here works in one self-contained HTML file — vanilla JS + CSS, no libraries, cheap to
generate and fast to run.

**The floor: every piece ships at least one *earned* motion signature** — a moment of
movement that explains the product or expresses its character. Decoration-motion on
everything is still banned (see anti-patterns). One unforgettable move beats twenty fades.

## 1. Scroll-driven storytelling (the "it assembles as I scroll" effect)

The viral pattern: a machine/product/diagram whose parts move, assemble, or explode as
the user scrolls. It is NOT 3D — it's scroll progress mapped to transforms.

Recipe (pure vanilla):
- A tall scroll region (`height: 300–500vh`) containing a `position: sticky; top: 0;
  height: 100vh` stage.
- Compute progress: `p = -rect.top / (rect.height - innerHeight)` clamped 0–1, inside a
  `requestAnimationFrame` loop driven by a scroll listener (`{passive: true}`).
- Draw the object as layered SVG groups (parts). Each part gets keyframed start/end
  transforms; interpolate with an ease: `v = start + (end - start) * ease(pLocal)`.
- Stage the timeline: split 0–1 into phases (approach → explode → label → reassemble).
  Per-part `pLocal = clamp((p - t0) / (t1 - t0), 0, 1)`.
- Pair each phase with a caption that fades/slides in (opacity + translateY from the
  same progress value) — scrollytelling.
- Ease functions to keep on hand: `easeOutCubic p => 1-(1-p)**3`, smoothstep
  `p*p*(3-2*p)`.
- Also useful: `animation-timeline: scroll()`/`view()` (CSS scroll-driven animations)
  for simple reveals — zero JS; use where supported, JS fallback for the hero moves.

Judgment: scrub must be *bidirectional* (scrolling up reverses it), never auto-play on a
timer disguised as scroll. Parts need mechanical logic — bolts along their axis, lids
hinging, layers separating vertically — not random drift.

## 2. Cursor-reactive surfaces (the "it follows me" effect)

- **Parallax layers**: track pointer as `nx, ny ∈ [-1, 1]` from viewport center; move
  layers by `nx * depth` with different depths (2–30px). Apply with
  `transform: translate3d()`, eased via lerp in a rAF loop
  (`x += (target - x) * 0.08`) — never snap raw mousemove to transform.
- **Magnetic elements**: within a proximity radius, pull the element toward the cursor
  (`translate(dx*0.3, dy*0.3)` of the offset), spring back on leave. For buttons and key
  headlines only — two or three magnets per page max.
- **Proximity typography**: with a variable font (Fraunces, Anybody…), map cursor
  distance per-letter to `font-variation-settings: 'wght'` — letters swell near the
  cursor. Wrap each letter in a span, compute distance in rAF, cap the work (< 80 letters).
- **Custom cursor**: a small dot + a lagged ring (lerp at different rates); ring scales
  over interactive targets. Keep the native cursor visible too unless everything
  interactive responds. Desktop-only (`@media (pointer: fine)`).
- **Spotlight/reveal**: radial-gradient mask centered on the cursor revealing texture,
  a second image layer, or hidden annotations.

Judgment: cursor effects must degrade to nothing on touch — the page must be complete
without them. Effects respond within one frame (lerped), never lag by 300ms.

## 3. Ambient / self-animating (the "it's alive" effect)

- **Canvas particle fields**: drifting dust, snow, fireflies, wind streaks — 60–200
  particles, one canvas, rAF; parameterize by the piece's palette. Pause via
  `IntersectionObserver` when offscreen and on `visibilitychange`.
- **Slow state cycles**: a sky gradient that moves through the day, a lighthouse sweep,
  a breathing glow on a live indicator — CSS keyframes with 8–60s durations.
- **Live-feeling data**: numbers that tick, a feed that appends every few seconds, a
  chart that draws itself — `setInterval` 2–6s, subtle, believable increments.
- **Marquees**: infinite belts (duplicate content, `translateX(-50%)` loop) for tickers/
  logos/menus. Pause on hover.
- **Typewriter/shuffle text**: rotating words in a headline slot — cheap, use once.

Judgment: ambient motion is atmosphere, not spectacle — it must be ignorable while
reading. One system per piece.

## 4. Entrance choreography

`IntersectionObserver` adds a `.in` class; CSS transitions `opacity` +
`translateY(16–32px)` with 40–80ms sibling staggers (`transition-delay: calc(var(--i) *
60ms)`). Headlines can split into words/lines that rise with tighter staggers. Every
element observed once, unobserved after. Never re-trigger on every scroll pass.

## 5. Micro-interactions (the last inch)

Button press scale (.97), input focus glow in the accent, add-to-cart flying dot, toggle
thumps with a small overshoot (`cubic-bezier(.2, .9, .3, 1.3)`), number counters easing
up when scrolled into view, hover states that reveal one more piece of information
(not just a color change).

## 6. Performance & accessibility rules (non-negotiable)

- Animate only `transform`, `opacity`, `filter`, `clip-path`. Never top/left/width/margin.
- One rAF loop per page, shared by all effects; listeners `{passive: true}`.
- `will-change` only on the few elements that continuously move.
- Full `prefers-reduced-motion` path: scroll scenes become static states with visible
  captions, particles stop, marquees pause, entrances become instant. The reduced page
  must still make complete sense.
- Keyboard equivalence: anything revealed by hover/cursor is reachable by focus.
- Target 60fps on a mid laptop: if a technique needs more than ~200 moving nodes,
  use canvas.

## 7. Choosing the signature (taste)

Match the technique to the product's story:
- Physical product / hardware / food → scroll assembly or exploded view (§1)
- Portfolio / fashion / type / photography → cursor play (§2)
- Places, weather, observatories, night things → ambient life (§3)
- Data tools → self-drawing charts + live ticks (§3)
- Everything else → perfect entrances and micro-interactions (§4–5)

One primary technique per piece, executed completely, plus micro-interactions
everywhere. Two primaries only when the second is quiet.
