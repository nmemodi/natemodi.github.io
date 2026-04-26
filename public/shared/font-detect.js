// Detect which fonts are actually rendered (vs. silently substituted by the
// browser). The CSS Font Loading API's document.fonts.check() returns true for
// any installed *or* CSS-declared font, so we measure rendered glyph width
// against a known fallback — if widths match across multiple fallbacks, the
// font is being substituted and we treat it as unavailable.
(function () {
  const TEST_STRING = 'mwWLlI0Oo@gQ';
  const TEST_SIZE = '72px';
  const FALLBACKS = ['monospace', 'serif', 'sans-serif'];

  let canvas;
  function measure(font) {
    if (!canvas) canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${TEST_SIZE} ${font}`;
    return ctx.measureText(TEST_STRING).width;
  }

  function isAvailable(family) {
    const baseline = FALLBACKS.map(measure);
    // Render with the candidate font, falling back to each baseline. If the
    // candidate is actually present, at least one measurement must differ
    // from its baseline.
    for (let i = 0; i < FALLBACKS.length; i++) {
      const w = measure(`"${family}", ${FALLBACKS[i]}`);
      if (w !== baseline[i]) return true;
    }
    return false;
  }

  async function detectAvailableFonts(candidates) {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
    return candidates.filter(isAvailable);
  }

  window.FontDetect = { detectAvailableFonts, isAvailable };
})();
