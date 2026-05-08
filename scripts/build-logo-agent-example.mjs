import fs from 'node:fs';
import path from 'node:path';
import {
  EXPLORER_JSON_PATH,
  ROOT,
  TOOLS_JSON_PATH,
  stableStringify,
} from './logo-agent-data-utils.mjs';

const EXAMPLE_PATH = path.join(ROOT, 'public/logo/examples/agent-gallery/gallery.json');
const BRAND = {
  name: 'VectorKit',
  category: 'AI developer platform',
  audience: 'Engineering teams building reliable agent workflows',
  attributes: ['precise', 'technical', 'calm', 'modular', 'trustworthy'],
  colors: {
    background: '#ffffff',
    foreground: '#111111',
    accent: '#2563eb',
    preferred: ['#111111', '#ffffff', '#2563eb'],
    forbidden: ['generic AI sparkle gradients']
  },
  constraints: ['must work in black and white', 'must read at favicon size', 'avoid mascots']
};
const PRIMARY_INITIAL = BRAND.name.slice(0, 1).toUpperCase();

const DIRECTIONS = [
  {
    id: 'signal-systems',
    name: 'Signal Systems',
    description: 'Linear and striped marks that suggest reliable signal, routing, and agent coordination.'
  },
  {
    id: 'precise-geometry',
    name: 'Precise Geometry',
    description: 'Radial and interlocking systems with a technical, engineered character.'
  },
  {
    id: 'platform-grid',
    name: 'Platform Grid',
    description: 'Modular grid marks that feel extensible, systematic, and product-native.'
  },
  {
    id: 'bold-containers',
    name: 'Bold Containers',
    description: 'Contained abstract marks with high recognition and strong app-icon potential.'
  },
  {
    id: 'letter-marks',
    name: 'Letter Marks',
    description: 'Initial-driven marks using the leading V as a compact product signature.'
  }
];

const DIRECTION_BY_TOOL = {
  'line-warp': 'signal-systems',
  'echo-stripes': 'signal-systems',
  'interlocking-circles': 'precise-geometry',
  'polygon-rosette': 'precise-geometry',
  'shape-tiles': 'platform-grid',
  'dot-grid': 'platform-grid',
  'sliced-shapes': 'bold-containers',
  'slash-mark': 'bold-containers',
  'parallel-letters': 'letter-marks',
  'brutalist-letters': 'letter-marks'
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function appendParams(hash, params) {
  const search = new URLSearchParams(hash);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) search.set(key, value);
  });
  return search.toString();
}

function colorParamsFor(tool, index) {
  const params = {};
  const colors = index % 2 === 0
    ? { background: 'ffffff', foreground: '111111', secondary: '2563eb' }
    : { background: '111111', foreground: 'ffffff', secondary: '2563eb' };
  Object.entries(tool.colorParams || {}).forEach(([role, key]) => {
    params[key] = colors[role] || colors.foreground;
  });
  return params;
}

function variationTypeFor(tool, localIndex) {
  if (localIndex < 2) return 'recolored-curated';
  if (tool.supportsInitials && localIndex >= 3) return 'initial-customized';
  if (!tool.supportsInitials && localIndex === 4) return 'wildcard';
  return 'lightly-varied-curated';
}

function brandLetterParamsFor(tool) {
  if (!tool.supportsInitials || !tool.letterParam) return {};
  return { [tool.letterParam]: PRIMARY_INITIAL };
}

export function buildExampleGallery() {
  const explorer = readJson(EXPLORER_JSON_PATH);
  const toolsData = readJson(TOOLS_JSON_PATH);
  const toolBySlug = new Map(toolsData.tools.map((tool) => [tool.slug, tool]));
  const bySlug = new Map();
  explorer.concepts.forEach((concept) => {
    if (!bySlug.has(concept.toolSlug)) bySlug.set(concept.toolSlug, []);
    bySlug.get(concept.toolSlug).push(concept);
  });

  const concepts = [];
  Array.from(toolBySlug.keys()).forEach((slug) => {
    const tool = toolBySlug.get(slug);
    const seeds = bySlug.get(slug) || [];
    seeds.slice(0, 5).forEach((source, localIndex) => {
      const rank = concepts.length + 1;
      const variationType = variationTypeFor(tool, localIndex);
      const hash = appendParams(source.hash, {
        ...colorParamsFor(tool, rank),
        ...brandLetterParamsFor(tool)
      });
      const url = `${tool.url}#${hash}`;
      const directionId = DIRECTION_BY_TOOL[slug];
      const colorsUsed = rank % 2 === 0
        ? ['#ffffff', '#111111', '#2563eb']
        : ['#111111', '#ffffff', '#2563eb'];

      concepts.push({
        id: `vectorkit-${String(rank).padStart(3, '0')}`,
        rank,
        directionId,
        sourceConceptId: source.id,
        sourceUrl: source.url,
        toolSlug: slug,
        toolName: tool.name,
        url,
        embedUrl: url,
        colorsUsed,
        variationType,
        rationale: rationaleFor(tool, directionId, variationType),
        bestFor: bestFor(directionId),
        tags: Array.from(new Set([directionId, tool.mode, ...tool.styleTags])).slice(0, 8),
        isRecommended: rank <= 5,
        recommendationReason: rank <= 5
          ? 'Strong silhouette, clear technical fit, and useful contrast as a system seed.'
          : undefined
      });
    });
  });

  return {
    version: 1,
    brand: BRAND,
    summary: 'A sample Logo Lab gallery for VectorKit, an AI developer platform that needs a precise, modular, high-contrast identity system.',
    directions: DIRECTIONS.map((direction) => ({
      ...direction,
      conceptIds: concepts.filter((concept) => concept.directionId === direction.id).map((concept) => concept.id)
    })),
    concepts,
    recommendations: concepts.slice(0, 5).map((concept) => ({
      conceptId: concept.id,
      reason: concept.recommendationReason
    })),
    disclaimer: 'Concepts are starting points. Check distinctiveness, conflicts, and trademark availability before commercial use.'
  };
}

function rationaleFor(tool, directionId, variationType) {
  if (variationType === 'initial-customized') {
    return `${tool.name} turns the leading V into a compact technical mark while preserving the curated source structure.`;
  }
  if (variationType === 'wildcard') {
    return `${tool.name} adds one controlled wildcard option while staying inside Logo Lab's high-contrast geometric vocabulary.`;
  }
  if (directionId === 'signal-systems') {
    return `${tool.name} creates a controlled signal motif that fits reliable agent infrastructure without falling into generic AI symbols.`;
  }
  if (directionId === 'precise-geometry') {
    return `${tool.name} gives the system a precise geometric presence with enough structure to hold up across product surfaces.`;
  }
  if (directionId === 'platform-grid') {
    return `${tool.name} emphasizes modularity and repeatability, useful for an extensible developer platform.`;
  }
  return `${tool.name} offers a bold high-contrast container that can read clearly as an app icon or favicon.`;
}

function bestFor(directionId) {
  return {
    'signal-systems': 'agent orchestration, routing, and observability surfaces',
    'precise-geometry': 'premium product marks and technical identity systems',
    'platform-grid': 'developer platforms, SDKs, and modular product suites',
    'bold-containers': 'app icons, launch pages, and compact brand stamps',
    'letter-marks': 'initial-led identities and social avatars'
  }[directionId] || 'brand exploration';
}

export function writeExampleGallery(filePath = EXAMPLE_PATH) {
  const data = buildExampleGallery();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, stableStringify(data));
  return data;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeExampleGallery();
}
