'use strict';
// Orécce gallery — a tiny static server for the viewing wall. Zero dependencies.
// The gallery is the only web-like thing in Orécce; everything else is the skill + repo.

const http = require('http');
const fs = require('fs');
const path = require('path');

const GALLERY = __dirname;
const PIECES = path.join(GALLERY, 'pieces');
const PORT = Number(process.env.PORT || 4630);
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

function pieces() {
  let out = [];
  let dirs = [];
  try { dirs = fs.readdirSync(PIECES); } catch (_) { return out; }
  for (const slug of dirs) {
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(PIECES, slug, 'piece.json'), 'utf8'));
      if (fs.existsSync(path.join(PIECES, slug, 'index.html'))) out.push({ slug, ...meta });
    } catch (_) { /* not a piece */ }
  }
  out.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  return out;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/pieces') {
    const body = JSON.stringify(pieces());
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(body);
  }

  let file = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  if (file.endsWith('/')) file += 'index.html';
  const full = path.normalize(path.join(GALLERY, file));
  if (!full.startsWith(GALLERY)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  ORÉCCE · gallery');
  console.log(`  → http://${HOST}:${PORT}`);
  console.log(`  ${pieces().length} pieces on the wall`);
  console.log('');
});
