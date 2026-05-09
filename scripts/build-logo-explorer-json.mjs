import fs from 'node:fs';
import {
  EXPLORER_JSON_PATH,
  GENERATED_AT,
  LOGO_BASE_URL,
  LOGO_REFERENCE_LINKS,
  canonicalToolUrl,
  conceptId,
  loadPresets,
  loadRegistry,
  randomSeedHash,
  stableStringify,
  validatePresets,
} from './logo-agent-data-utils.mjs';

export function buildExplorerData() {
  const tools = loadRegistry();
  const presets = loadPresets();
  validatePresets(presets, tools);

  const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const concepts = [];

  tools.forEach((tool) => {
    const seeds = presets[tool.slug] || [];
    const meta = tool.agentMetadata;
    seeds.forEach((seed, index) => {
      const hash = randomSeedHash(seed);
      concepts.push({
        id: conceptId(tool.slug, index),
        toolSlug: tool.slug,
        toolName: tool.name,
        url: canonicalToolUrl(tool.slug, hash),
        embedUrl: canonicalToolUrl(tool.slug, hash),
        hash,
        seed,
        style: meta.styleTags,
        mode: meta.mode,
        colorMode: 'variable',
        supportsInitials: meta.supportsInitials,
        supportsRecoloring: meta.supportsRecoloring,
        qualityTier: 'curated',
        mutableParams: meta.safeMutationParams,
        colorParams: meta.colorParams,
        variationStrategy: meta.supportsInitials
          ? 'Start from this curated seed. Recolor first, then apply initials where appropriate, then vary lightly.'
          : 'Start from this curated seed. Recolor first, then vary geometry lightly.',
      });
    });
  });

  const missing = Object.keys(presets).filter((slug) => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(`Unknown preset slugs after validation: ${missing.join(', ')}`);
  }

  return {
    version: 1,
    generatedAt: GENERATED_AT,
    baseUrl: LOGO_BASE_URL,
    links: LOGO_REFERENCE_LINKS,
    sourceFiles: ['public/shared/tools-registry.js', 'public/logo/explorer/presets.json'],
    toolCount: tools.length,
    conceptCount: concepts.length,
    concepts,
  };
}

export function writeExplorerData(filePath = EXPLORER_JSON_PATH) {
  const data = buildExplorerData();
  fs.writeFileSync(filePath, stableStringify(data));
  return data;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeExplorerData();
}
