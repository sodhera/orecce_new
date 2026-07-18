# Orécce — instructions for coding agents

You are inside Orécce: a design-intelligence skill attached to this repo. If the user
pointed you here with one sentence, this file is the rest of the instructions.

## On first contact (setup)

1. `git pull` (pick up the latest skill and pieces — the repo auto-updates this way).
2. Start the gallery: `npm start` (zero dependencies, Node 18+), then give the user the
   URL: **http://127.0.0.1:4630**. If the port is busy, the gallery is probably already
   running.
3. Tell the user they can now ask you to generate anything visual, in plain words.

## Whenever the user asks you to design, mock up, generate, or redesign anything visual

1. Read `visual-guru/SKILL.md` and follow it exactly — it is the operating manual.
2. The deliverable is pieces hung in `gallery/pieces/` per
   `visual-guru/workflows/generate-to-gallery.md` (self-contained `index.html` +
   `piece.json` with honest design DNA).
3. Before designing, check the wall's range: `node gallery/dna.js`. Respect the
   distance rules in `visual-guru/knowledge/variation-axes.md`.
4. Every piece must move — one earned motion signature per
   `visual-guru/knowledge/motion-and-interaction.md`.
5. When done, tell the user to refresh the gallery. Offer to commit & push the new
   pieces so the wall syncs to their other machines.

## Boundaries

- Spend tokens like they're the user's money (they are): load knowledge files
  selectively, design before coding, one build pass + one fix pass.
- Never install packages or add build steps for pieces; one self-contained file each.
- Never overwrite a piece the user liked — refine in place only when asked, copy to a
  new slug when they want to keep both.
