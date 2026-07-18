# Workflow — create from scratch

Input: a product request, often vague ("make me a cool website for my startup").

1. **Brief** (internal, 60 seconds of thinking, not a questionnaire to the user):
   category, primary user, primary task, frequency, density, emotional target, trust level,
   cultural context, device mix, constraints, generic-output risk. If the request is vague,
   invent a coherent, specific concept (real name, real offering, real copy) rather than
   building a generic shell.
2. **Archetype** — pick from `../knowledge/product-archetypes.md`; it sets density, nav,
   type, and motion budgets.
3. **Thesis** — one sentence that drives everything. Write it down.
4. **Signature** — decide the one memorable move before coding.
5. **Build** — real content, complete states, responsive by design, craft floor from
   `SKILL.md` throughout.
6. **Render, judge, fix** — `../knowledge/evaluation-rubric.md`; three highest-impact
   changes; up to three serious rounds.

Output contract when generating a standalone mockup: a single self-contained `index.html`
(inline CSS/JS; system fonts or Google Fonts only; images as inline SVG, CSS, or data URIs)
plus a `direction.json`: `{"name": "...", "thesis": "...", "signature": "..."}`.
