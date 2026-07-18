# Workflow — generate pieces onto the wall

This is the default workflow when the user asks Orécce to *generate*, *mock up*, or
*show* something. The deliverable is one or more **pieces** hung in the repo's gallery,
which the user browses at the viewing page.

## The piece contract

Each piece is a folder inside `gallery/pieces/`:

```
gallery/pieces/<slug>/
  index.html    one complete, self-contained product mockup
  piece.json    {"title": "...", "prompt": "<the user's request>",
                 "direction": {"name": "...", "thesis": "...", "signature": "..."},
                 "created": "<ISO timestamp>", "generatedBy": "<agent · lens>"}
```

`index.html` rules (the gallery depends on them):

- All CSS and JS inline. Google Fonts `<link>` tags allowed and encouraged when they
  serve the design; no other external scripts, stylesheets, or images.
- Imagery crafted inline: SVG, CSS gradients/textures, data URIs. No external image URLs.
- Fully responsive 390px → 1440px; no horizontal overflow; visible focus states;
  `prefers-reduced-motion` respected.
- Real, specific content — invented but believable names, copy, data. Never lorem ipsum,
  never fake social proof presented as real.
- Slugs: lowercase-kebab, descriptive, unique (`himal-java-cafe-editorial`, not `site1`).

## Procedure

1. Follow `create-from-scratch.md` (brief → archetype → thesis → signature) — once per
   direction.
2. Produce **three directions by default** (fewer only if the user asks): the
   *confident default*, a *typography-led* take, and an *unexpected angle* that still
   fits. Each is its own piece with its own slug (`<concept>-a/b/c` or named suffixes).
   The directions must not be reskins of each other.
3. Hang them: write the folders, then tell the user to open the gallery
   (`npm start` in the repo → http://127.0.0.1:4630, or just refresh if it's running).
4. Judge each rendered piece against `../knowledge/evaluation-rubric.md` before calling
   it done; fix hard failures immediately.

## Refinements

"Refine" instructions (`warmer`, `denser`, `add pricing`) follow `refine.md` and edit the
piece's `index.html` in place — update `piece.json` if the thesis evolved. If the user
wants to keep the old version too, copy the piece to a new slug first
(`<slug>-2`, and say so).

## Syncing

Pieces are ordinary files in the repo. Commit and push them so the wall travels with the
repo; `git pull` brings down pieces generated on other machines.
