/* ═══════════════════════════════════════════════════════════════
   LOGO TOOLS — Inter-tool Navigation ("Contact Sheet")
   Renders a 3x3 swatch of all tools in the sidebar footer,
   wires keyboard shortcuts: ← → cycle, 1–9 jump, T index.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const INDEX_PATH = '/logo/';

  // Canonical order — mirrors /logo/ index page.
  // SVGs lifted verbatim from the index so the visual language is identical.
  const TOOLS = [
    {
      slug: 'line-warp',
      name: 'Line Warp',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="0" y1="8" x2="80" y2="8"/><line x1="0" y1="16" x2="30" y2="16"/><path d="M30 16 Q40 6 50 16"/><line x1="50" y1="16" x2="80" y2="16"/><line x1="0" y1="24" x2="25" y2="24"/><path d="M25 24 Q40 8 55 24"/><line x1="55" y1="24" x2="80" y2="24"/><line x1="0" y1="32" x2="22" y2="32"/><path d="M22 32 Q40 10 58 32"/><line x1="58" y1="32" x2="80" y2="32"/><line x1="0" y1="40" x2="20" y2="40"/><path d="M20 40 Q40 12 60 40"/><line x1="60" y1="40" x2="80" y2="40"/><line x1="0" y1="48" x2="22" y2="48"/><path d="M22 48 Q40 14 58 48"/><line x1="58" y1="48" x2="80" y2="48"/><line x1="0" y1="56" x2="25" y2="56"/><path d="M25 56 Q40 20 55 56"/><line x1="55" y1="56" x2="80" y2="56"/><line x1="0" y1="64" x2="30" y2="64"/><path d="M30 64 Q40 40 50 64"/><line x1="50" y1="64" x2="80" y2="64"/><line x1="0" y1="72" x2="80" y2="72"/></svg>'
    },
    {
      slug: 'brutalist-letters',
      name: 'Brutalist Letters',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="20" y1="64" x2="40" y2="16"/><line x1="40" y1="16" x2="60" y2="64"/><line x1="28" y1="46" x2="52" y2="46"/><rect x="12" y="12" width="56" height="56" rx="2" stroke-dasharray="2 3" opacity="0.3"/></svg>'
    },
    {
      slug: 'interlocking-circles',
      name: 'Interlocking Circles',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="32" cy="32" r="18"/><circle cx="48" cy="32" r="18"/><circle cx="40" cy="46" r="18"/></svg>'
    },
    {
      slug: 'parallel-letters',
      name: 'Parallel Letters',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><line x1="16" y1="20" x2="16" y2="60"/><line x1="24" y1="20" x2="24" y2="60"/><line x1="32" y1="20" x2="32" y2="60"/><line x1="40" y1="20" x2="40" y2="60"/><line x1="48" y1="20" x2="48" y2="60"/><line x1="56" y1="20" x2="56" y2="60"/><line x1="64" y1="20" x2="64" y2="60"/><path d="M20 24 L40 24 L40 40 L24 40 L24 56 L44 56" stroke-width="3" opacity="0.4"/></svg>'
    },
    {
      slug: 'shape-tiles',
      name: 'Shape Tiles',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="40" cy="40" r="13"/><path d="M53 8 A13 13 0 0 1 27 8"/><path d="M27 72 A13 13 0 0 1 53 72"/><path d="M8 27 A13 13 0 0 1 8 53"/><path d="M72 53 A13 13 0 0 1 72 27"/><path d="M8 21 A13 13 0 0 1 21 8"/><path d="M59 8 A13 13 0 0 1 72 21"/><path d="M72 59 A13 13 0 0 1 59 72"/><path d="M21 72 A13 13 0 0 1 8 59"/></svg>'
    },
    {
      slug: 'sliced-shapes',
      name: 'Sliced Shapes',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M10,32 A12,12,0,1,1,34,32"/><path d="M10,32 A12,12,0,1,0,34,32"/><path d="M30,34 A12,12,0,1,1,54,28"/><path d="M30,28 A12,12,0,1,0,54,34"/><path d="M48,36 A12,12,0,1,1,72,26"/><path d="M48,26 A12,12,0,1,0,72,36"/></svg>'
    },
    {
      slug: 'slash-mark',
      name: 'Slash Mark',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="40" cy="40" r="26"/><line x1="30" y1="58" x2="38" y2="22"/><line x1="34" y1="58" x2="42" y2="22"/><line x1="38" y1="58" x2="46" y2="22"/><line x1="42" y1="58" x2="50" y2="22"/><line x1="46" y1="56" x2="52" y2="26"/></svg>'
    },
    {
      slug: 'polygon-rosette',
      name: 'Polygon Rosette',
      svg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="0.7"><polygon points="40,12 55.6,17 64.7,30 64.7,50 55.6,63 40,68 24.4,63 15.3,50 15.3,30 24.4,17"/><polygon points="40,24 49.4,27.6 53.8,36 53.8,44 49.4,52.4 40,56 30.6,52.4 26.2,44 26.2,36 30.6,27.6"/><line x1="40" y1="12" x2="53.8" y2="36"/><line x1="55.6" y1="17" x2="53.8" y2="44"/><line x1="64.7" y1="30" x2="49.4" y2="52.4"/><line x1="64.7" y1="50" x2="40" y2="56"/><line x1="55.6" y1="63" x2="30.6" y2="52.4"/><line x1="40" y1="68" x2="26.2" y2="44"/><line x1="24.4" y1="63" x2="26.2" y2="36"/><line x1="15.3" y1="50" x2="30.6" y2="27.6"/><line x1="15.3" y1="30" x2="40" y2="24"/><line x1="24.4" y1="17" x2="49.4" y2="27.6"/></svg>'
    },
    {
      slug: 'dot-grid',
      name: 'Dot Grid',
      svg: '<svg viewBox="0 0 80 80" fill="currentColor" stroke="none"><circle cx="20" cy="20" r="5"/><circle cx="20" cy="34" r="5"/><circle cx="20" cy="48" r="5"/><circle cx="20" cy="62" r="5"/><circle cx="34" cy="62" r="5"/><circle cx="48" cy="62" r="5"/><circle cx="62" cy="62" r="5"/></svg>'
    }
  ];

  function toolPath(slug) { return INDEX_PATH + slug + '/'; }

  function currentIndex() {
    // URL is /logo/<slug>/... — pick the segment after "logo".
    const parts = location.pathname.replace(/^\/|\/$/g, '').split('/');
    const i = parts.indexOf('logo');
    const slug = i >= 0 ? parts[i + 1] : parts[0];
    return TOOLS.findIndex(t => t.slug === slug);
  }

  function navigateTo(idx) {
    if (idx < 0) idx = TOOLS.length - 1;
    if (idx >= TOOLS.length) idx = 0;
    location.href = toolPath(TOOLS[idx].slug);
  }

  function render() {
    const container = document.querySelector('.tool-nav');
    if (!container) return;
    const current = currentIndex();

    const label = document.createElement('div');
    label.className = 'tool-nav__label';
    label.innerHTML =
      '<span>All Tools</span>' +
      '<a href="' + INDEX_PATH + '" class="tool-nav__label-link" aria-label="Open tools index">Index</a>';

    const grid = document.createElement('div');
    grid.className = 'tool-nav__grid';

    TOOLS.forEach((t, i) => {
      const a = document.createElement('a');
      a.href = toolPath(t.slug);
      a.className = 'tool-nav__tile' + (i === current ? ' is-current' : '');
      a.setAttribute('aria-label', t.name);
      a.setAttribute('data-name', t.name);
      a.setAttribute('data-key', String(i + 1));
      a.innerHTML = t.svg;
      grid.appendChild(a);
    });

    const hint = document.createElement('div');
    hint.className = 'tool-nav__hint';
    hint.innerHTML =
      '<kbd>←</kbd><kbd>→</kbd>' +
      '<span class="tool-nav__sep">·</span>' +
      '<kbd>1</kbd><span class="tool-nav__dash">–</span><kbd>9</kbd>' +
      '<span class="tool-nav__sep">·</span>' +
      '<kbd>T</kbd>';

    container.appendChild(label);
    container.appendChild(grid);
    container.appendChild(hint);
  }

  function handleKey(e) {
    // Ignore while typing in any input-like control.
    const t = e.target;
    if (t && t.matches && t.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const cur = currentIndex();

    if (e.key === 'ArrowLeft') {
      navigateTo(cur - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      navigateTo(cur + 1);
      e.preventDefault();
    } else if (e.key === 't' || e.key === 'T') {
      location.href = INDEX_PATH;
      e.preventDefault();
    } else if (/^[1-9]$/.test(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (idx < TOOLS.length) {
        navigateTo(idx);
        e.preventDefault();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  document.addEventListener('keydown', handleKey);
})();
