'use strict';
// Orecce studio server — zero dependencies, Node 18+.
// Serves the studio UI, orchestrates parallel agent generations, streams progress via SSE,
// and previews generated mockups. Binds to localhost only.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { detectProvider, runAgent, killAll } = require('./providers');
const { generationPrompt, refinementPrompt, LENSES } = require('./prompt');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const GENERATED_DIR = path.join(ROOT, 'workspace', 'generated');
const SHOWCASE_DIR = path.join(ROOT, 'workspace', 'showcase');
const PORT = Number(process.env.PORT || 4630);
const HOST = '127.0.0.1';
const VARIANTS_PER_RUN = Number(process.env.ORECCE_VARIANTS || 3);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

let provider = null;

// ---------------------------------------------------------------- utilities

function newId() { return 'p_' + crypto.randomBytes(4).toString('hex'); }
function safeId(id) { return typeof id === 'string' && /^[a-z0-9_-]{1,64}$/i.test(id); }
function readJSON(p, fallback) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return fallback; } }
function writeJSON(p, obj) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function sendJSON(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function sendFile(res, filePath, extraHeaders) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', ...extraHeaders });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
  });
}

// ------------------------------------------------------------------ projects

function projectDir(id) { return path.join(GENERATED_DIR, id); }
function projectMetaPath(id) { return path.join(projectDir(id), 'project.json'); }
function iterationDir(id, v, i) { return path.join(projectDir(id), 'v' + v, 'i' + i); }

function listProjects() {
  let dirs = [];
  try { dirs = fs.readdirSync(GENERATED_DIR); } catch (_) {}
  const projects = [];
  for (const d of dirs) {
    const meta = readJSON(path.join(GENERATED_DIR, d, 'project.json'), null);
    if (meta) projects.push(meta);
  }
  projects.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  return projects;
}

function seedShowcase() {
  let entries = [];
  try { entries = fs.readdirSync(SHOWCASE_DIR); } catch (_) { return; }
  for (const slug of entries) {
    const src = path.join(SHOWCASE_DIR, slug);
    if (!fs.statSync(src).isDirectory()) continue;
    if (!fs.existsSync(path.join(src, 'project.json'))) continue;
    const dest = path.join(GENERATED_DIR, slug);
    if (fs.existsSync(dest)) continue;
    fs.cpSync(src, dest, { recursive: true });
  }
}

// ---------------------------------------------------------------------- runs
// In-memory run registry with SSE fan-out and event replay for late subscribers.

const runs = new Map(); // runId -> { events: [], clients: Set<res>, done: bool }

function createRun() {
  const runId = 'r_' + crypto.randomBytes(4).toString('hex');
  runs.set(runId, { events: [], clients: new Set(), done: false });
  return runId;
}

function emit(runId, event) {
  const run = runs.get(runId);
  if (!run) return;
  run.events.push(event);
  if (event.type === 'done') run.done = true;
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of run.clients) { try { res.write(payload); } catch (_) {} }
  if (event.type === 'done') {
    for (const res of run.clients) { try { res.end(); } catch (_) {} }
    run.clients.clear();
    setTimeout(() => runs.delete(runId), 10 * 60 * 1000).unref();
  }
}

// Extract an HTML document from an agent's final message if it failed to write the file.
function extractHtml(text) {
  if (!text) return null;
  const fence = /```html\s*([\s\S]*?)```/i.exec(text);
  if (fence && fence[1].includes('<html')) return fence[1].trim();
  const doc = text.indexOf('<!DOCTYPE');
  const docLower = text.indexOf('<!doctype');
  const start = doc >= 0 ? doc : docLower;
  if (start >= 0) {
    const end = text.lastIndexOf('</html>');
    if (end > start) return text.slice(start, end + 7);
  }
  return null;
}

