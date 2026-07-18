# Workflow — refine an existing generation

Input: an existing generated mockup plus a follow-up instruction
("make it warmer", "the header feels heavy", "add a pricing section").

1. **Re-read the thesis** (`direction.json`). Refinement happens INSIDE the established
   direction unless the user explicitly asks to change direction.
2. **Interpret the note like a design lead, not a pixel-pusher.** "Warmer" may mean
   palette temperature, imagery, copy tone, or spacing softness — choose the levers that
   actually produce the feeling. If the note names a symptom ("header feels heavy"),
   fix the cause (scale, weight, spacing, contrast), not just the named element.
3. **Ripple the change.** A palette shift touches every state color; a type change touches
   the whole scale. Partial application reads as patchwork — coherence is the deliverable.
4. **Preserve what works.** Refinement is surgery, not regeneration. Keep the signature
   and structure unless they are the problem.
5. **Re-render and judge** against the rubric before presenting. Update `direction.json`
   if the thesis meaningfully evolved.
