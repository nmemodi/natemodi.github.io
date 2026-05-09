import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildExampleGallery } from '../scripts/build-logo-agent-example.mjs';
import { evaluateGalleryManifest, summarizeGallery } from '../scripts/evaluate-logo-agent-gallery.mjs';

const root = path.resolve(__dirname, '..');
const fixtureDir = path.join(root, 'tests/fixtures/logo-agent');

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, fileName), 'utf8'));
}

describe('Logo Lab agent gallery evaluator', () => {
  it('keeps the VectorKit fixture prompt wired to the public contract files', () => {
    const prompt = fs.readFileSync(path.join(fixtureDir, 'vector-kit.prompt.md'), 'utf8');
    [
      'https://natemodi.com/logo/',
      'https://github.com/nmemodi/natemodi.github.io',
      'https://natemodi.com/logo/agents.md',
      'https://natemodi.com/logo/tools.json',
      'https://natemodi.com/logo/explorer.json',
      'https://natemodi.com/logo/agent-rules.md',
      'https://natemodi.com/logo/gallery.schema.json',
      'https://natemodi.com/logo/gallery-template.html',
    ].forEach((url) => expect(prompt).toContain(url));
    expect(prompt).toContain('Every letter-capable concept should use `V`');
  });

  it('passes the generated VectorKit sample against quality thresholds and summary snapshot', () => {
    const result = evaluateGalleryManifest(buildExampleGallery(), {
      brandBrief: readJson('vector-kit-brief.json'),
      expectedSummary: readJson('vector-kit.expected-summary.json'),
      minScore: 95,
    });
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.checks.every((check) => check.pass)).toBe(true);
  });

  it('summarizes the generated sample into the checked-in expected shape', () => {
    const summary = summarizeGallery(buildExampleGallery());
    const expected = readJson('vector-kit.expected-summary.json');
    Object.entries(expected).forEach(([key, value]) => {
      expect(summary[key]).toEqual(value);
    });
  });

  it('flags unsafe or non-canonical concept URLs', () => {
    const dirty = structuredClone(buildExampleGallery());
    dirty.concepts[0].embedUrl = 'https://example.com/logo/line-warp/#v=1&seed=x';
    const result = evaluateGalleryManifest(dirty, {
      brandBrief: readJson('vector-kit-brief.json'),
      expectedSummary: readJson('vector-kit.expected-summary.json'),
    });
    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === 'canonical-logo-urls').pass).toBe(false);
  });

  it('flags letter-capable outputs that drift away from the brand leading letter', () => {
    const dirty = structuredClone(buildExampleGallery());
    dirty.concepts.find((concept) => concept.toolSlug === 'line-warp').url =
      'https://natemodi.com/logo/line-warp/#v=1&r=1&seed=x&bg=ffffff&fg=111111&lt=K';
    const result = evaluateGalleryManifest(dirty, {
      brandBrief: readJson('vector-kit-brief.json'),
      expectedSummary: readJson('vector-kit.expected-summary.json'),
    });
    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === 'brand-letter-constraint').pass).toBe(false);
  });

  it('flags weak recommendation coverage', () => {
    const dirty = structuredClone(buildExampleGallery());
    dirty.recommendations = dirty.recommendations.slice(0, 3);
    const result = evaluateGalleryManifest(dirty, {
      brandBrief: readJson('vector-kit-brief.json'),
      expectedSummary: readJson('vector-kit.expected-summary.json'),
    });
    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === 'recommendations').pass).toBe(false);
  });

  it('flags recommendations that collapse onto one tool family', () => {
    const dirty = structuredClone(buildExampleGallery());
    const lineWarpIds = dirty.concepts
      .filter((concept) => concept.toolSlug === 'line-warp')
      .slice(0, 5)
      .map((concept) => concept.id);
    dirty.concepts.forEach((concept) => {
      concept.isRecommended = lineWarpIds.includes(concept.id);
      if (concept.isRecommended) {
        concept.recommendationReason = 'This intentionally duplicated recommendation should fail the diversity check.';
      }
    });
    dirty.recommendations = lineWarpIds.map((conceptId) => ({
      conceptId,
      reason: 'This intentionally duplicated recommendation should fail the diversity check.'
    }));

    const result = evaluateGalleryManifest(dirty, {
      brandBrief: readJson('vector-kit-brief.json'),
    });

    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === 'recommendations').pass).toBe(false);
  });

  it('flags uneven tool representation across generated outputs', () => {
    const dirty = structuredClone(buildExampleGallery());
    dirty.concepts = dirty.concepts.filter((concept) => !(concept.toolSlug === 'line-warp' && concept.rank > 3));

    const result = evaluateGalleryManifest(dirty, {
      brandBrief: readJson('vector-kit-brief.json'),
    });

    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === 'tool-coverage').pass).toBe(false);
  });
});
