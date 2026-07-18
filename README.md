# Orécce — the visual guru

**A design-intelligence skill for coding agents, plus a localhost studio that turns one
prompt into three polished design directions you can flip through like proofs on a desk.**

Coding agents are technically capable but visually naive. Orécce is their design brain:
it preserves what you *meant* and aggressively upgrades how it *looks*. Ask for anything —
a legal research tool, a tea shop, a party game — and it refuses to produce the generic
purple-gradient answer. When you're specific, it respects. When you're vague, it infers.
When you're mediocre, it elevates.

---

## ⚡ The one-paste prompt

Paste this into **Codex** or **Claude Code** on any machine. That's the whole installation.

```
Clone https://github.com/sodhera/orecce_new (or `git pull` inside it if it already exists
locally), then run `npm start` in the repo and open the printed localhost URL in my
browser. It has no dependencies to install — it only needs Node 18+. If no coding agent
CLI is detected by the studio, tell me what to install. From now on, when I ask you to
design or build anything visual, read visual-guru/SKILL.md in that repo first and follow
it exactly.
```

Then type what you want in the prompt bar and press Enter. Three design directions,
built in parallel by a real local coding agent, appear as they finish. Flip between them
with ← →, switch device widths, and refine any direction with a follow-up note.

Because the prompt starts with `git pull`, every run picks up the latest skill —
auto-updating by design.

## Running the studio directly

```bash
git clone https://github.com/sodhera/orecce_new
cd orecce_new
npm start        # → http://127.0.0.1:4630
```

Zero npm dependencies. Node 18+ only.

**Agent detection** (in order): `ORECCE_CODEX_BIN` env var → Codex CLI bundled with the
ChatGPT desktop app (macOS) → `codex` on PATH → `claude` on PATH. The active agent shows
in the bottom-left badge. Without any agent, the three showcase projects are still fully
browsable.

## What's in the box

```
visual-guru/            The installable design brain (usable standalone)
  SKILL.md              Operating instructions for the agent
  knowledge/            Foundations · intent translation · archetypes ·
                        anti-patterns · evaluation rubric
  workflows/            Create from scratch · redesign existing · refine
studio/                 Zero-dependency localhost studio (server + UI)
workspace/showcase/     Three hand-directed benchmark mockups proving the
                        diversity thesis: a premium tea house, a dense legal
                        research bench, a playful party game — one skill,
                        three different kinds of beauty
```

## Using the skill without the studio

In any agent session:

> Read `visual-guru/SKILL.md` and follow it. Then: *[your design request]*

It also works as a redesign pass: point the agent at an existing app and invoke
`visual-guru/workflows/redesign-existing.md`.

## How generation works

1. Your prompt + the full Visual Guru skill go to the local agent (server-side; the
   browser never sees credentials).
2. Three variants build **in parallel**, each under a different direction lens:
   *confident default*, *typography-led*, *unexpected angle*.
3. Each variant lands as a self-contained `index.html` + a `direction.json` carrying its
   thesis. The first one to finish opens automatically.
4. Refinements create new iterations (`i1 → i2 → …`) you can step between — nothing is
   overwritten.

Generated projects live in `workspace/generated/<id>/` (gitignored), one folder per
project, independently openable outside the studio.
