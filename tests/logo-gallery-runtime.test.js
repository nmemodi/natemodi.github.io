import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = path.resolve(__dirname, '..');

function loadRegistry(window) {
  const src = fs.readFileSync(path.join(root, 'public/shared/tools-registry.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  const fn = new Function('window', 'document', 'location', src);
  fn(window, window.document, window.location);
}

function setupRuntime(url = 'https://natemodi.com/logo/gallery/') {
  const html = fs.readFileSync(path.join(root, 'public/logo/gallery/index.html'), 'utf8');
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  dom.window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  loadRegistry(dom.window);
  const scripts = Array.from(dom.window.document.querySelectorAll('script:not([src])'));
  scripts.forEach((script) => dom.window.eval(script.textContent));
  return dom.window;
}

describe('Logo Gallery runtime validation', () => {
  let window;
  let sample;

  beforeEach(() => {
    window = setupRuntime();
    sample = JSON.parse(fs.readFileSync(path.join(root, 'public/logo/examples/agent-gallery/gallery.json'), 'utf8'));
  });

  it('validates the sample manifest without blocking concepts', () => {
    const manifest = window.LogoGalleryRuntime.validateManifest(sample);
    expect(manifest.concepts).toHaveLength(50);
    expect(manifest.blocked).toHaveLength(0);
  });

  it('uses a single Explorer-style shuffle control instead of gallery filter buttons', () => {
    expect(window.document.querySelector('[data-shuffle-concepts]')).toBeTruthy();
    expect(window.document.querySelector('[data-recommendations]')).toBeNull();
    expect(window.document.querySelector('[data-filters]')).toBeNull();
    expect(window.document.querySelector('[data-directions]')).toBeNull();
    expect(window.document.querySelector('[data-empty]')).toBeNull();
  });

  it('preserves explicit recommendation metadata without rendering a separate section', () => {
    const manifest = window.LogoGalleryRuntime.validateManifest(sample);
    const conceptById = new Map(manifest.concepts.map((concept) => [concept.id, concept]));
    expect(manifest.recommendations.map((recommendation) => recommendation.conceptId))
      .toEqual(sample.recommendations.map((recommendation) => recommendation.conceptId));
    expect(new Set(manifest.recommendations.map((recommendation) => conceptById.get(recommendation.conceptId).toolSlug)).size)
      .toBe(5);
    expect(window.document.querySelector('[aria-labelledby="recommendations-title"]')).toBeNull();
  });

  it('does not render per-card rationale descriptions', () => {
    expect(window.document.querySelector('.rationale')).toBeNull();
  });

  it('does not render per-card tags or metadata pills', () => {
    expect(window.document.querySelector('.tags')).toBeNull();
    expect(window.document.querySelector('.tag')).toBeNull();
  });

  it('keeps variation type metadata out of visible card labels', () => {
    const html = fs.readFileSync(path.join(root, 'public/logo/gallery/index.html'), 'utf8');
    expect(html).not.toContain('variation.textContent');
    expect(html).not.toContain('meta.append(rank, variation)');
  });

  it('uses one external tool action instead of source and iframe-copy actions', () => {
    const html = fs.readFileSync(path.join(root, 'public/logo/gallery/index.html'), 'utf8');
    expect(html).toContain('Open in tool ↗');
    expect(html).not.toContain('Copy iframe');
    expect(html).not.toContain('Copy iframe snippet');
  });

  it('keeps raw JSON in a collapsed advanced panel and removes load status pills', () => {
    const html = fs.readFileSync(path.join(root, 'public/logo/gallery/index.html'), 'utf8');
    const panel = window.document.querySelector('[data-json-panel]');
    expect(panel).toBeTruthy();
    expect(panel.open).toBe(false);
    expect(panel.querySelector('[data-paste-input]')).toBeTruthy();
    expect(html).not.toContain('Gallery loaded');
    expect(window.document.querySelector('[data-status]')).toBeNull();
    expect(window.document.querySelector('.status-row')).toBeNull();
    expect(window.document.querySelector('.pill')).toBeNull();
  });

  it('keeps the static gallery template aligned with the simplified Concepts view', () => {
    const html = fs.readFileSync(path.join(root, 'public/logo/gallery-template.html'), 'utf8');
    const template = new JSDOM(html).window.document;
    expect(template.querySelector('[data-shuffle-concepts]')).toBeTruthy();
    expect(template.querySelector('[data-directions]')).toBeNull();
    expect(template.querySelector('[data-filters]')).toBeNull();
    expect(template.querySelector('[data-empty]')).toBeNull();
    expect(html).toContain('Open in tool ↗');
    expect(html).not.toContain('Copy iframe');
  });

  it('blocks unsafe off-domain embed URLs without rejecting the whole gallery', () => {
    const dirty = structuredClone(sample);
    dirty.concepts[0].embedUrl = 'https://evil.example/logo/line-warp/#v=1&seed=x';
    const manifest = window.LogoGalleryRuntime.validateManifest(dirty);
    expect(manifest.concepts).toHaveLength(49);
    expect(manifest.blocked).toHaveLength(1);
    expect(manifest.blocked[0].errorName).toBe('UnsafeEmbedUrlError');
  });

  it('rejects non-HTTPS external manifest sources', () => {
    expect(() => window.LogoGalleryRuntime.safeSourceUrl('http://example.com/gallery.json'))
      .toThrow(window.LogoGalleryRuntime.GalleryFetchError);
  });

  it('allows same-origin relative manifest sources', () => {
    expect(window.LogoGalleryRuntime.safeSourceUrl('/logo/examples/agent-gallery/gallery.json'))
      .toBe('https://natemodi.com/logo/examples/agent-gallery/gallery.json');
  });

  it('rewrites production iframe previews to localhost during local QA', () => {
    window = setupRuntime('http://127.0.0.1:8789/logo/gallery/');
    const manifest = window.LogoGalleryRuntime.validateManifest(sample);
    expect(manifest.concepts[0].url).toMatch(/^https:\/\/natemodi\.com\/logo\/line-warp\//);
    expect(manifest.concepts[0].iframeSrc).toMatch(/^http:\/\/127\.0\.0\.1:8789\/logo\/line-warp\/index\.html#v=1/);
  });

  it('rejects manifests with more than 80 concepts', () => {
    const crowded = structuredClone(sample);
    crowded.concepts = Array.from({ length: 81 }, (_, index) => ({
      ...sample.concepts[index % sample.concepts.length],
      id: `crowded-${index}`,
      rank: index + 1,
    }));
    expect(() => window.LogoGalleryRuntime.validateManifest(crowded))
      .toThrow(window.LogoGalleryRuntime.GalleryValidationError);
  });
});
