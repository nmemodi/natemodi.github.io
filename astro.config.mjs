import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const site = 'https://natemodi.com';
const siteOrigin = new URL(site).origin;

function externalLinksInNewTabs() {
  return (tree) => {
    const nodes = [tree];

    while (nodes.length > 0) {
      const node = nodes.pop();

      if (node?.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;

        if (typeof href === 'string') {
          try {
            const url = new URL(href, site);
            const isExternal =
              (url.protocol === 'http:' || url.protocol === 'https:') &&
              url.origin !== siteOrigin;

            if (isExternal) {
              const existingRel = Array.isArray(node.properties.rel)
                ? node.properties.rel
                : typeof node.properties.rel === 'string'
                  ? node.properties.rel.split(/\s+/)
                  : [];

              node.properties.target = '_blank';
              node.properties.rel = [...new Set([...existingRel, 'noopener', 'noreferrer'])];
            }
          } catch {
            // Leave malformed or non-URL link values unchanged.
          }
        }
      }

      if (Array.isArray(node?.children)) {
        nodes.push(...node.children);
      }
    }
  };
}

export default defineConfig({
  site,
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [externalLinksInNewTabs],
  },
  output: 'static',
  server: {
    host: '0.0.0.0',
  },
});
