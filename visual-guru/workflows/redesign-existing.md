# Workflow — redesign an existing product

Input: a codebase or URL plus "make it better".

1. **Inspect** — read the code/pages; identify framework, existing design tokens, and
   which parts are deliberate brand vs. accident.
2. **Run & capture** — render the current product; take desktop + mobile baseline
   screenshots. Judge the baseline with `../knowledge/evaluation-rubric.md` so improvement
   is measurable.
3. **Understand** — who uses this, for what, how often. The redesign serves the workflow,
   not the screenshot.
4. **Diagnose** — list visual/interaction weaknesses ranked by impact. Distinguish
   "wrong direction" from "weak execution of a right direction".
5. **Preserve** — working functionality, deliberate brand constraints, user muscle memory
   for daily-use tools. Never rewrite a functioning product just to switch frameworks.
6. **Redesign** — on a safe branch/copy. Apply the same brief → thesis → signature
   discipline as a new build.
7. **Compare** — before/after screenshots side by side; test for regressions; present with
   the reasoning, not just the pixels.
