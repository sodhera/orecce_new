# Orécce — the visual guru

**A design-intelligence skill for Codex and Claude Code, attached to this repo.**

Coding agents are technically capable but visually naive. Orécce is their design brain:
it preserves what you *meant* and aggressively upgrades how it *looks*. When you're
specific, it respects. When you're vague, it infers. When you're mediocre, it elevates —
and it refuses to produce the generic purple-gradient answer.

Everything is the skill + this repo. The only web page is **the wall**: a bright,
minimal gallery of framed pieces. Ask your agent to generate something; it hangs two or
three design directions on the wall; you click a frame and walk through them with your
arrow keys.

---

## ⚡ The one-paste prompt

Paste this into **Codex** or **Claude Code**. That's the whole installation.

```
Clone https://github.com/sodhera/orecce_new (or `git pull` inside it if it already
exists locally). From now on, whenever I ask you to design, mock up, or build anything
visual, first read visual-guru/SKILL.md in that repo and follow it exactly. When I ask
you to generate something, hang the pieces in the repo's gallery as SKILL.md describes,
start the gallery with `npm start` in the repo (Node 18+, zero dependencies), and give
me the localhost URL.
```

Then just talk: *"generate a booking site for a family-run trekking lodge in Manang —
warm, credible, not a tourism cliché."* Minutes later there are three framed directions
on the wall.

Because the prompt starts with `git pull`, every session picks up the latest skill and
every piece anyone pushed — auto-updating by design.

## The wall

```bash
npm start        # → http://127.0.0.1:4630
```

- Click a frame to view a piece full-size; **← →** to walk the wall; **Esc** to step back.
- Desktop / phone width toggle in the viewer; every piece opens in its own tab too.
- The wall ships with six pieces: three hand-directed benchmarks (a premium Himalayan
  tea house, a dense Nepali legal-research bench, a playful song-guessing game — one
  skill, three different kinds of beauty) and three agent-generated directions for a
  Manang trekking lodge, exactly as Codex hung them.

## What's in the repo

```
visual-guru/            The skill — the product itself
  SKILL.md              Operating instructions the agent follows
  knowledge/            Foundations · intent translation · product archetypes ·
                        anti-patterns · evaluation rubric
  workflows/            Generate-to-gallery · create-from-scratch ·
                        redesign-existing · refine
gallery/                The wall (index.html + a 90-line static server)
  pieces/<slug>/        One folder per piece: index.html + piece.json
docs/                   Environment notes
```

There is no build step, no dependency, no backend logic beyond serving files. The agent
does the generating; the repo does the remembering; GitHub does the syncing. Pieces are
ordinary committed files — push them and the wall travels to every machine.

## Using the skill on existing products

Point your agent at any codebase:

> Read `visual-guru/SKILL.md`, then follow `visual-guru/workflows/redesign-existing.md`
> against ~/code/my-app and hang the redesign directions in the gallery.
