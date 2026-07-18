'use strict';
/* Orécce studio client. Vanilla JS, no build step. */

const $ = (sel) => document.querySelector(sel);

const state = {
  provider: null,
  projects: [],
  current: null,      // project meta being viewed
  variant: 1,
  iteration: null,    // null = latest
  run: null,          // active generation { runId, projectId, cards: Map }
};

// ————————————————————————————————————————————— bootstrap

async function refreshStatus() {
  const r = await fetch('/api/status');
  const data = await r.json();
  state.provider = data.provider;
  state.projects = data.projects;
  renderProvider();
  renderHistory();
}

function renderProvider() {
  const badge = $('#provider-badge');
  const label = $('#provider-label');
  if (state.provider && state.provider.available) {
    badge.classList.add('on'); badge.classList.remove('off');
    label.textContent = `${state.provider.kind} · ${state.provider.version.replace(/^[a-z-]*\s*/i, '')}`;
    $('#no-provider-note').classList.add('hidden');
  } else {
    badge.classList.add('off'); badge.classList.remove('on');
    label.textContent = 'no agent detected';
    $('#no-provider-note').classList.remove('hidden');
    $('#generate-btn').disabled = true;
  }
}

function renderHistory() {
  const nav = $('#history');
  nav.innerHTML = '';
  const showcase = state.projects.filter((p) => p.showcase);
  const mine = state.projects.filter((p) => !p.showcase);

  const section = (title, items) => {
    if (!items.length) return;
    const h = document.createElement('div');
    h.className = 'hist-group';
    h.textContent = title;
    nav.appendChild(h);
    for (const p of items) {
      const btn = document.createElement('button');
      btn.className = 'hist-item' + (state.current && state.current.id === p.id ? ' active' : '');
      const ready = p.variants.filter((v) => v.state === 'complete').length;
      btn.innerHTML = `<span class="t"></span><span class="m">${ready}/${p.variants.length} directions</span>`;
      btn.querySelector('.t').textContent = p.title || p.prompt;
      btn.addEventListener('click', () => openProject(p.id));
      nav.appendChild(btn);
    }
  };
  section('Generations', mine);
  section('Showcase', showcase);
}

// ————————————————————————————————————————————— views

function show(view) {
  for (const v of ['compose', 'generating', 'project']) {
    $('#view-' + v).classList.toggle('hidden', v !== view);
  }
}

function toast(msg, ms = 3200) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._h);
  toast._h = setTimeout(() => t.classList.remove('show'), ms);
}

// ————————————————————————————————————————————— generation flow

async function generate(promptText) {
  const r = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: promptText }),
  });
  const data = await r.json();
  if (!r.ok) { toast(data.error || 'generation failed to start'); return; }

  state.run = { runId: data.runId, projectId: data.projectId, prompt: promptText, opened: false };
  $('#gen-prompt-echo').textContent = '“' + promptText + '”';
  buildGenGrid();
  show('generating');
  listen(data.runId, onGenEvent);
  refreshStatus();
}

function buildGenGrid() {
  const grid = $('#gen-grid');
  grid.innerHTML = '';
  const lenses = ['Confident default', 'Typography-led', 'Unexpected angle'];
  for (let n = 1; n <= 3; n++) {
    const card = document.createElement('div');
    card.className = 'gen-card working';
    card.dataset.n = n;
    card.innerHTML = `
      <span class="num">0${n}</span>
      <span class="lens">${lenses[n - 1] || 'Direction ' + n}</span>
      <span class="state">queued</span>
      <span class="tick"></span>`;
    grid.appendChild(card);
  }
}

function onGenEvent(ev) {
  const card = document.querySelector(`.gen-card[data-n="${ev.n}"]`);
  if (ev.type === 'variant' && card) {
    card.querySelector('.state').textContent = ev.state;
    if (ev.state === 'complete') {
      card.classList.remove('working');
      card.classList.add('done');
      if (ev.direction && ev.direction.name) card.querySelector('.lens').textContent = ev.direction.name;
      card.querySelector('.state').textContent = 'ready';
      if (!card.querySelector('.view-now')) {
        const b = document.createElement('button');
        b.className = 'view-now';
        b.textContent = 'View →';
        b.addEventListener('click', () => openProject(state.run.projectId, ev.n));
        card.appendChild(b);
      }
      // Auto-open the first finished direction so the user sees pixels ASAP.
      if (!state.run.opened) {
        state.run.opened = true;
        openProject(state.run.projectId, ev.n, { keepGeneratingView: false });
      }
    } else if (ev.state === 'failed') {
      card.classList.remove('working');
      card.classList.add('failed');
      card.querySelector('.state').textContent = 'failed';
    }
  }
  if (ev.type === 'activity' && card) {
    card.querySelector('.tick').textContent = ev.text;
  }
  if (ev.type === 'done') {
    refreshStatus().then(() => {
      if (state.current && state.current.id === state.run?.projectId) openProject(state.current.id, state.variant);
    });
    toast('Generation finished');
    state.run = null;
  }
  if (ev.type === 'error') toast(ev.message, 5000);
}

function listen(runId, handler) {
  const es = new EventSource('/api/events?run=' + encodeURIComponent(runId));
  es.onmessage = (m) => {
    try { handler(JSON.parse(m.data)); } catch (_) {}
  };
  es.onerror = () => es.close();
}

// ————————————————————————————————————————————— project viewer

