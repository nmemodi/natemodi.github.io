import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildToolsData } from '../scripts/build-logo-tools-json.mjs';
import { buildExplorerData } from '../scripts/build-logo-explorer-json.mjs';
import { buildExampleGallery } from '../scripts/build-logo-agent-example.mjs';

const root = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8'));
}

describe('Logo Lab agent data artifacts', () => {
  it('keeps public tools.json in sync with the generator', () => {
    expect(readJson('public/logo/tools.json')).toEqual(buildToolsData());
  });

  it('keeps public explorer.json in sync with the generator', () => {
    const generated = buildExplorerData();
    const checkedIn = readJson('public/logo/explorer.json');
    expect(checkedIn).toEqual(generated);
    expect(checkedIn.toolCount).toBe(10);
    expect(checkedIn.conceptCount).toBe(1175);
    expect(checkedIn.concepts).toHaveLength(1175);
  });

  it('keeps the sample gallery in sync with the generator', () => {
    const sample = readJson('public/logo/examples/agent-gallery/gallery.json');
    const toolBySlug = new Map(readJson('public/logo/tools.json').tools.map((tool) => [tool.slug, tool]));
    expect(sample).toEqual(buildExampleGallery());
    expect(sample.concepts).toHaveLength(50);
    expect(new Set(sample.concepts.map((concept) => concept.toolSlug)).size).toBeGreaterThanOrEqual(5);
    expect(sample.recommendations).toHaveLength(5);
    const conceptById = new Map(sample.concepts.map((concept) => [concept.id, concept]));
    const recommendedConcepts = sample.recommendations.map((recommendation) => conceptById.get(recommendation.conceptId));
    const recommendedToolSlugs = recommendedConcepts.map((concept) => concept.toolSlug);
    const recommendedModes = recommendedConcepts.map((concept) => toolBySlug.get(concept.toolSlug).mode);
    expect(new Set(recommendedToolSlugs).size).toBe(5);
    expect(recommendedModes.filter((mode) => mode === 'letter')).toHaveLength(2);
    expect(recommendedModes.filter((mode) => mode === 'abstract')).toHaveLength(3);
  });

  it('uses canonical public Logo Lab URLs in generated data', () => {
    const tools = readJson('public/logo/tools.json');
    const explorer = readJson('public/logo/explorer.json');
    const expectedLinks = {
      landingPage: 'https://natemodi.com/logo/',
      githubRepo: 'https://github.com/nmemodi/natemodi.github.io',
    };
    expect(tools.links).toEqual(expectedLinks);
    expect(explorer.links).toEqual(expectedLinks);
    tools.tools.forEach((tool) => {
      expect(tool.url).toMatch(/^https:\/\/natemodi\.com\/logo\/[a-z0-9-]+\/$/);
      expect(tool.url).not.toContain('index.html');
      expect(tool.defaultUrl).not.toContain('index.html');
    });
    explorer.concepts.slice(0, 25).forEach((concept) => {
      expect(concept.url).toMatch(/^https:\/\/natemodi\.com\/logo\/[a-z0-9-]+\/#v=1/);
      expect(concept.url).not.toContain('index.html');
    });
  });
});
