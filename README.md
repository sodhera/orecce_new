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

## ⚡ Installation is one sentence

Paste this into **Codex** or **Claude Code**. Done.

```
Clone https://github.com/sodhera/orecce_new and follow its AGENTS.md.
```

The repo's `AGENTS.md`/`CLAUDE.md` (which both agents read automatically) handles the
rest: pull latest, start the gallery, and from then on any "generate/design/mock up X"
request goes through the Visual Guru skill and lands on the wall. Every session begins
with `git pull` — auto-updating by design.

Then just talk: *"generate a booking site for a family-run trekking lodge in Manang —
warm, credible, not a tourism cliché."* Minutes later there are three framed directions
on the wall, each one moving.

## The wall

```bash
npm start        # → http://127.0.0.1:4630
```

- Click a frame to view a piece full-size; **← →** to walk the wall; **Esc** to step back.
- Desktop / phone width toggle in the viewer; every piece opens in its own tab too.
- The wall ships with **twelve pieces**, and every one moves: hand-directed flagships
  demonstrating the three viral motion patterns (a grinder that assembles as you
  scroll, a type foundry whose letters swell around your cursor, a weather station
  that lives on its own) alongside benchmarks and Codex-generated pieces — a tea
  house, a legal bench, a party game, a jazz club, a kids' reading app, an
  architecture portfolio, a produce dashboard, a sci-fi imprint, a trekking lodge.
- Range is enforced, not hoped for: every piece declares its **design DNA** (eight
  axes — palette, type voice, layout, density, motion, shape, texture, archetype) and
  `node gallery/dna.js` measures the wall: new pieces must differ from everything hung
  on ≥ 4 axes, and no single vibe may dominate.

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
