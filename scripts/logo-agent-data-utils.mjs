import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
export const LOGO_BASE_URL = 'https://natemodi.com/logo';
export const LOGO_LANDING_PAGE_URL = `${LOGO_BASE_URL}/`;
export const LOGO_GITHUB_REPO_URL = 'https://github.com/nmemodi/natemodi.github.io';
export const LOGO_REFERENCE_LINKS = {
  landingPage: LOGO_LANDING_PAGE_URL,
  githubRepo: LOGO_GITHUB_REPO_URL,
};
export const TOOL_REGISTRY_PATH = path.join(ROOT, 'public/shared/tools-registry.js');
export const EXPLORER_PRESETS_PATH = path.join(ROOT, 'public/logo/explorer/presets.json');
export const TOOLS_JSON_PATH = path.join(ROOT, 'public/logo/tools.json');
export const EXPLORER_JSON_PATH = path.join(ROOT, 'public/logo/explorer.json');
export const GENERATED_AT = '2026-05-07T00:00:00.000Z';

export class RegistryLoadError extends Error {
  constructor(message, context = {}) {
    super(formatMessage('RegistryLoadError', message, context));
    this.name = 'RegistryLoadError';
    this.context = context;
  }
}

export class ExplorerPresetError extends Error {
  constructor(message, context = {}) {
    super(formatMessage('ExplorerPresetError', message, context));
    this.name = 'ExplorerPresetError';
    this.context = context;
  }
}

export class AgentDataValidationError extends Error {
  constructor(message, context = {}) {
    super(formatMessage('AgentDataValidationError', message, context));
    this.name = 'AgentDataValidationError';
    this.context = context;
  }
}

function formatMessage(name, message, context) {
  const details = Object.entries(context)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(' ');
  return details ? `${name}: ${message} (${details})` : `${name}: ${message}`;
}

export function loadRegistry(registryPath = TOOL_REGISTRY_PATH) {
  let source;
  try {
    source = fs.readFileSync(registryPath, 'utf8');
  } catch (error) {
    throw new RegistryLoadError('could not read tool registry', {
      file: registryPath,
      code: error.code,
    });
  }

  const context = {
    window: {},
    document: {},
    location: { pathname: '/logo/' },
  };

  try {
    vm.createContext(context);
    vm.runInContext(source, context, { filename: registryPath });
  } catch (error) {
    throw new RegistryLoadError('could not evaluate tool registry', {
      file: registryPath,
      error: error.message,
    });
  }

  const tools = context.window.LogoTools && context.window.LogoTools.TOOLS;
  if (!Array.isArray(tools)) {
    throw new RegistryLoadError('window.LogoTools.TOOLS was not exported', {
      file: registryPath,
    });
  }

  validateTools(tools, registryPath);
  return tools;
}

export function loadPresets(presetsPath = EXPLORER_PRESETS_PATH) {
  let raw;
  try {
    raw = fs.readFileSync(presetsPath, 'utf8');
  } catch (error) {
    throw new ExplorerPresetError('could not read Explorer presets', {
      file: presetsPath,
      code: error.code,
    });
  }

  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new ExplorerPresetError('Explorer presets root must be an object', {
        file: presetsPath,
      });
    }
    return data;
  } catch (error) {
    if (error instanceof ExplorerPresetError) throw error;
    throw new ExplorerPresetError('could not parse Explorer presets JSON', {
      file: presetsPath,
      error: error.message,
    });
  }
}

export function validateTools(tools, sourceFile = TOOL_REGISTRY_PATH) {
  const seen = new Set();
  tools.forEach((tool, index) => {
    const context = { file: sourceFile, index, slug: tool && tool.slug };
    if (!tool || typeof tool !== 'object') {
      throw new AgentDataValidationError('tool must be an object', context);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(tool.slug || '')) {
      throw new AgentDataValidationError('tool slug is invalid', context);
    }
    if (seen.has(tool.slug)) {
      throw new AgentDataValidationError('tool slug is duplicated', context);
    }
    seen.add(tool.slug);
    ['name', 'tagline', 'defaultSeed'].forEach((field) => {
      if (typeof tool[field] !== 'string' || !tool[field].trim()) {
        throw new AgentDataValidationError('tool field is missing', { ...context, field });
      }
    });
    validateAgentMetadata(tool, context);
  });
}

function validateAgentMetadata(tool, context) {
  const meta = tool.agentMetadata;
  if (!meta || typeof meta !== 'object') {
    throw new AgentDataValidationError('tool agentMetadata is missing', context);
  }
  if (!['abstract', 'letter'].includes(meta.mode)) {
    throw new AgentDataValidationError('tool agentMetadata.mode is invalid', context);
  }
  ['styleTags', 'safeMutationParams', 'bestFor', 'agentGuidance'].forEach((field) => {
    if (!Array.isArray(meta[field]) || meta[field].length === 0) {
      throw new AgentDataValidationError('tool agentMetadata array is missing', {
        ...context,
        field,
      });
    }
  });
  if (typeof meta.supportsInitials !== 'boolean') {
    throw new AgentDataValidationError('tool supportsInitials must be boolean', context);
  }
  if (typeof meta.supportsRecoloring !== 'boolean') {
    throw new AgentDataValidationError('tool supportsRecoloring must be boolean', context);
  }
  if (!meta.colorParams || typeof meta.colorParams !== 'object') {
    throw new AgentDataValidationError('tool colorParams is missing', context);
  }
  if (meta.supportsInitials && typeof meta.letterParam !== 'string') {
    throw new AgentDataValidationError('letter tool must expose letterParam', context);
  }
}

export function validatePresets(presets, tools, sourceFile = EXPLORER_PRESETS_PATH) {
  const knownSlugs = new Set(tools.map((tool) => tool.slug));
  Object.entries(presets).forEach(([slug, seeds]) => {
    if (!knownSlugs.has(slug)) {
      throw new AgentDataValidationError('preset slug is not in tool registry', {
        file: sourceFile,
        slug,
      });
    }
    if (!Array.isArray(seeds) || seeds.length === 0) {
      throw new AgentDataValidationError('preset seed bank must be a non-empty array', {
        file: sourceFile,
        slug,
      });
    }
    seeds.forEach((seed, index) => {
      if (!isSafeSeed(seed)) {
        throw new AgentDataValidationError('preset seed is invalid', {
          file: sourceFile,
          slug,
          index,
          seed,
        });
      }
    });
  });
}

export function isSafeSeed(seed) {
  return typeof seed === 'string' && /^[a-zA-Z0-9_-]{1,32}$/.test(seed);
}

export function canonicalToolUrl(slug, hash = '') {
  const cleanHash = String(hash || '').replace(/^#/, '');
  return cleanHash
    ? `${LOGO_BASE_URL}/${slug}/#${cleanHash}`
    : `${LOGO_BASE_URL}/${slug}/`;
}

export function randomSeedHash(seed) {
  return `v=1&r=1&seed=${encodeURIComponent(seed)}`;
}

export function conceptId(slug, index) {
  return `${slug}-${String(index + 1).padStart(4, '0')}`;
}

export function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
