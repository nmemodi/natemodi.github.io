import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadRegistry } from './logo-agent-data-utils.mjs';

const CHECKS = [
  ['schema-basics', 10],
  ['canonical-logo-urls', 18],
  ['source-safety', 8],
  ['tool-coverage', 12],
  ['direction-coverage', 12],
  ['recommendations', 12],
  ['curated-mix', 10],
  ['initial-mix', 8],
  ['brand-letter-constraint', 10],
  ['expected-summary', 10],
];

export class GalleryEvaluationError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'GalleryEvaluationError';
    this.context = context;
  }
}

export function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(ROOT, filePath), 'utf8'));
}

export function summarizeGallery(manifest, tools = loadRegistry()) {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const concepts = Array.isArray(manifest.concepts) ? manifest.concepts : [];
  const recommendations = Array.isArray(manifest.recommendations) ? manifest.recommendations : [];
  const variationCounts = countBy(concepts, (concept) => concept.variationType || 'unspecified');
  const toolCounts = countBy(concepts, (concept) => concept.toolSlug || 'missing');
  const directionCounts = countBy(concepts, (concept) => concept.directionId || 'missing');

  return {
    brandName: manifest.brand && manifest.brand.name,
    conceptCount: concepts.length,
    toolCount: Object.keys(toolCounts).filter((slug) => toolBySlug.has(slug)).length,
    directionCount: Array.isArray(manifest.directions) ? manifest.directions.length : 0,
    recommendedCount: recommendations.length,
    curatedSourceCount: concepts.filter(hasCuratedSource).length,
    initialConceptCount: concepts.filter((concept) => {
      const tool = toolBySlug.get(concept.toolSlug);
      return isInitialConcept(concept, tool);
    }).length,
    wildcardCount: concepts.filter((concept) => concept.variationType === 'wildcard').length,
    toolSlugs: Object.keys(toolCounts).sort(),
    directionIds: (Array.isArray(manifest.directions) ? manifest.directions : [])
      .map((direction) => direction.id)
      .sort(),
    recommendationIds: recommendations.map((recommendation) => recommendation.conceptId),
    variationCounts,
    directionCounts,
  };
}

export function evaluateGalleryManifest(manifest, options = {}) {
  const tools = options.tools || loadRegistry();
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const summary = summarizeGallery(manifest, tools);
  const brandBrief = options.brandBrief || {};
  const expectedSummary = options.expectedSummary || null;
  const checks = [];
  const checkWeight = new Map(CHECKS);

  addCheck(checks, 'schema-basics', isValidBasicShape(manifest), checkWeight, 'Manifest has version, brand, unique concept IDs, and a bounded concept array.');
  addCheck(checks, 'canonical-logo-urls', allConceptUrlsAreCanonical(manifest, toolBySlug), checkWeight, 'Concept URLs are canonical natemodi.com Logo Lab URLs with matching tool slugs and v=1 hashes.');
  addCheck(checks, 'source-safety', hasSafeSources(manifest), checkWeight, 'Manifest avoids raw HTML/script payloads and includes trademark-starting-point language.');
  addCheck(checks, 'tool-coverage', summary.toolCount >= 5, checkWeight, 'Gallery uses at least five Logo Lab tools.', { toolCount: summary.toolCount });
  addCheck(checks, 'direction-coverage', hasDirectionCoverage(manifest), checkWeight, 'Gallery has 3-6 non-empty directions and all concept direction IDs are filterable.');
  addCheck(checks, 'recommendations', hasRecommendationCoverage(manifest), checkWeight, 'Gallery has five unique recommendations with reasons that point to valid concepts.');
  addCheck(checks, 'curated-mix', summary.curatedSourceCount >= 30 && summary.wildcardCount <= 5, checkWeight, 'Gallery is seeded by curated Explorer concepts and caps wildcard exploration.', {
    curatedSourceCount: summary.curatedSourceCount,
    wildcardCount: summary.wildcardCount,
  });
  addCheck(checks, 'initial-mix', hasInitialCoverage(summary, brandBrief), checkWeight, 'Gallery includes enough initial-customized concepts when the brief provides initials.', {
    initials: brandBrief.initials,
    initialConceptCount: summary.initialConceptCount,
  });
  addCheck(checks, 'brand-letter-constraint', hasBrandLetterConstraint(manifest, toolBySlug, brandBrief), checkWeight, 'Letter-capable concept outputs use the brand leading letter instead of inherited source letters.', {
    leadingLetter: leadingBrandLetter(manifest, brandBrief),
  });
  addCheck(checks, 'expected-summary', !expectedSummary || matchesExpectedSummary(summary, expectedSummary), checkWeight, 'Gallery summary matches the checked-in expected snapshot.');

  const possibleScore = checks.reduce((sum, check) => sum + check.points, 0);
  const score = Math.round((checks.reduce((sum, check) => sum + (check.pass ? check.points : 0), 0) / possibleScore) * 100);
  const minScore = Number.isFinite(options.minScore) ? options.minScore : 90;
  return {
    passed: checks.every((check) => check.pass) && score >= minScore,
    score,
    minScore,
    summary,
    checks,
  };
}

function addCheck(checks, id, pass, weights, message, details = {}) {
  checks.push({
    id,
    pass: Boolean(pass),
    points: weights.get(id),
    message,
    details,
  });
}

