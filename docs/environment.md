# Environment notes (dev machine, 2026-07-18)

- macOS (Darwin 25.3.0), Node v20.19.4 — gallery server targets Node ≥ 18, zero deps.
- Codex CLI on PATH is **0.7.0** (stale, via nvm) and cannot parse the current
  `~/.codex/config.toml`. The ChatGPT desktop app bundles a current Codex CLI at
  `/Applications/ChatGPT.app/Contents/Resources/codex` (0.145.0-alpha at time of
  writing) — verified working with `codex exec` reading the prompt from stdin
  (prompts that begin with dashes are otherwise eaten by the arg parser).
- The three `manang-lodge-*` pieces on the wall were generated end-to-end by that
  Codex build under the Visual Guru skill (~3 minutes per direction, run in parallel).
- `gh` authenticated as `sodhera`.
