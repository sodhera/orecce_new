# Evaluation rubric — judging the rendered result

Score the RENDERED result (look at it — never score from imagination) out of 100. A
deliverable should reach **≥ 85**. Every criticism must point at something visible.

| # | Dimension | Pts | Core questions |
|---|-----------|-----|----------------|
| 1 | Contextual appropriateness | 15 | Does the visual language fit product, audience, task? Would a different domain plausibly ship this design unchanged? (If yes — too generic.) |
| 2 | Hierarchy & clarity | 14 | Is the most important thing unmistakable? Primary action obvious? Five-second comprehension? |
| 3 | Composition & layout | 12 | Balanced? Grid, alignment, rhythm deliberate? First viewport = one composition? Sections connected? |
| 4 | Typography | 12 | Voice matches intent? Coherent scale? Measure/leading readable? Fonts purposeful, not default? |
| 5 | Color & contrast | 10 | Coherent system with roles? Saturation controlled? Contrast floors met? Cliché-free? |
| 6 | Content & narrative | 10 | Copy specific and believable? Zero filler/lorem/fake proof? Labels and CTAs clear? |
| 7 | Interaction & motion | 8 | States complete (hover/focus/loading/empty/error where relevant)? Motion purposeful, fast, reducible? |
| 8 | Coherence & craft | 8 | One system (radii, shadows, borders, icons, spacing)? Finished, not assembled? |
| 9 | Responsive quality | 6 | Mobile intentionally designed? No horizontal overflow at 390px? Hierarchy survives? |
| 10 | Accessibility | 5 | Semantics, keyboard path, visible focus, labels, contrast, target sizes. |

## Hard rejection gates (fail any → revise regardless of score)

- Build/runtime failure, console errors, broken primary navigation
- Illegible text or severe contrast failure
- Horizontal overflow at 390px; clipped or overlapping content
- Primary action not identifiable; unfinished sections; placeholder text
- Unusable keyboard navigation; missing focus states; inaccessible forms
- Generic-template appearance with no domain logic
- Two generated products with obviously identical visual systems
- Copied branding/distinctive composition from a reference

## Iteration protocol

1. Render. 2. Score with evidence. 3. Name the three highest-impact changes.
4. Change meaningful things (composition, hierarchy, type, density, content, palette,
   responsive structure) — nudging a shadow 2px is not an iteration. 5. Re-render, compare,
   keep the stronger version. Stop at pass or after three serious rounds.

If the score rises but the rendered result doesn't visibly improve, distrust the score.
