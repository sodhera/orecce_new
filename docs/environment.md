# Environment notes (dev machine, 2026-07-18)

- macOS (Darwin 25.3.0), Node v20.19.4, npm 10.8.2 — studio targets Node ≥ 18, zero deps.
- Codex CLI on PATH is **0.7.0** (stale, via nvm) and cannot parse the current
  `~/.codex/config.toml` (url-based MCP servers). Do not use it.
- The ChatGPT desktop app bundles a current Codex CLI at
  `/Applications/ChatGPT.app/Contents/Resources/codex` (0.145.0-alpha at time of writing);
  verified working with `codex exec --output-last-message` against the user's ChatGPT
  auth. The studio's provider detection prefers this binary (newest codex version wins).
- `claude` CLI not on PATH on this machine; the Claude provider path is implemented and
  used automatically when present.
- `gh` authenticated as `sodhera`.

Provider override envs: `ORECCE_CODEX_BIN`, `ORECCE_CLAUDE_BIN`, `ORECCE_VARIANTS`,
`PORT`.