async function openProject(id, variant, opts = {}) {
  const r = await fetch('/api/project/' + id);
  if (!r.ok) { toast('project not found'); return; }
  const meta = await r.json();
  state.current = meta;

  const ready = meta.variants.filter((v) => v.state === 'complete');
  if (!ready.length) {
    // nothing renderable yet — if a run is live for it, show the run view
    show('generating');
    return;
  }
  state.variant = variant && meta.variants.find((v) => v.n === variant && v.state === 'complete')
    ? variant : ready[0].n;
  state.iteration = null;

  renderProjectView();
  renderHistory();
  show('project');
}

function currentVariant() {
  return state.current.variants.find((v) => v.n === state.variant);
}

function currentIteration() {
  const v = currentVariant();
  if (!v || !v.iterations.length) return 1;
  return state.iteration || v.iterations[v.iterations.length - 1];
}

function renderProjectView() {
  const meta = state.current;

  // variant tabs
  const tabs = $('#variant-tabs');
  tabs.innerHTML = '';
  for (const v of meta.variants) {
    const b = document.createElement('button');
    b.className = 'vtab'
      + (v.n === state.variant ? ' active' : '')
      + (v.state !== 'complete' ? ' unavailable' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', v.n === state.variant ? 'true' : 'false');
    const name = (v.direction && v.direction.name) || v.lensLabel || ('Direction ' + v.n);
    b.innerHTML = `<span class="n">0${v.n}</span><span class="name"></span>`;
    b.querySelector('.name').textContent = v.state === 'complete' ? name : (v.state === 'failed' ? name + ' — failed' : name + '…');
    b.addEventListener('click', () => { state.variant = v.n; state.iteration = null; renderProjectView(); });
    tabs.appendChild(b);
  }

  // thesis line
  const v = currentVariant();
  const th = $('#thesis-line');
  if (v && v.direction && (v.direction.thesis || v.direction.signature)) {
    th.innerHTML = '<strong>Thesis</strong>';
    th.appendChild(document.createTextNode(v.direction.thesis || v.direction.signature));
    th.classList.remove('hidden');
  } else {
    th.classList.add('hidden');
  }

  // iteration stepper
  const iters = (v && v.iterations) || [1];
  const cur = currentIteration();
  $('#iter-label').textContent = 'i' + cur + (iters.length > 1 ? ' / ' + iters.length : '');
  $('#iter-prev').disabled = iters.indexOf(cur) <= 0;
  $('#iter-next').disabled = iters.indexOf(cur) >= iters.length - 1;
  $('#iter-stepper').style.visibility = iters.length > 1 ? 'visible' : 'hidden';

  // preview
  const url = `/preview/${meta.id}/v${state.variant}/i${cur}/`;
  const frame = $('#preview-frame');
  if (frame.getAttribute('src') !== url) frame.setAttribute('src', url);
  $('#open-tab').href = url;
}

// iteration stepping
$('#iter-prev').addEventListener('click', () => stepIteration(-1));
$('#iter-next').addEventListener('click', () => stepIteration(1));
function stepIteration(d) {
  const v = currentVariant();
  const iters = v.iterations;
  const idx = iters.indexOf(currentIteration()) + d;
  if (idx < 0 || idx >= iters.length) return;
  state.iteration = iters[idx];
  renderProjectView();
}

// device toggle
document.querySelectorAll('.device-toggle button').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.device-toggle button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const holder = $('#preview-frame-holder');
    holder.className = '';
    if (b.dataset.w) holder.classList.add('w-' + b.dataset.w);
  });
});

// ————————————————————————————————————————————— refine

$('#refine-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = $('#refine-input');
  const instruction = input.value.trim();
  if (!instruction || !state.current) return;
  const form = $('#refine-form');
  form.classList.add('busy');
  $('#refine-btn').disabled = true;

  const r = await fetch('/api/refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: state.current.id, variant: state.variant, instruction }),
  });
  const data = await r.json();
  if (!r.ok) {
    toast(data.error || 'refine failed');
    form.classList.remove('busy');
    $('#refine-btn').disabled = false;
    return;
  }
  toast('Refining — the new iteration will appear when ready');
  input.value = '';

  listen(data.runId, (ev) => {
    if (ev.type === 'done') {
      form.classList.remove('busy');
      $('#refine-btn').disabled = false;
      openProject(state.current.id, state.variant);
      toast('Refinement ready');
    }
    if (ev.type === 'error') toast(ev.message, 5000);
    if (ev.type === 'activity') toast('agent: ' + ev.text, 1500);
  });
});

// ————————————————————————————————————————————— compose

$('#compose-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $('#prompt-input').value.trim();
  if (!text) return;
  generate(text);
});

$('#prompt-input').addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    $('#compose-form').requestSubmit();
  }
});

document.querySelectorAll('.chip').forEach((c) => {
  c.addEventListener('click', () => {
    $('#prompt-input').value = c.dataset.prompt;
    $('#prompt-input').focus();
  });
});

$('#new-btn').addEventListener('click', () => {
  state.current = null;
  renderHistory();
  show('compose');
  $('#prompt-input').focus();
});

// keyboard: ←/→ switch variants when viewing a project
document.addEventListener('keydown', (e) => {
  if ($('#view-project').classList.contains('hidden')) return;
  if (e.target.matches('input, textarea')) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const d = e.key === 'ArrowRight' ? 1 : -1;
    const ready = state.current.variants.filter((v) => v.state === 'complete').map((v) => v.n);
    const idx = ready.indexOf(state.variant) + d;
    if (idx >= 0 && idx < ready.length) {
      state.variant = ready[idx];
      state.iteration = null;
      renderProjectView();
    }
  }
});

// go
refreshStatus().then(() => {
  const sc = state.projects.find((p) => p.showcase);
  // Land on the composer; showcase is one click away in the rail.
  show('compose');
  $('#prompt-input').focus();
});