async function runVariant(runId, meta, v, prompt) {
  const dir = iterationDir(meta.id, v, 1);
  fs.mkdirSync(dir, { recursive: true });
  const variant = meta.variants.find((x) => x.n === v);
  variant.state = 'designing';
  writeJSON(projectMetaPath(meta.id), meta);
  emit(runId, { type: 'variant', n: v, state: 'designing' });

  let lastTick = 0;
  const result = await runAgent(provider, {
    cwd: dir,
    prompt,
    onActivity: (line) => {
      const now = Date.now();
      if (now - lastTick < 1200) return; // throttle
      lastTick = now;
      emit(runId, { type: 'activity', n: v, text: line.slice(0, 160) });
    },
  });

  const htmlPath = path.join(dir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    const html = extractHtml(result.lastMessage);
    if (html) fs.writeFileSync(htmlPath, html);
  }

  if (fs.existsSync(htmlPath)) {
    variant.state = 'complete';
    variant.direction = readJSON(path.join(dir, 'direction.json'), { name: variant.lensLabel });
    variant.iterations = [1];
  } else {
    variant.state = 'failed';
    variant.error = (result.stderr || '').slice(-400) || 'agent produced no index.html';
  }
  writeJSON(projectMetaPath(meta.id), meta);
  emit(runId, { type: 'variant', n: v, state: variant.state, direction: variant.direction || null, error: variant.error || null });
}

async function startGeneration(userPrompt) {
  const id = newId();
  const runId = createRun();
  const meta = {
    id,
    prompt: userPrompt,
    createdAt: new Date().toISOString(),
    provider: `${provider.kind} · ${provider.version}`,
    showcase: false,
    title: userPrompt.length > 64 ? userPrompt.slice(0, 61) + '…' : userPrompt,
    variants: Array.from({ length: VARIANTS_PER_RUN }, (_, i) => ({
      n: i + 1, lens: LENSES[i % LENSES.length].key, lensLabel: LENSES[i % LENSES.length].label,
      state: 'queued', iterations: [],
    })),
  };
  writeJSON(projectMetaPath(id), meta);

  (async () => {
    emit(runId, { type: 'start', projectId: id });
    await Promise.all(meta.variants.map((v, i) =>
      runVariant(runId, meta, v.n, generationPrompt(userPrompt, i, VARIANTS_PER_RUN))));
    emit(runId, { type: 'done', projectId: id });
  })().catch((e) => {
    emit(runId, { type: 'error', message: String(e) });
    emit(runId, { type: 'done', projectId: id });
  });

  return { projectId: id, runId };
}

async function startRefinement(id, v, instruction) {
  const meta = readJSON(projectMetaPath(id), null);
  if (!meta) throw new Error('unknown project');
  const variant = meta.variants.find((x) => x.n === v);
  if (!variant || !variant.iterations.length) throw new Error('unknown variant');

  const prevI = variant.iterations[variant.iterations.length - 1];
  const nextI = prevI + 1;
  const prevDir = iterationDir(id, v, prevI);
  const nextDir = iterationDir(id, v, nextI);
  fs.cpSync(prevDir, nextDir, { recursive: true });

  const runId = createRun();
  variant.state = 'refining';
  writeJSON(projectMetaPath(id), meta);

  (async () => {
    emit(runId, { type: 'start', projectId: id });
    emit(runId, { type: 'variant', n: v, state: 'refining' });
    let lastTick = 0;
    const result = await runAgent(provider, {
      cwd: nextDir,
      prompt: refinementPrompt(meta.prompt, instruction, variant.direction),
      onActivity: (line) => {
        const now = Date.now();
        if (now - lastTick < 1200) return;
        lastTick = now;
        emit(runId, { type: 'activity', n: v, text: line.slice(0, 160) });
      },
    });
    const ok = fs.existsSync(path.join(nextDir, 'index.html'));
    if (ok) {
      variant.iterations.push(nextI);
      variant.direction = readJSON(path.join(nextDir, 'direction.json'), variant.direction);
      variant.state = 'complete';
    } else {
      fs.rmSync(nextDir, { recursive: true, force: true });
      variant.state = 'complete'; // previous iteration still stands
      emit(runId, { type: 'error', message: 'refinement produced no output; kept previous iteration. ' + (result.stderr || '').slice(-200) });
    }
    writeJSON(projectMetaPath(id), meta);
    emit(runId, { type: 'variant', n: v, state: 'complete', direction: variant.direction, iteration: ok ? nextI : prevI });
    emit(runId, { type: 'done', projectId: id });
  })().catch((e) => {
    emit(runId, { type: 'error', message: String(e) });
    emit(runId, { type: 'done', projectId: id });
  });

  return { runId, iteration: nextI };
}