function isValidBasicShape(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return false;
  if (manifest.version !== 1) return false;
  if (!manifest.brand || typeof manifest.brand.name !== 'string' || !manifest.brand.name.trim()) return false;
  if (!Array.isArray(manifest.concepts) || manifest.concepts.length < 30 || manifest.concepts.length > 80) return false;
  const ids = manifest.concepts.map((concept) => concept && concept.id);
  return ids.every(Boolean) && new Set(ids).size === ids.length;
}

function allConceptUrlsAreCanonical(manifest, toolBySlug) {
  return (manifest.concepts || []).every((concept) => {
    const urlChecks = [concept.url, concept.embedUrl].every((url) => isCanonicalLogoUrl(url, concept.toolSlug, toolBySlug));
    const sourceCheck = !concept.sourceUrl || isCanonicalLogoUrl(concept.sourceUrl, concept.toolSlug, toolBySlug);
    return urlChecks && sourceCheck;
  });
}

function isCanonicalLogoUrl(value, toolSlug, toolBySlug) {
  let url;
  try {
    url = new URL(String(value || ''));
  } catch {
    return false;
  }
  const slug = url.pathname.split('/').filter(Boolean)[1];
  return url.protocol === 'https:'
    && url.host === 'natemodi.com'
    && url.pathname === `/logo/${slug}/`
    && slug === toolSlug
    && toolBySlug.has(slug)
    && url.hash.includes('v=1')
    && !url.href.includes('index.html');
}

function hasSafeSources(manifest) {
  const combined = JSON.stringify(manifest).toLowerCase();
  const disclaimer = String(manifest.disclaimer || '').toLowerCase();
  return !combined.includes('<script')
    && !combined.includes('javascript:')
    && disclaimer.includes('starting point')
    && disclaimer.includes('trademark');
}

function hasDirectionCoverage(manifest) {
  if (!Array.isArray(manifest.directions) || manifest.directions.length < 3 || manifest.directions.length > 6) return false;
  const directionIds = new Set(manifest.directions.map((direction) => direction.id).filter(Boolean));
  if (directionIds.size !== manifest.directions.length) return false;
  return [...directionIds].every((id) => (manifest.concepts || []).some((concept) => concept.directionId === id))
    && (manifest.concepts || []).every((concept) => directionIds.has(concept.directionId));
}

function hasRecommendationCoverage(manifest) {
  const concepts = new Set((manifest.concepts || []).map((concept) => concept.id));
  const recommendations = Array.isArray(manifest.recommendations) ? manifest.recommendations : [];
  const ids = recommendations.map((recommendation) => recommendation && recommendation.conceptId);
  return recommendations.length === 5
    && new Set(ids).size === 5
    && recommendations.every((recommendation) => concepts.has(recommendation.conceptId) && String(recommendation.reason || '').trim().length >= 20);
}

function hasInitialCoverage(summary, brandBrief) {
  if (!brandBrief.initials) return true;
  const expected = brandBrief.minInitialConcepts || 10;
  return summary.initialConceptCount >= expected;
}

function hasBrandLetterConstraint(manifest, toolBySlug, brandBrief) {
  const leadingLetter = leadingBrandLetter(manifest, brandBrief);
  if (!leadingLetter) return true;
  return (manifest.concepts || []).every((concept) => {
    const meta = toolBySlug.get(concept.toolSlug)?.agentMetadata;
    if (!meta?.supportsInitials || !meta.letterParam) return true;
    return [concept.url, concept.embedUrl].every((value) => urlHashParam(value, meta.letterParam) === leadingLetter);
  });
}

function leadingBrandLetter(manifest, brandBrief) {
  const source = brandBrief.companyName || manifest.brand?.name || '';
  const match = String(source).trim().match(/[A-Za-z0-9]/);
  return match ? match[0].toUpperCase() : '';
}

function urlHashParam(value, key) {
  try {
    return (new URL(String(value)).hash ? new URLSearchParams(new URL(String(value)).hash.slice(1)).get(key) : '').toUpperCase();
  } catch {
    return '';
  }
}

function hasCuratedSource(concept) {
  return Boolean(concept.sourceConceptId && concept.sourceUrl && concept.variationType !== 'wildcard');
}

function isInitialConcept(concept, tool) {
  const meta = tool && tool.agentMetadata;
  return Boolean(meta && meta.supportsInitials && concept.variationType === 'initial-customized');
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function matchesExpectedSummary(summary, expected) {
  return Object.entries(expected).every(([key, value]) => JSON.stringify(summary[key]) === JSON.stringify(value));
}

function parseArgs(argv) {
  const args = { gallery: argv[0], minScore: 90 };
  for (let index = 1; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--brief') args.brief = argv[++index];
    else if (item === '--expected') args.expected = argv[++index];
    else if (item === '--min-score') args.minScore = Number(argv[++index]);
  }
  return args;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.gallery) {
    throw new GalleryEvaluationError('Usage: node scripts/evaluate-logo-agent-gallery.mjs <gallery.json> [--brief brief.json] [--expected summary.json] [--min-score 90]');
  }
  const result = evaluateGalleryManifest(readJsonFile(args.gallery), {
    brandBrief: args.brief ? readJsonFile(args.brief) : {},
    expectedSummary: args.expected ? readJsonFile(args.expected) : null,
    minScore: args.minScore,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.passed) process.exitCode = 1;
}
