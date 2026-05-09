import fs from 'node:fs';
import {
  GENERATED_AT,
  LOGO_BASE_URL,
  LOGO_REFERENCE_LINKS,
  TOOLS_JSON_PATH,
  canonicalToolUrl,
  loadRegistry,
  stableStringify,
} from './logo-agent-data-utils.mjs';

export function buildToolsData() {
  const tools = loadRegistry();
  return {
    version: 1,
    generatedAt: GENERATED_AT,
    baseUrl: LOGO_BASE_URL,
    links: LOGO_REFERENCE_LINKS,
    stableUrlFormat: '/logo/{slug}/#v=1&seed={seed}&{params}',
    sourceFiles: ['public/shared/tools-registry.js'],
    toolCount: tools.length,
    tools: tools.map((tool) => {
      const meta = tool.agentMetadata;
      return {
        slug: tool.slug,
        name: tool.name,
        tagline: tool.tagline,
        defaultSeed: tool.defaultSeed,
        url: canonicalToolUrl(tool.slug),
        defaultUrl: canonicalToolUrl(tool.slug, `v=1&seed=${encodeURIComponent(tool.defaultSeed)}`),
        mode: meta.mode,
        styleTags: meta.styleTags,
        supportsInitials: meta.supportsInitials,
        supportsRecoloring: meta.supportsRecoloring,
        colorParams: meta.colorParams,
        letterParam: meta.letterParam || null,
        safeMutationParams: meta.safeMutationParams,
        bestFor: meta.bestFor,
        agentGuidance: meta.agentGuidance,
      };
    }),
  };
}

export function writeToolsData(filePath = TOOLS_JSON_PATH) {
  const data = buildToolsData();
  fs.writeFileSync(filePath, stableStringify(data));
  return data;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeToolsData();
}
