// Tools Pill Bar Navigation
// Injected into each tool page via <script src="/tools/nav.js"></script>
(function () {
  const TOOLS = [
    { name: 'Line Warp', path: '/line-warp/', icon: '<line x1="0" y1="8" x2="80" y2="8"/><line x1="0" y1="20" x2="25" y2="20"/><path d="M25 20 Q40 6 55 20"/><line x1="55" y1="20" x2="80" y2="20"/><line x1="0" y1="32" x2="22" y2="32"/><path d="M22 32 Q40 10 58 32"/><line x1="58" y1="32" x2="80" y2="32"/><line x1="0" y1="44" x2="20" y2="44"/><path d="M20 44 Q40 12 60 44"/><line x1="60" y1="44" x2="80" y2="44"/><line x1="0" y1="56" x2="22" y2="56"/><path d="M22 56 Q40 20 58 56"/><line x1="58" y1="56" x2="80" y2="56"/><line x1="0" y1="68" x2="80" y2="68"/>' },
    { name: 'Letter Maker', path: '/letter-maker/', icon: '<line x1="20" y1="64" x2="40" y2="16"/><line x1="40" y1="16" x2="60" y2="64"/><line x1="28" y1="46" x2="52" y2="46"/><rect x="12" y="12" width="56" height="56" rx="2" stroke-dasharray="2 3" opacity="0.3"/>' },
    { name: 'Interlocking Circles', path: '/interlocking-circles/', icon: '<circle cx="32" cy="32" r="18"/><circle cx="48" cy="32" r="18"/><circle cx="40" cy="46" r="18"/>' },
    { name: 'Parallel Letters', path: '/parallel-letters/', icon: '<line x1="16" y1="20" x2="16" y2="60"/><line x1="24" y1="20" x2="24" y2="60"/><line x1="32" y1="20" x2="32" y2="60"/><line x1="40" y1="20" x2="40" y2="60"/><line x1="48" y1="20" x2="48" y2="60"/><line x1="56" y1="20" x2="56" y2="60"/><line x1="64" y1="20" x2="64" y2="60"/><path d="M20 24 L40 24 L40 40 L24 40 L24 56 L44 56" stroke-width="3" opacity="0.4"/>' },
    { name: 'Shape Tiles', path: '/shape-tiles/', icon: '<circle cx="40" cy="40" r="13"/><path d="M53 8 A13 13 0 0 1 27 8"/><path d="M27 72 A13 13 0 0 1 53 72"/><path d="M8 27 A13 13 0 0 1 8 53"/><path d="M72 53 A13 13 0 0 1 72 27"/><path d="M8 21 A13 13 0 0 1 21 8"/><path d="M59 8 A13 13 0 0 1 72 21"/><path d="M72 59 A13 13 0 0 1 59 72"/><path d="M21 72 A13 13 0 0 1 8 59"/>' },
    { name: 'Sliced Shapes', path: '/sliced-shapes/', icon: '<path d="M10,32 A12,12,0,1,1,34,32"/><path d="M10,32 A12,12,0,1,0,34,32"/><path d="M30,34 A12,12,0,1,1,54,28"/><path d="M30,28 A12,12,0,1,0,54,34"/><path d="M48,36 A12,12,0,1,1,72,26"/><path d="M48,26 A12,12,0,1,0,72,36"/>' },
    { name: 'Slash Mark', path: '/slash-mark/', icon: '<circle cx="40" cy="40" r="26"/><line x1="30" y1="58" x2="38" y2="22"/><line x1="34" y1="58" x2="42" y2="22"/><line x1="38" y1="58" x2="46" y2="22"/><line x1="42" y1="58" x2="50" y2="22"/><line x1="46" y1="56" x2="52" y2="26"/>' },
    { name: 'Polygon Rosette', path: '/polygon-rosette/', icon: '<polygon points="40,12 55.6,17 64.7,30 64.7,50 55.6,63 40,68 24.4,63 15.3,50 15.3,30 24.4,17"/><polygon points="40,24 49.4,27.6 53.8,36 53.8,44 49.4,52.4 40,56 30.6,52.4 26.2,44 26.2,36 30.6,27.6"/><line x1="40" y1="12" x2="53.8" y2="36"/><line x1="55.6" y1="17" x2="53.8" y2="44"/><line x1="64.7" y1="30" x2="49.4" y2="52.4"/><line x1="64.7" y1="50" x2="40" y2="56"/><line x1="55.6" y1="63" x2="30.6" y2="52.4"/><line x1="40" y1="68" x2="26.2" y2="44"/><line x1="24.4" y1="63" x2="26.2" y2="36"/><line x1="15.3" y1="50" x2="30.6" y2="27.6"/><line x1="15.3" y1="30" x2="40" y2="24"/><line x1="24.4" y1="17" x2="49.4" y2="27.6"/>' },
    { name: 'Dot Grid', path: '/dot-grid/', icon: '<circle cx="20" cy="20" r="5" fill="#fff" stroke="none"/><circle cx="20" cy="34" r="5" fill="#fff" stroke="none"/><circle cx="20" cy="48" r="5" fill="#fff" stroke="none"/><circle cx="20" cy="62" r="5" fill="#fff" stroke="none"/><circle cx="34" cy="62" r="5" fill="#fff" stroke="none"/><circle cx="48" cy="62" r="5" fill="#fff" stroke="none"/><circle cx="62" cy="62" r="5" fill="#fff" stroke="none"/>' },
  ];

  const HIDE_DELAY = 1500;
  const current = window.location.pathname.replace(/\/$/, '') + '/';
  let hideTimer = null;
  let visible = false;
  let pill, tooltip;

  // --- Inject styles ---
  const style = document.createElement('style');
  style.textContent = `
    .tools-pill {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(calc(100% + 30px));
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 8px 12px;
      background: rgba(18, 18, 18, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      z-index: 99999;
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    .tools-pill.visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    .tools-pill-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      text-decoration: none;
    }

    .tools-pill-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .tools-pill-item.active {
      background: rgba(255, 255, 255, 0.08);
    }

    .tools-pill-item.active::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #fff;
    }

    .tools-pill-item svg {
      width: 22px;
      height: 22px;
      opacity: 0.45;
      transition: opacity 0.2s ease;
    }

    .tools-pill-item:hover svg,
    .tools-pill-item.active svg {
      opacity: 0.9;
    }

    .tools-pill-sep {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 6px;
      flex-shrink: 0;
    }

    .tools-pill-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      text-decoration: none;
      color: inherit;
    }

    .tools-pill-grid:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .tools-pill-grid svg {
      width: 16px;
      height: 16px;
      opacity: 0.35;
      transition: opacity 0.2s ease;
    }

    .tools-pill-grid:hover svg {
      opacity: 0.8;
    }

    .tools-pill-tooltip {
      position: fixed;
      bottom: 68px;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 10px;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.03em;
      color: #ddd;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 100000;
    }

    .tools-pill-tooltip.show {
      opacity: 1;
    }

    .tools-pill-zone {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 48px;
      z-index: 99998;
    }

    @media (max-width: 640px) {
      .tools-pill {
        bottom: 12px;
        padding: 6px 8px;
        gap: 1px;
        border-radius: 12px;
      }
      .tools-pill-item {
        width: 30px;
        height: 30px;
        border-radius: 6px;
      }
      .tools-pill-item svg {
        width: 18px;
        height: 18px;
      }
      .tools-pill-grid {
        width: 30px;
        height: 30px;
      }
      .tools-pill-grid svg {
        width: 14px;
        height: 14px;
      }
      .tools-pill-sep {
        height: 16px;
        margin: 0 3px;
      }
      .tools-pill-tooltip {
        bottom: 56px;
      }
    }
  `;
  document.head.appendChild(style);

  // --- Build pill HTML ---
  pill = document.createElement('div');
  pill.className = 'tools-pill';

  TOOLS.forEach(function (tool, i) {
    const item = document.createElement('a');
    item.className = 'tools-pill-item';
    item.href = tool.path;
    const isActive = current === tool.path;
    if (isActive) {
      item.classList.add('active');
      item.addEventListener('click', function (e) { e.preventDefault(); });
    }
    item.innerHTML = '<svg viewBox="0 0 80 80" fill="none" stroke="#fff" stroke-width="0.8">' + tool.icon + '</svg>';

    item.addEventListener('mouseenter', function () {
      showTooltip(tool.name, item);
    });
    item.addEventListener('mouseleave', function () {
      hideTooltip();
    });

    pill.appendChild(item);
  });

  // Separator + grid link
  const sep = document.createElement('div');
  sep.className = 'tools-pill-sep';
  pill.appendChild(sep);

  const gridLink = document.createElement('a');
  gridLink.className = 'tools-pill-grid';
  gridLink.href = '/tools/';
  gridLink.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.2"><rect x="1" y="1" width="5.5" height="5.5" rx="0.5"/><rect x="9.5" y="1" width="5.5" height="5.5" rx="0.5"/><rect x="1" y="9.5" width="5.5" height="5.5" rx="0.5"/><rect x="9.5" y="9.5" width="5.5" height="5.5" rx="0.5"/></svg>';
  gridLink.addEventListener('mouseenter', function () {
    showTooltip('All Tools', gridLink);
  });
  gridLink.addEventListener('mouseleave', function () {
    hideTooltip();
  });
  pill.appendChild(gridLink);

  // Tooltip element
  tooltip = document.createElement('div');
  tooltip.className = 'tools-pill-tooltip';

  // Hover zone at bottom of screen
  const zone = document.createElement('div');
  zone.className = 'tools-pill-zone';

  document.body.appendChild(pill);
  document.body.appendChild(tooltip);
  document.body.appendChild(zone);

  // --- Show / Hide logic ---
  function show() {
    if (visible) return;
    visible = true;
    pill.classList.add('visible');
    clearTimeout(hideTimer);
  }

  function hide() {
    visible = false;
    pill.classList.remove('visible');
    hideTooltip();
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_DELAY);
  }

  function showTooltip(text, anchor) {
    const rect = anchor.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.classList.add('show');
  }

  function hideTooltip() {
    tooltip.classList.remove('show');
  }

  // Hover zone triggers show
  zone.addEventListener('mouseenter', function () {
    show();
  });

  // Pill keeps itself visible
  pill.addEventListener('mouseenter', function () {
    clearTimeout(hideTimer);
    show();
  });

  pill.addEventListener('mouseleave', function () {
    scheduleHide();
  });

  zone.addEventListener('mouseleave', function () {
    if (!pill.matches(':hover')) {
      scheduleHide();
    }
  });

  // --- Keyboard shortcuts ---
  document.addEventListener('keydown', function (e) {
    // Don't trigger if user is typing in an input
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;

    var currentIndex = TOOLS.findIndex(function (t) { return t.path === current; });

    if (e.key === '[' || e.key === 'ArrowLeft' && e.altKey) {
      e.preventDefault();
      var prev = currentIndex <= 0 ? TOOLS.length - 1 : currentIndex - 1;
      window.location.href = TOOLS[prev].path;
    } else if (e.key === ']' || e.key === 'ArrowRight' && e.altKey) {
      e.preventDefault();
      var next = currentIndex >= TOOLS.length - 1 ? 0 : currentIndex + 1;
      window.location.href = TOOLS[next].path;
    } else if (e.key === 'Escape' && visible) {
      hide();
    }
  });
})();
