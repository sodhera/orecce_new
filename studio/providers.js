'use strict';
// Coding-agent provider detection and spawning. Codex CLI preferred, Claude Code fallback.
// All execution is server-side; the browser never touches agent credentials.

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CANDIDATES = [
  { kind: 'codex', bin: process.env.ORECCE_CODEX_BIN },
  // The ChatGPT desktop app bundles a current Codex CLI on macOS.
  { kind: 'codex', bin: '/Applications/ChatGPT.app/Contents/Resources/codex' },
  { kind: 'codex', bin: 'codex' },
  { kind: 'claude', bin: process.env.ORECCE_CLAUDE_BIN },
  { kind: 'claude', bin: 'claude' },
];

function probe(bin) {
  try {
    const r = spawnSync(bin, ['--version'], { timeout: 8000, encoding: 'utf8' });
    if (r.status === 0 && r.stdout) return r.stdout.trim().split('\n')[0];
  } catch (_) { /* not present */ }
  return null;
}

function parseVersion(v) {
  const m = /(\d+)\.(\d+)\.(\d+)/.exec(v || '');
  return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
}

function detectProvider() {
  const found = [];
  for (const c of CANDIDATES) {
    if (!c.bin) continue;
    const version = probe(c.bin);
    if (version) found.push({ ...c, version });
  }
  // Prefer codex (newest version wins among codex builds), then claude.
  const codex = found.filter(f => f.kind === 'codex')
    .sort((a, b) => {
      const [a1, a2, a3] = parseVersion(a.version); const [b1, b2, b3] = parseVersion(b.version);
      return (b1 - a1) || (b2 - a2) || (b3 - a3);
    })[0];
  const claude = found.find(f => f.kind === 'claude');
  return codex || claude || null;
}

// Spawn one agent run in `cwd`. Calls onActivity(line) as the agent works.
// Resolves { ok, lastMessage, code } when the process exits.
function runAgent(provider, { cwd, prompt, timeoutMs = 12 * 60 * 1000, onActivity }) {
  return new Promise((resolve) => {
    fs.mkdirSync(cwd, { recursive: true });
    const lastMsgPath = path.join(cwd, '.agent-last-message.txt');
    let args, opts = { cwd, env: { ...process.env } };

    if (provider.kind === 'codex') {
      args = [
        'exec',
        '--skip-git-repo-check',
        '--sandbox', 'workspace-write',
        '-C', cwd,
        '--color', 'never',
        '--output-last-message', lastMsgPath,
        '-', // read the prompt from stdin — prompts can start with dashes
      ];
    } else {
      args = ['-p', '--permission-mode', 'acceptEdits'];
    }

    const child = spawn(provider.bin, args, opts);
    child.stdin.write(prompt);
    child.stdin.end();
    let out = '', err = '';
    const timer = setTimeout(() => { try { child.kill('SIGKILL'); } catch (_) {} }, timeoutMs);

    child.stdout.on('data', (d) => {
      const text = d.toString();
      out += text;
      if (onActivity) {
        for (const line of text.split('\n')) {
          const t = line.trim();
          if (t) onActivity(t);
        }
      }
    });
    child.stderr.on('data', (d) => { err += d.toString(); });
    child.on('error', (e) => { clearTimeout(timer); resolve({ ok: false, code: -1, error: String(e), stderr: err }); });
    child.on('close', (code) => {
      clearTimeout(timer);
      let lastMessage = '';
      try { lastMessage = fs.readFileSync(lastMsgPath, 'utf8'); fs.unlinkSync(lastMsgPath); } catch (_) {}
      if (!lastMessage && provider.kind === 'claude') lastMessage = out;
      resolve({ ok: code === 0, code, lastMessage, stderr: err });
    });

    runAgent._children.add(child);
    child.on('close', () => runAgent._children.delete(child));
  });
}
runAgent._children = new Set();

function killAll() {
  for (const c of runAgent._children) { try { c.kill('SIGKILL'); } catch (_) {} }
}

module.exports = { detectProvider, runAgent, killAll };
