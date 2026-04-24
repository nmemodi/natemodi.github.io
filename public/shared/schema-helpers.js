/* ═══════════════════════════════════════════════════════════════
   LOGO TOOLS — Schema Helpers
   Typed field factories for permalink schemas + XML escape for
   safe SVG serialization of user-supplied strings.

   Every tool defines its schema using these factories:
     const schema = {
       c:  INT_RANGE(1, 12, 3),
       bg: COLOR('#111111'),
       sh: ENUM(['circle','square','triangle'], 'circle'),
       ch: TEXT({ charset: /^[\p{L}\p{N}\p{P}\p{S}]$/u, maxLen: 1, def: 'A' }),
       sd: SEED(),
     };

   Each factory returns { type, default, encode, decode, validate }.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  /* ─── INT_RANGE: clamped integer ─── */
  function INT_RANGE(min, max, def) {
    return {
      type: 'int',
      default: def,
      min, max,
      encode(v) { return String(v | 0); },
      decode(s) {
        const n = parseInt(s, 10);
        if (!Number.isFinite(n)) return { ok: false, value: def, reason: 'not-int' };
        if (n < min) return { ok: true, value: min, reason: 'clamped-lo', clamped: true };
        if (n > max) return { ok: true, value: max, reason: 'clamped-hi', clamped: true };
        return { ok: true, value: n };
      },
    };
  }

  /* ─── FLOAT_RANGE: clamped float with fixed precision ─── */
  function FLOAT_RANGE(min, max, def, precision = 3) {
    const roundTo = Math.pow(10, precision);
    return {
      type: 'float',
      default: def,
      min, max, precision,
      encode(v) {
        const rounded = Math.round(v * roundTo) / roundTo;
        return String(rounded);
      },
      decode(s) {
        const n = parseFloat(s);
        if (!Number.isFinite(n)) return { ok: false, value: def, reason: 'not-float' };
        if (n < min) return { ok: true, value: min, reason: 'clamped-lo', clamped: true };
        if (n > max) return { ok: true, value: max, reason: 'clamped-hi', clamped: true };
        return { ok: true, value: Math.round(n * roundTo) / roundTo };
      },
    };
  }

  /* ─── UNIT_FLOAT: 0..1 clamped, convenience wrapper ─── */
  function UNIT_FLOAT(def, precision = 3) {
    return FLOAT_RANGE(0, 1, def, precision);
  }

  /* ─── COLOR: 6-digit lowercase hex, no leading # in URL ─── */
  function COLOR(def) {
    const defClean = normalizeHex(def);
    return {
      type: 'color',
      default: defClean,
      encode(v) { return normalizeHex(v).slice(1); },
      decode(s) {
        if (typeof s !== 'string') return { ok: false, value: defClean, reason: 'not-string' };
        const raw = s.startsWith('#') ? s : '#' + s;
        if (!/^#[0-9a-fA-F]{6}$/.test(raw)) return { ok: false, value: defClean, reason: 'bad-hex' };
        return { ok: true, value: raw.toLowerCase() };
      },
    };
  }

  function normalizeHex(v) {
    if (typeof v !== 'string') return '#000000';
    const raw = v.startsWith('#') ? v : '#' + v;
    return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw.toLowerCase() : '#000000';
  }

  /* ─── ENUM: allowed string set ─── */
  function ENUM(values, def) {
    const set = new Set(values);
    if (!set.has(def)) throw new Error(`ENUM default "${def}" not in values`);
    return {
      type: 'enum',
      default: def,
      values,
      encode(v) { return String(v); },
      decode(s) {
        if (!set.has(s)) return { ok: false, value: def, reason: 'not-in-enum' };
        return { ok: true, value: s };
      },
    };
  }

  /* ─── BOOL: 0 | 1 ─── */
  function BOOL(def) {
    return {
      type: 'bool',
      default: !!def,
      encode(v) { return v ? '1' : '0'; },
      decode(s) {
        if (s === '1') return { ok: true, value: true };
        if (s === '0') return { ok: true, value: false };
        return { ok: false, value: !!def, reason: 'not-bool' };
      },
    };
  }

  /* ─── SEED: 32-bit unsigned integer (generated if missing) ─── */
  function SEED(def) {
    const defSeed = (def === undefined) ? 1 : (def >>> 0);
    return {
      type: 'seed',
      default: defSeed,
      encode(v) { return (v >>> 0).toString(36); },
      decode(s) {
        const n = parseInt(s, 36);
        if (!Number.isFinite(n) || n < 0) return { ok: false, value: defSeed, reason: 'bad-seed' };
        return { ok: true, value: n >>> 0 };
      },
    };
  }

  /* ─── TEXT: charset-whitelisted, length-clamped string ─── */
  function TEXT({ charset, maxLen, def }) {
    return {
      type: 'text',
      default: def,
      maxLen,
      encode(v) {
        const s = String(v).slice(0, maxLen);
        return encodeURIComponent(s);
      },
      decode(raw) {
        if (typeof raw !== 'string') return { ok: false, value: def, reason: 'not-string' };
        let s;
        try { s = decodeURIComponent(raw); }
        catch (e) { return { ok: false, value: def, reason: 'bad-encoding' }; }
        if (s.length === 0) return { ok: false, value: def, reason: 'empty' };
        if (s.length > maxLen) s = s.slice(0, maxLen);
        if (charset && !charset.test(s)) return { ok: false, value: def, reason: 'bad-charset' };
        return { ok: true, value: s };
      },
    };
  }

  /* ─── xmlEscape: safe SVG text embedding ─── */
  const XML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  function xmlEscape(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, (c) => XML_ESC[c]);
  }

  window.LogoSchema = {
    INT_RANGE,
    FLOAT_RANGE,
    UNIT_FLOAT,
    COLOR,
    ENUM,
    BOOL,
    SEED,
    TEXT,
    xmlEscape,
    normalizeHex,
  };
})();
