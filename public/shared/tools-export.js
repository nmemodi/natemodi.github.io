/* ═══════════════════════════════════════════════════════════════
   LOGO TOOLS — Shared Export Engine
   Provides unified PNG/SVG export with resolution picker,
   transparent background toggle, and clipboard copy.
   ═══════════════════════════════════════════════════════════════ */

class ToolExporter {
  /**
   * @param {Object} opts
   * @param {string}   opts.toolName       — kebab-case name for filenames
   * @param {Function} opts.getCanvas      — () => HTMLCanvasElement (the visible canvas)
   * @param {Function} opts.getSVG         — () => string (SVG markup)
   * @param {Function} [opts.renderToCanvas] — (ctx, width, height, {transparent}) => void
   *   If provided, enables re-rendering at arbitrary sizes & transparent bg.
   *   If omitted, PNG export simply copies the visible canvas (no transparent support).
   * @param {Function} [opts.getBackgroundColor] — () => string (current bg hex)
   * @param {number}   [opts.baseWidth]    — base canvas width (default: reads from canvas)
   * @param {number}   [opts.baseHeight]   — base canvas height (default: reads from canvas)
   * @param {Object}   [opts.paperProject] — Paper.js project (enables Paper.js PNG export)
   */
  constructor(opts) {
    this.toolName = opts.toolName;
    this.getCanvas = opts.getCanvas;
    this.getSVG = opts.getSVG;
    this.renderToCanvas = opts.renderToCanvas || null;
    this.getBackgroundColor = opts.getBackgroundColor || (() => '#111111');
    this.baseWidth = opts.baseWidth || null;
    this.baseHeight = opts.baseHeight || null;
    this.paperProject = opts.paperProject || null;

    this.currentFormat = 'png';
    this.currentScale = 2;
    this.transparent = false;

    this._injectPanel();
    this._bindEvents();
    this._bindKeyboard();
  }

  /* ─── DOM injection ─── */