// -------------------------------------------------------------------- server

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname;

  try {
    // --- API
    if (p === '/api/status') {
      return sendJSON(res, 200, {
        provider: provider
          ? { kind: provider.kind, version: provider.version, bin: provider.bin, available: true }
          : { available: false },
        variantsPerRun: VARIANTS_PER_RUN,
        projects: listProjects(),
      });
    }

    if (p === '/api/generate' && req.method === 'POST') {
      if (!provider) return sendJSON(res, 503, { error: 'no coding agent available. Install Codex CLI or Claude Code.' });
      const body = await readBody(req);
      const userPrompt = String(body.prompt || '').trim();
      if (!userPrompt) return sendJSON(res, 400, { error: 'empty prompt' });
      if (userPrompt.length > 4000) return sendJSON(res, 400, { error: 'prompt too long' });
      const out = await startGeneration(userPrompt);
      return sendJSON(res, 200, out);
    }

    if (p === '/api/refine' && req.method === 'POST') {
      if (!provider) return sendJSON(res, 503, { error: 'no coding agent available' });
      const body = await readBody(req);
      const { id, variant, instruction } = body;
      if (!safeId(id) || !instruction) return sendJSON(res, 400, { error: 'bad request' });
      const out = await startRefinement(id, Number(variant) || 1, String(instruction).slice(0, 2000));
      return sendJSON(res, 200, out);
    }

    if (p === '/api/events') {
      const runId = url.searchParams.get('run');
      const run = runs.get(runId);
      if (!run) return sendJSON(res, 404, { error: 'unknown run' });
      res.writeHead(200, {
        'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive',
      });
      for (const ev of run.events) res.write(`data: ${JSON.stringify(ev)}\n\n`);
      if (run.done) { res.end(); return; }
      run.clients.add(res);
      req.on('close', () => run.clients.delete(res));
      return;
    }

    if (p.startsWith('/api/project/')) {
      const id = p.split('/')[3];
      if (!safeId(id)) return sendJSON(res, 400, { error: 'bad id' });
      const meta = readJSON(projectMetaPath(id), null);
      return meta ? sendJSON(res, 200, meta) : sendJSON(res, 404, { error: 'not found' });
    }

    // --- Preview: /preview/<id>/<v>/<i>/[file]
    if (p.startsWith('/preview/')) {
      const parts = p.split('/').filter(Boolean); // ['preview', id, 'v1', 'i1', ...file]
      const [, id, v, i, ...rest] = parts;
      if (!safeId(id) || !/^v\d+$/.test(v || '') || !/^i\d+$/.test(i || '')) {
        res.writeHead(404); return res.end('Not found');
      }
      const base = path.join(projectDir(id), v, i);
      const file = rest.length ? rest.join('/') : 'index.html';
      const full = path.normalize(path.join(base, file));
      if (!full.startsWith(base)) { res.writeHead(403); return res.end('Forbidden'); }
      return sendFile(res, full, { 'Cache-Control': 'no-cache' });
    }

    // --- Static studio UI
    let file = p === '/' ? '/index.html' : p;
    const full = path.normalize(path.join(PUBLIC_DIR, file));
    if (!full.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
    return sendFile(res, full);
  } catch (e) {
    return sendJSON(res, 500, { error: String(e && e.message || e) });
  }
});

process.on('SIGINT', () => { killAll(); process.exit(0); });
process.on('SIGTERM', () => { killAll(); process.exit(0); });

fs.mkdirSync(GENERATED_DIR, { recursive: true });
seedShowcase();
provider = detectProvider();

server.listen(PORT, HOST, () => {
  const providerLabel = provider ? `${provider.kind} (${provider.version})` : 'NONE — install Codex CLI or Claude Code';
  console.log('');
  console.log('  ORECCE · visual guru studio');
  console.log(`  → http://${HOST}:${PORT}`);
  console.log(`  agent: ${providerLabel}`);
  console.log('');
});