  _injectPanel() {
    // Overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'export-overlay';
    document.body.appendChild(this.overlay);

    // Panel
    this.panel = document.createElement('div');
    this.panel.className = 'export-panel';
    this.panel.innerHTML = `
      <div class="export-sheet">
        <div class="export-sheet__header">
          <h2>Export</h2>
          <button class="export-sheet__close" aria-label="Close">&times;</button>
        </div>

        <div class="export-formats">
          <button class="export-format-btn active" data-format="png">PNG</button>
          <button class="export-format-btn" data-format="svg">SVG</button>
        </div>

        <div class="export-options" id="exportPngOptions">
          <div class="control-group">
            <label>Resolution</label>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="export-res-row">
                <button class="export-res-btn" data-scale="1">1x</button>
                <button class="export-res-btn active" data-scale="2">2x</button>
                <button class="export-res-btn" data-scale="4">4x</button>
              </div>
              <span class="export-dims"></span>
            </div>
          </div>

          <label class="toggle-row">
            <input type="checkbox" id="exportTransparent">
            <span>Transparent background</span>
          </label>
        </div>

        <div class="export-actions">
          <button class="btn btn-primary btn-full" id="exportDownload">Download</button>
          <button class="btn btn-secondary btn-full" id="exportClipboard">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="5" width="9" height="9" rx="1.5"/>
              <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"/>
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(this.panel);

    // Cache DOM refs
    this.dimsEl = this.panel.querySelector('.export-dims');
    this.pngOptions = this.panel.querySelector('#exportPngOptions');
    this.transparentCheckbox = this.panel.querySelector('#exportTransparent');
  }

  /* ─── Event binding ─── */

  _bindEvents() {
    // Open trigger — find button with data-export or #openExport
    const trigger = document.querySelector('[data-export-trigger], #openExport, .btn-export');
    if (trigger) trigger.addEventListener('click', () => this.open());

    // Close
    this.overlay.addEventListener('click', () => this.close());
    this.panel.querySelector('.export-sheet__close').addEventListener('click', () => this.close());

    // Format tabs
    this.panel.querySelectorAll('.export-format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.panel.querySelectorAll('.export-format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFormat = btn.dataset.format;
        this.pngOptions.style.display = this.currentFormat === 'png' ? '' : 'none';
      });
    });

    // Resolution pills
    this.panel.querySelectorAll('.export-res-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.panel.querySelectorAll('.export-res-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentScale = parseInt(btn.dataset.scale);
        this._updateDims();
      });
    });

    // Transparent toggle
    this.transparentCheckbox.addEventListener('change', () => {
      this.transparent = this.transparentCheckbox.checked;
    });

    // Download
    this.panel.querySelector('#exportDownload').addEventListener('click', () => this._download());

    // Clipboard
    this.panel.querySelector('#exportClipboard').addEventListener('click', () => this._copyToClipboard());
  }

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Cmd+E / Ctrl+E to open export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (this.panel.classList.contains('visible')) {
          this.close();
        } else {
          this.open();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && this.panel.classList.contains('visible')) {
        this.close();
      }
    });
  }

  /* ─── Open / Close ─── */

  open() {
    this._updateDims();
    this.overlay.classList.add('visible');
    this.panel.classList.add('visible');
  }

  close() {
    this.overlay.classList.remove('visible');
    this.panel.classList.remove('visible');
  }

  /* ─── Dimension display ─── */

  _getBaseSize() {
    const canvas = this.getCanvas();
    const w = this.baseWidth || (canvas ? canvas.width : 800);
    const h = this.baseHeight || (canvas ? canvas.height : 800);
    return { w, h };
  }

  _updateDims() {
    const { w, h } = this._getBaseSize();
    const sw = w * this.currentScale;
    const sh = h * this.currentScale;
    this.dimsEl.textContent = `${sw} × ${sh}`;
  }

  /* ─── Export: PNG ─── */

  async _exportPNG() {
    const scale = this.currentScale;
    const transparent = this.transparent;

    // Paper.js path
    if (this.paperProject) {
      return this._exportPaperPNG(scale, transparent);
    }

    const srcCanvas = this.getCanvas();
    if (!srcCanvas) return null;

    // If renderToCanvas is provided, use it for clean re-render at scale
    if (this.renderToCanvas) {
      const { w, h } = this._getBaseSize();
      const offscreen = document.createElement('canvas');
      offscreen.width = w * scale;
      offscreen.height = h * scale;
      const ctx = offscreen.getContext('2d');

      if (!transparent) {
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fillRect(0, 0, offscreen.width, offscreen.height);
      }

      ctx.save();
      ctx.scale(scale, scale);
      this.renderToCanvas(ctx, w, h, { transparent });
      ctx.restore();

      return new Promise(resolve => {
        offscreen.toBlob(blob => resolve(blob), 'image/png');
      });
    }

    // Fallback: copy visible canvas at scale
    const { w, h } = this._getBaseSize();
    const offscreen = document.createElement('canvas');
    offscreen.width = w * scale;
    offscreen.height = h * scale;
    const ctx = offscreen.getContext('2d');

    if (transparent && this.renderToCanvas) {
      // Already handled above
    } else {
      ctx.drawImage(srcCanvas, 0, 0, offscreen.width, offscreen.height);
    }

    return new Promise(resolve => {
      offscreen.toBlob(blob => resolve(blob), 'image/png');
    });
  }

  /* Paper.js PNG export */
  async _exportPaperPNG(scale, transparent) {
    const project = this.paperProject;
    if (!project || !project.activeLayer) return null;

    const view = project.view;
    const { w, h } = this._getBaseSize();

    const offscreen = document.createElement('canvas');
    offscreen.width = w * scale;
    offscreen.height = h * scale;
    const ctx = offscreen.getContext('2d');

    if (!transparent) {
      ctx.fillStyle = this.getBackgroundColor();
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    }

    // Export SVG, draw to canvas via Image
    const svgString = this.getSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
        URL.revokeObjectURL(url);
        offscreen.toBlob(pngBlob => resolve(pngBlob), 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  /* ─── Export: SVG ─── */

  _exportSVG() {
    const svgString = this.getSVG();
    if (!svgString) return null;
    return new Blob([svgString], { type: 'image/svg+xml' });
  }

  /* ─── Download ─── */

  async _download() {
    let blob, ext;

    if (this.currentFormat === 'svg') {
      blob = this._exportSVG();
      ext = 'svg';
    } else {
      blob = await this._exportPNG();
      ext = 'png';
    }

    if (!blob) {
      this._toast('Export failed', true);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.toolName}-${this.currentScale}x.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this._toast(`Saved ${this.toolName}.${ext}`);
    this.close();
  }

  /* ─── Clipboard ─── */

  async _copyToClipboard() {
    try {
      let blob;

      if (this.currentFormat === 'svg') {
        // SVG as text
        const svgString = this.getSVG();
        if (!svgString) throw new Error('No SVG');
        blob = new Blob([svgString], { type: 'text/plain' });
        await navigator.clipboard.writeText(svgString);
      } else {
        // PNG as image
        blob = await this._exportPNG();
        if (!blob) throw new Error('No PNG');
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }

      this._toast('Copied to clipboard');
      this.close();
    } catch (e) {
      this._toast('Copy failed — try downloading instead', true);
    }
  }

  /* ─── Toast ─── */

  _toast(message, isError = false) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast${isError ? ' toast--error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
      });
    });

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }
}

/* Make available globally */
window.ToolExporter = ToolExporter;
